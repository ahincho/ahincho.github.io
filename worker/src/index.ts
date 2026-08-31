import { DurableObject } from 'cloudflare:workers';

export interface Env {
	COUNTERS: DurableObjectNamespace<Counters>;
	ALLOWED_ORIGINS: string;
	COUNTER_KEYS: string;
	HASH_SALT: string;
}

const VISITOR_TTL_SECONDS = 60 * 60 * 24;
const BOT_PATTERN = /bot|crawler|spider|slurp|facebookexternalhit|headless|preview|monitor|curl|wget/i;
const ROUTE = /^\/v1\/counters(?:\/([a-z0-9-]{1,64}))?$/;

export class Counters extends DurableObject<Env> {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.ctx.storage.sql.exec(`
			CREATE TABLE IF NOT EXISTS counters (
				key   TEXT PRIMARY KEY,
				value INTEGER NOT NULL DEFAULT 0
			);
			CREATE TABLE IF NOT EXISTS visitors (
				token   TEXT NOT NULL,
				key     TEXT NOT NULL,
				expires INTEGER NOT NULL,
				PRIMARY KEY (token, key)
			);
		`);
	}

	read(key: string): number {
		const row = this.ctx.storage.sql
			.exec<{ value: number }>('SELECT value FROM counters WHERE key = ?', key)
			.toArray()[0];
		return row?.value ?? 0;
	}

	readAll(keys: string[]): Record<string, number> {
		const stored = new Map(
			this.ctx.storage.sql
				.exec<{ key: string; value: number }>('SELECT key, value FROM counters')
				.toArray()
				.map((row) => [row.key, row.value] as const),
		);
		return Object.fromEntries(keys.map((key) => [key, stored.get(key) ?? 0]));
	}

	increment(key: string, token: string): { value: number; counted: boolean } {
		const now = Math.floor(Date.now() / 1000);
		const alreadySeen =
			this.ctx.storage.sql
				.exec(
					'SELECT 1 FROM visitors WHERE token = ? AND key = ? AND expires >= ?',
					token,
					key,
					now,
				)
				.toArray().length > 0;
		if (alreadySeen) {
			return { value: this.read(key), counted: false };
		}

		this.ctx.storage.sql.exec('DELETE FROM visitors WHERE expires < ?', now);
		this.ctx.storage.sql.exec(
			'INSERT OR REPLACE INTO visitors (token, key, expires) VALUES (?, ?, ?)',
			token,
			key,
			now + VISITOR_TTL_SECONDS,
		);
		const row = this.ctx.storage.sql
			.exec<{ value: number }>(
				`INSERT INTO counters (key, value) VALUES (?, 1)
				 ON CONFLICT(key) DO UPDATE SET value = value + 1
				 RETURNING value`,
				key,
			)
			.toArray()[0];
		return { value: row.value, counted: true };
	}
}

function resolveCors(request: Request, env: Env): Record<string, string> | 'forbidden' | null {
	const origin = request.headers.get('Origin');
	if (!origin) return null;
	const allowed = env.ALLOWED_ORIGINS.split(',').map((value) => value.trim());
	if (!allowed.includes(origin)) return 'forbidden';
	return {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Max-Age': '86400',
		Vary: 'Origin',
	};
}

/**
 * Salted hash of IP + user agent + day. The salt makes it impossible to check
 * whether a given IP visited, so no personal data is ever stored.
 */
async function visitorToken(request: Request, salt: string): Promise<string> {
	const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
	const userAgent = request.headers.get('User-Agent') ?? 'unknown';
	const day = new Date().toISOString().slice(0, 10);
	const digest = await crypto.subtle.digest(
		'SHA-256',
		new TextEncoder().encode(`${salt}:${ip}:${userAgent}:${day}`),
	);
	return [...new Uint8Array(digest)]
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('')
		.slice(0, 32);
}

function json(body: unknown, status: number, headers: Record<string, string>): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { ...headers, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
	});
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const cors = resolveCors(request, env);
		if (cors === 'forbidden') {
			return new Response('Forbidden origin', { status: 403 });
		}
		const headers = cors ?? {};

		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers });
		}

		const match = ROUTE.exec(new URL(request.url).pathname);
		if (!match) {
			return json({ error: 'not_found' }, 404, headers);
		}

		const key = match[1];
		const allowedKeys = env.COUNTER_KEYS.split(',').map((value) => value.trim());
		if (key && !allowedKeys.includes(key)) {
			return json({ error: 'unknown_key' }, 404, headers);
		}

		const stub = env.COUNTERS.get(env.COUNTERS.idFromName('global'));

		if (request.method === 'GET') {
			return key
				? json({ key, value: await stub.read(key) }, 200, headers)
				: json(await stub.readAll(allowedKeys), 200, headers);
		}

		if (request.method === 'POST' && key) {
			if (BOT_PATTERN.test(request.headers.get('User-Agent') ?? '')) {
				return json({ key, value: await stub.read(key), counted: false }, 200, headers);
			}
			const token = await visitorToken(request, env.HASH_SALT);
			const { value, counted } = await stub.increment(key, token);
			return json({ key, value, counted }, 200, headers);
		}

		return json({ error: 'method_not_allowed' }, 405, headers);
	},
} satisfies ExportedHandler<Env>;
