import { DurableObject } from 'cloudflare:workers';
import { ANSWER_MAX, StreamedAnswer, systemPrompt } from './answer';
import { cutoff, dayOf, matches, summarise } from './stats';

export interface Env {
	LIMITS: DurableObjectNamespace<Limits>;
	/** Where the corpus is published; the site's own deploy is what updates it. */
	CORPUS_URL: string;
	ALLOWED_ORIGINS: string;
	ACCOUNT_ID: string;
	GATEWAY_ID: string;
	/** `provider/model`, comma separated: the order they are tried in. */
	MODEL: string;
	/** How hard the model may think before writing. See the note at the call. */
	REASONING: string;
	HASH_SALT: string;
	/** Gateway authentication — set with `wrangler secret put`. */
	CF_AIG_TOKEN: string;
	/** Google AI Studio key — set with `wrangler secret put`. */
	GEMINI_API_KEY: string;
	/** Guards the stats endpoint; without it there is no stats endpoint. */
	STATS_TOKEN: string;
}

const QUESTION_MAX = 300;
const HISTORY_MAX = 4;
const WINDOW_SECONDS = 60 * 60;
const PER_WINDOW = 12;
const GLOBAL_PER_WINDOW = 90;
const CORPUS_TTL_MS = 10 * 60 * 1000;
// A hard stop per attempt, not the thing that paces the fallback: with the two
// running alongside each other, a long deadline no longer costs the reader
// anything and a legitimate nine-second answer is not thrown away.
const UPSTREAM_TIMEOUT_MS = 15_000;
// How long the first model gets alone before the next one joins it. Measured
// good answers land between 1.4s and 9.2s, so this sits under the median and
// above the fast path: most requests never make the second call at all.
const HEDGE_AFTER_MS = 4_000;
// The cache key is a hash of the whole request body, and the body carries the
// corpus, so publishing the site invalidates every entry by itself. That makes
// a long life safe, and a long life is what a portfolio needs: its readers are
// days apart, not seconds.
const CACHE_TTL_SECONDS = 7 * 24 * 60 * 60;
// How long a per-person row is kept so a day's people can be counted. The
// daily totals themselves are a row a day and stay.
const ASKER_DAYS = 60;
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
			-- The limiter throws its rows away after an hour, which is right for a
			-- limit and useless for anyone asking later whether the thing was used.
			-- These keep the shape of a day without keeping the day's questions.
			CREATE TABLE IF NOT EXISTS daily (
				day       TEXT PRIMARY KEY,
				questions INTEGER NOT NULL DEFAULT 0,
				people    INTEGER NOT NULL DEFAULT 0
			);
			CREATE TABLE IF NOT EXISTS askers (
				day   TEXT NOT NULL,
				token TEXT NOT NULL,
				PRIMARY KEY (day, token)
			);
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
		this.record(token);
		return { allowed: true, remaining: PER_WINDOW - used - 1 };
	}

	/**
	 * Counts an ask that got through. The token already carries the day, so one
	 * row per person per day falls out of the primary key rather than needing a
	 * check, and nothing here is any more identifying than the token was.
	 */
	private record(token: string): void {
		const day = dayOf();
		this.ctx.storage.sql.exec(
			`INSERT INTO daily (day, questions, people) VALUES (?, 1, 0)
			 ON CONFLICT(day) DO UPDATE SET questions = questions + 1`,
			day,
		);
		const firstToday =
			this.ctx.storage.sql
				.exec(
					'INSERT INTO askers (day, token) VALUES (?, ?) ON CONFLICT DO NOTHING RETURNING 1',
					day,
					token,
				)
				.toArray().length > 0;
		if (!firstToday) return;

		this.ctx.storage.sql.exec('UPDATE daily SET people = people + 1 WHERE day = ?', day);
		// Somebody is only new once, so this is the rarest moment available to
		// let go of the days nobody will count again.
		this.ctx.storage.sql.exec('DELETE FROM askers WHERE day < ?', cutoff(ASKER_DAYS));
	}

	stats(days: number): { day: string; questions: number; people: number }[] {
		return this.ctx.storage.sql
			.exec<{
				day: string;
				questions: number;
				people: number;
			}>('SELECT day, questions, people FROM daily ORDER BY day DESC LIMIT ?', days)
			.toArray();
	}
}

