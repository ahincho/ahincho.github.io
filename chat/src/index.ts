import { DurableObject } from 'cloudflare:workers';
import { ANSWER_MAX, sanitise, systemPrompt } from './answer';

export interface Env {
	LIMITS: DurableObjectNamespace<Limits>;
	/** Where the corpus is published; the site's own deploy is what updates it. */
	CORPUS_URL: string;
	ALLOWED_ORIGINS: string;
	ACCOUNT_ID: string;
	GATEWAY_ID: string;
	/** `provider/model`, comma separated: the order they are tried in. */
	MODEL: string;
	HASH_SALT: string;
	/** Gateway authentication — set with `wrangler secret put`. */
	CF_AIG_TOKEN: string;
	/** Google AI Studio key — set with `wrangler secret put`. */
	GEMINI_API_KEY: string;
}

const QUESTION_MAX = 300;
const HISTORY_MAX = 4;
const WINDOW_SECONDS = 60 * 60;
const PER_WINDOW = 12;
const GLOBAL_PER_WINDOW = 90;
const CORPUS_TTL_MS = 10 * 60 * 1000;
// Two of these back to back is already a long wait in a chat bubble, so the
// deadline is what bounds the worst case, not the provider's patience.
const UPSTREAM_TIMEOUT_MS = 10_000;
const BOT_PATTERN =
	/bot|crawler|spider|slurp|facebookexternalhit|headless|preview|monitor|curl|wget/i;

/**
 * Two caps in one table: what a single visitor may ask, and what everyone may
 * ask together. The counter Worker already had this shape, so the two behave
 * the same way and neither stores anything personal.
 */
export class Limits extends DurableObject<Env> {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.ctx.storage.sql.exec(`
			CREATE TABLE IF NOT EXISTS asks (
				token   TEXT NOT NULL,
				at      INTEGER NOT NULL
			);
			CREATE INDEX IF NOT EXISTS asks_token ON asks (token, at);
		`);
	}

	take(token: string): { allowed: boolean; remaining: number } {
		const now = Math.floor(Date.now() / 1000);
		const since = now - WINDOW_SECONDS;
		this.ctx.storage.sql.exec('DELETE FROM asks WHERE at < ?', since);

		// The visitor key is derived from the address, and a dual-stack client can
		// present a different one from request to request, so the per-visitor cap
		// is a deterrent rather than a guarantee. The window total is what actually
		// keeps a burst off a free tier measured in single-digit requests a minute.
		const total = this.ctx.storage.sql
			.exec<{ n: number }>('SELECT COUNT(*) AS n FROM asks WHERE at >= ?', since)
			.toArray()[0].n;

		if (total >= GLOBAL_PER_WINDOW) return { allowed: false, remaining: 0 };

		const used = this.ctx.storage.sql
			.exec<{ n: number }>(
				'SELECT COUNT(*) AS n FROM asks WHERE token = ? AND at >= ?',
				token,
				since,
			)
			.toArray()[0].n;

		if (used >= PER_WINDOW) return { allowed: false, remaining: 0 };

		this.ctx.storage.sql.exec('INSERT INTO asks (token, at) VALUES (?, ?)', token, now);
		return { allowed: true, remaining: PER_WINDOW - used - 1 };
	}
}

/**
 * Salted hash of IP, user agent and the day. The salt makes it impossible to
 * check whether a given address asked anything, so no personal data is stored.
 */
async function visitorToken(request: Request, salt: string): Promise<string> {
	const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
	const agent = request.headers.get('User-Agent') ?? 'unknown';
	const day = new Date().toISOString().slice(0, 10);
	const digest = await crypto.subtle.digest(
		'SHA-256',
		new TextEncoder().encode(`${salt}:${ip}:${agent}:${day}`),
	);
	return [...new Uint8Array(digest)]
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('')
		.slice(0, 32);
}

let cached: { at: number; languages: Record<string, string> } | null = null;

async function corpus(env: Env, lang: string): Promise<string> {
	if (!cached || Date.now() - cached.at > CORPUS_TTL_MS) {
		const response = await fetch(env.CORPUS_URL, { cf: { cacheTtl: 300 } });
		if (!response.ok) throw new Error(`corpus ${response.status}`);
		const payload = (await response.json()) as { languages: Record<string, string> };
		cached = { at: Date.now(), languages: payload.languages };
	}
	return cached.languages[lang] ?? cached.languages.es;
}

function cors(request: Request, env: Env): Record<string, string> | 'forbidden' | null {
	const origin = request.headers.get('Origin');
	if (!origin) return null;
	const allowed = env.ALLOWED_ORIGINS.split(',').map((value) => value.trim());
	if (!allowed.includes(origin)) return 'forbidden';
	return {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Max-Age': '86400',
		Vary: 'Origin',
	};
}

