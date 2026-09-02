import { DurableObject } from 'cloudflare:workers';
import { cors, fingerprint, isBot, keys, route, today } from './counters';

export interface Env {
	COUNTERS: DurableObjectNamespace<Counters>;
	ALLOWED_ORIGINS: string;
	COUNTER_KEYS: string;
	REACTION_KEYS: string;
	HASH_SALT: string;
}

const VISITOR_TTL_SECONDS = 60 * 60 * 24;

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
			-- One row per reaction rather than a running total: the count is a
			-- COUNT(*) over these rows, so taking a like back cannot leave the
			-- number and the rows disagreeing.
			CREATE TABLE IF NOT EXISTS reactions (
				key   TEXT NOT NULL,
				token TEXT NOT NULL,
				PRIMARY KEY (key, token)
			);
		`);
	}

	read(key: string): number {
		const row = this.ctx.storage.sql
			.exec<{ value: number }>('SELECT value FROM counters WHERE key = ?', key)
			.toArray()[0];
		return row?.value ?? 0;
	}

	readAll(wanted: string[]): Record<string, number> {
		const stored = new Map(
			this.ctx.storage.sql
				.exec<{ key: string; value: number }>('SELECT key, value FROM counters')
				.toArray()
				.map((row) => [row.key, row.value] as const),
		);
		return Object.fromEntries(wanted.map((key) => [key, stored.get(key) ?? 0]));
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

	reactionCount(key: string): number {
		return (
			this.ctx.storage.sql
				.exec<{ total: number }>('SELECT COUNT(*) AS total FROM reactions WHERE key = ?', key)
				.toArray()[0]?.total ?? 0
		);
	}

	/**
	 * Every count plus the ones this caller gave. The page needs both: a button
	 * that does not know it is already pressed would take the like back on the
	 * next click, which is the opposite of what the visitor asked for.
	 */
	reactions(wanted: string[], token: string): { values: Record<string, number>; mine: string[] } {
		const counts = new Map(
			this.ctx.storage.sql
				.exec<{
					key: string;
					total: number;
				}>('SELECT key, COUNT(*) AS total FROM reactions GROUP BY key')
				.toArray()
				.map((row) => [row.key, row.total] as const),
		);
		const mine = this.ctx.storage.sql
			.exec<{ key: string }>('SELECT key FROM reactions WHERE token = ?', token)
			.toArray()
			.map((row) => row.key);
		return {
			values: Object.fromEntries(wanted.map((key) => [key, counts.get(key) ?? 0])),
			mine: mine.filter((key) => wanted.includes(key)),
		};
	}

	toggle(key: string, token: string): { value: number; mine: boolean } {
		const had =
			this.ctx.storage.sql
				.exec('SELECT 1 FROM reactions WHERE key = ? AND token = ?', key, token)
				.toArray().length > 0;
		if (had) {
			this.ctx.storage.sql.exec('DELETE FROM reactions WHERE key = ? AND token = ?', key, token);
		} else {
			this.ctx.storage.sql.exec('INSERT INTO reactions (key, token) VALUES (?, ?)', key, token);
		}
		return { value: this.reactionCount(key), mine: !had };
	}
}

function json(body: unknown, status: number, headers: Record<string, string>): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { ...headers, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
	});
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const allowed = cors(request.headers.get('Origin'), env.ALLOWED_ORIGINS);
		if (allowed === 'forbidden') {
			return new Response('Forbidden origin', { status: 403 });
		}
		const headers = allowed ?? {};

		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers });
		}

		const target = route(new URL(request.url).pathname);
		if (!target) {
			return json({ error: 'not_found' }, 404, headers);
		}
		if (request.method !== 'GET' && request.method !== 'POST') {
			return json({ error: 'method_not_allowed' }, 405, headers);
		}

		const { family, key } = target;
		const wanted = keys(family === 'counters' ? env.COUNTER_KEYS : env.REACTION_KEYS);
		if (key && !wanted.includes(key)) {
			return json({ error: 'unknown_key' }, 404, headers);
		}
		if (request.method === 'POST' && !key) {
			return json({ error: 'method_not_allowed' }, 405, headers);
		}

		const stub = env.COUNTERS.get(env.COUNTERS.idFromName('global'));
		const agent = request.headers.get('User-Agent');
		const address = request.headers.get('CF-Connecting-IP') ?? 'unknown';
		// A visit is unique per day, so its token carries the date and expires on
		// its own at midnight. A reaction has to outlive the night.
		const who = () =>
			family === 'counters'
				? fingerprint(env.HASH_SALT, address, agent ?? 'unknown', today())
				: fingerprint(env.HASH_SALT, address, agent ?? 'unknown');

		if (family === 'reactions') {
			if (request.method === 'GET') {
				return key
					? json({ key, value: await stub.reactionCount(key) }, 200, headers)
					: json(await stub.reactions(wanted, await who()), 200, headers);
			}
			// Nothing to gain from a crawler flipping likes, and it would only
			// inflate a number nobody chose.
			if (isBot(agent)) {
				return json({ key, value: await stub.reactionCount(key!), mine: false }, 200, headers);
			}
			return json({ key, ...(await stub.toggle(key!, await who())) }, 200, headers);
		}

		if (request.method === 'GET') {
			return key
				? json({ key, value: await stub.read(key) }, 200, headers)
				: json(await stub.readAll(wanted), 200, headers);
		}

		if (isBot(agent)) {
			return json({ key, value: await stub.read(key!), counted: false }, 200, headers);
		}
		const { value, counted } = await stub.increment(key!, await who());
		return json({ key, value, counted }, 200, headers);
	},
} satisfies ExportedHandler<Env>;