/**
 * Salted hash of IP, user agent and the day. The salt makes it impossible to
 * check whether a given address asked anything, so no personal data is stored.
 */
async function visitorToken(request: Request, salt: string): Promise<string> {
	const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
	const agent = request.headers.get('User-Agent') ?? 'unknown';
	// The same day the roll-up uses; they have to agree or one visitor would
	// land in two buckets on the same evening.
	const day = dayOf();
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
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Max-Age': '86400',
		Vary: 'Origin',
	};
}

function json(body: unknown, status: number, headers: Record<string, string>): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
	});
}

interface Ask {
	question?: unknown;
	lang?: unknown;
	history?: unknown;
	stream?: unknown;
}

/**
 * The provider speaks server-sent events; this yields the text out of them and
 * leaves both response shapes below reading from the same place.
 */
async function* deltas(upstream: Response): AsyncGenerator<string> {
	const reader = upstream.body!.getReader();
	const decoder = new TextDecoder();
	let pending = '';

	for (;;) {
		const { value, done } = await reader.read();
		if (done) return;
		pending += decoder.decode(value, { stream: true });

		const lines = pending.split('\n');
		pending = lines.pop() ?? '';
		for (const line of lines) {
			const data = line.trim();
			if (!data.startsWith('data:')) continue;
			const frame = data.slice(5).trim();
			if (!frame || frame === '[DONE]') continue;

			let event: { choices?: { delta?: { content?: string }; finish_reason?: string }[] };
			try {
				event = JSON.parse(frame);
			} catch {
				// A frame that will not parse has not failed the answer; the rest of
				// the stream is still worth reading.
				continue;
			}
			if (event.choices?.[0]?.finish_reason === 'length') {
				console.warn('truncated: the token budget ran out mid-answer');
			}
			const piece = event.choices?.[0]?.delta?.content;
			if (piece) yield piece;
		}
	}
}

/** The first attempt that produced an answer, or null once all of them failed. */
function firstAnswer(attempts: Promise<Response | null>[]): Promise<Response | null> {
	return new Promise((resolve) => {
		let left = attempts.length;
		let settled = false;
		for (const attempt of attempts) {
			void attempt.then((response) => {
				left -= 1;
				if (settled) return;
				if (response) {
					settled = true;
					resolve(response);
				} else if (left === 0) {
					settled = true;
					resolve(null);
				}
			});
		}
	});
}

/**
 * Both free-tier models stall often enough that waiting a whole deadline out
 * before trying the next one is what the reader actually feels: a stall used to
 * cost ten seconds before the second model was even asked.
 *
 * So the models on the list are started in turn rather than in sequence. The
 * second joins the first if the first is late, and whichever answers first
 * wins. The spare call only ever happens when someone is already waiting.
 */