function json(body: unknown, status: number, headers: Record<string, string>): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { ...headers, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
	});
}

interface Ask {
	question?: unknown;
	lang?: unknown;
	history?: unknown;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const headers = cors(request, env);
		if (headers === 'forbidden') return new Response('Forbidden origin', { status: 403 });
		const corsHeaders = headers ?? {};

		if (request.method === 'OPTIONS')
			return new Response(null, { status: 204, headers: corsHeaders });
		if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, corsHeaders);

		let body: Ask;
		try {
			body = (await request.json()) as Ask;
		} catch {
			return json({ error: 'bad_request' }, 400, corsHeaders);
		}

		const question = typeof body.question === 'string' ? body.question.trim() : '';
		if (!question || question.length > QUESTION_MAX) {
			return json({ error: 'bad_question' }, 400, corsHeaders);
		}
		const lang = body.lang === 'en' ? 'en' : 'es';
		const history = Array.isArray(body.history)
			? body.history
					.slice(-HISTORY_MAX)
					.filter(
						(turn): turn is { role: string; content: string } =>
							!!turn &&
							typeof turn === 'object' &&
							typeof (turn as { content?: unknown }).content === 'string',
					)
					.map((turn) => ({
						role: turn.role === 'assistant' ? 'assistant' : 'user',
						content: String(turn.content).slice(0, ANSWER_MAX),
					}))
			: [];

		if (BOT_PATTERN.test(request.headers.get('User-Agent') ?? '')) {
			return json({ error: 'rate_limited' }, 429, corsHeaders);
		}

		const token = await visitorToken(request, env.HASH_SALT);
		const stub = env.LIMITS.get(env.LIMITS.idFromName('global'));
		const { allowed, remaining } = await stub.take(token);
		if (!allowed) return json({ error: 'rate_limited' }, 429, corsHeaders);

		let document: string;
		try {
			document = await corpus(env, lang);
		} catch {
			return json({ error: 'corpus_unavailable' }, 503, corsHeaders);
		}

		const messages = [
			{ role: 'system', content: systemPrompt(document, lang) },
			...history,
			{ role: 'user', content: question },
		];

		// MODEL is a preference order, not a single name. Free tiers are thin and
		// the newest model is the most contended, so a spent minute or an overloaded
		// model becomes a second attempt elsewhere instead of an error bubble.
		let upstream: Response | undefined;
		for (const model of env.MODEL.split(',')
			.map((name) => name.trim())
			.filter(Boolean)) {
			upstream = undefined;
			try {
				upstream = await fetch(
					`https://gateway.ai.cloudflare.com/v1/${env.ACCOUNT_ID}/${env.GATEWAY_ID}/compat/chat/completions`,
					{
						method: 'POST',
						headers: {
							'cf-aig-authorization': `Bearer ${env.CF_AIG_TOKEN}`,
							Authorization: `Bearer ${env.GEMINI_API_KEY}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							model,
							temperature: 0.2,
							// Gemini 3 models always reason and cannot be told not to, and the
							// budget below is shared between thinking and the answer, so a tight
							// cap spends itself before the first word. Keep the effort low and
							// leave headroom; brevity is the prompt's job, not the cap's.
							reasoning_effort: 'low',
							max_tokens: 1600,
							messages,
						}),
						signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
					},
				);
			} catch (cause) {
				// A model that keeps someone waiting has already failed them, so the
				// deadline is short and the next one on the list gets the turn.
				console.error(`gateway stalled on ${model}: ${cause}`);
				continue;
			}
			if (upstream.ok) break;

			// The reader gets nothing actionable, so the reason belongs in the logs:
			// a wrong model name and a spent quota look identical from outside.
			console.error(
				`gateway ${upstream.status} on ${model}: ${(await upstream.text()).slice(0, 300)}`,
			);

			// Only a busy provider is worth asking again; a malformed request would
			// be malformed for every model on the list.
			if (upstream.status !== 429 && upstream.status !== 503) break;
		}

		if (!upstream || !upstream.ok) {
			const status = upstream?.status === 429 ? 429 : 502;
			return json({ error: status === 429 ? 'rate_limited' : 'upstream' }, status, corsHeaders);
		}

		const payload = (await upstream.json()) as {
			choices?: { message?: { content?: string }; finish_reason?: string }[];
			usage?: unknown;
		};
		if (payload.choices?.[0]?.finish_reason === 'length') {
			// The answer was cut mid-sentence: the budget above needs raising.
			console.warn(`truncated: ${JSON.stringify(payload.usage ?? {})}`);
		}
		const answer = sanitise(payload.choices?.[0]?.message?.content ?? '');
		if (!answer) return json({ error: 'empty' }, 502, corsHeaders);

		return json({ answer, remaining }, 200, corsHeaders);
	},
} satisfies ExportedHandler<Env>;