async function hedged(env: Env, messages: unknown[]): Promise<Response | null> {
	const models = env.MODEL.split(',')
		.map((name) => name.trim())
		.filter(Boolean);
	const running = new Set<AbortController>();
	let answered = false;
	// Set once someone has won, so cancelling the others is not logged as though
	// the provider had failed: from inside the catch the two look identical.
	let decided = false;

	const ask = async (model: string): Promise<Response | null> => {
		const controller = new AbortController();
		running.add(controller);
		const deadline = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
		try {
			const response = await fetch(
				`https://gateway.ai.cloudflare.com/v1/${env.ACCOUNT_ID}/${env.GATEWAY_ID}/compat/chat/completions`,
				{
					method: 'POST',
					headers: {
						'cf-aig-authorization': `Bearer ${env.CF_AIG_TOKEN}`,
						'cf-aig-cache-ttl': String(CACHE_TTL_SECONDS),
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
						reasoning_effort: env.REASONING,
						max_tokens: 1600,
						stream: true,
						messages,
					}),
					signal: controller.signal,
				},
			);
			if (response.ok) {
				answered = true;
				// Its body is about to be read, so this one must not be aborted below.
				running.delete(controller);
				// HIT means the answer never reached the provider, which is the whole
				// point: it costs no quota and arrives without the model thinking.
				const cache = response.headers.get('cf-aig-cache-status') ?? 'unknown';
				console.log(`${model} answered, cache ${cache}`);
				return response;
			}
			// The reader gets nothing actionable, so the reason belongs in the logs:
			// a wrong model name and a spent quota look identical from outside.
			console.error(
				`gateway ${response.status} on ${model}: ${(await response.text()).slice(0, 300)}`,
			);
			return null;
		} catch (cause) {
			if (!decided) console.error(`gateway stalled on ${model}: ${cause}`);
			return null;
		} finally {
			clearTimeout(deadline);
		}
	};

	const attempts = models.map((model, position) =>
		position === 0
			? ask(model)
			: new Promise<Response | null>((resolve) => {
					setTimeout(() => resolve(answered ? null : ask(model)), HEDGE_AFTER_MS * position);
				}),
	);

	const winner = await firstAnswer(attempts);
	decided = true;
	// Nothing will read the losers, and holding them open helps no one.
	for (const controller of running) controller.abort();
	return winner;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const headers = cors(request, env);
		if (headers === 'forbidden') return new Response('Forbidden origin', { status: 403 });
		const corsHeaders = headers ?? {};

		if (request.method === 'OPTIONS')
			return new Response(null, { status: 204, headers: corsHeaders });

		if (new URL(request.url).pathname === '/stats') {
			const counts = env.LIMITS.get(env.LIMITS.idFromName('global'));
			const everything = summarise(await counts.stats(90));
			// How much the assistant was used is on the page, so the totals are
			// public. Which days carried that traffic is not: it says more about
			// the site than the number does, and nothing on the page needs it.
			if (matches(request.headers.get('X-Stats-Token'), env.STATS_TOKEN)) {
				return json(everything, 200, corsHeaders);
			}
			const { days: _days, ...totals } = everything;
			// Five minutes at the edge. The number moves slowly and the page asks
			// for it on every visit, so the Durable Object need not hear about it.
			return json(totals, 200, {
				...corsHeaders,
				'Cache-Control': 'public, max-age=300',
			});
		}
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

		const upstream = await hedged(env, messages);
		if (!upstream) return json({ error: 'upstream' }, 502, corsHeaders);

		// A page cached before this endpoint learned to stream is still out there
		// expecting one JSON object, so the caller says which shape it wants and
		// both are served from the same upstream read.
		if (body.stream !== true) {
			const answer = new StreamedAnswer();
			let whole = '';
			try {
				for await (const piece of deltas(upstream)) whole += answer.push(piece);
				whole += answer.end();
			} catch (cause) {
				console.error(`stream broke: ${cause}`);
				return json({ error: 'upstream' }, 502, corsHeaders);
			}
			if (!whole) return json({ error: 'empty' }, 502, corsHeaders);
			return json({ answer: whole, remaining }, 200, corsHeaders);
		}

		// One JSON object per line rather than server-sent events: the widget reads
		// the body with fetch either way, and this keeps the failure envelope the
		// same shape as the errors above.
		const answers = new ReadableStream<Uint8Array>({
			async start(controller) {
				const encoder = new TextEncoder();
				const answer = new StreamedAnswer();
				const send = (value: unknown) =>
					controller.enqueue(encoder.encode(`${JSON.stringify(value)}\n`));

				let shown = 0;
				try {
					for await (const piece of deltas(upstream!)) {
						const ready = answer.push(piece);
						if (ready) {
							shown += ready.length;
							send({ delta: ready });
						}
					}
					const tail = answer.end();
					if (tail) {
						shown += tail.length;
						send({ delta: tail });
					}
					send(shown ? { done: true, remaining } : { error: 'empty' });
				} catch (cause) {
					// The reader already has whatever arrived before this; all that is
					// left is to say the answer stopped rather than finished.
					console.error(`stream broke: ${cause}`);
					send({ error: 'upstream' });
				} finally {
					controller.close();
				}
			},
		});

		return new Response(answers, {
			status: 200,
			headers: {
				...corsHeaders,
				'Content-Type': 'application/x-ndjson; charset=utf-8',
				'Cache-Control': 'no-store',
			},
		});
	},
} satisfies ExportedHandler<Env>;
