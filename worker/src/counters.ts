/**
 * The decisions the endpoint makes before it touches storage. Nothing here
 * imports the Workers runtime, so it can be tested with plain vitest.
 */

/** Counters only ever go up. Reactions can be taken back. */
export type Family = 'counters' | 'reactions';

export interface Route {
	family: Family;
	/** A single counter, or null for the whole family. */
	key: string | null;
}

const PATH = /^\/v1\/(counters|reactions)(?:\/([a-z0-9-]{1,64}))?\/?$/;

const BOT_PATTERN =
	/bot|crawler|spider|slurp|facebookexternalhit|headless|preview|monitor|curl|wget/i;

export function route(pathname: string): Route | null {
	const match = PATH.exec(pathname);
	if (!match) return null;
	return { family: match[1] as Family, key: match[2] ?? null };
}

export function keys(list: string): string[] {
	return list
		.split(',')
		.map((entry) => entry.trim())
		.filter(Boolean);
}

export function isBot(userAgent: string | null): boolean {
	return BOT_PATTERN.test(userAgent ?? '');
}

export function cors(
	origin: string | null,
	allowed: string,
): Record<string, string> | 'forbidden' | null {
	if (!origin) return null;
	if (!keys(allowed).includes(origin)) return 'forbidden';
	return {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Max-Age': '86400',
		Vary: 'Origin',
	};
}

/**
 * The site's own day, not UTC and not the reader's.
 *
 * Not UTC, because these numbers are read from Arequipa and a UTC day puts a
 * Peruvian evening into tomorrow's row. Not the reader's either, and that one
 * matters more: the visitor token is derived from the day, so a visitor who got
 * to choose it could mint a fresh identity on every request and walk straight
 * through the rate limit. The day has to be something only the server decides.
 */
const SITE_TIME_ZONE = 'America/Lima';

const DAY = new Intl.DateTimeFormat('en-CA', {
	timeZone: SITE_TIME_ZONE,
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
});

export function today(now = Date.now()): string {
	const parts = new Map(DAY.formatToParts(now).map((part) => [part.type, part.value]));
	return `${parts.get('year')}-${parts.get('month')}-${parts.get('day')}`;
}

/**
 * Salted SHA-256 of whatever identifies the caller. The salt is what makes it
 * safe: without it anyone could hash an address and ask whether that person had
 * been here, so the digest is not reversible and not probeable either.
 *
 * A visit carries the day, so it expires at midnight and the count means
 * "unique visitors today". A reaction does not: its identity has to outlive the
 * night, or every visitor would like the same project again tomorrow.
 */
export async function fingerprint(salt: string, ...parts: string[]): Promise<string> {
	// Each part carries its own length. Joining them with a separator would not
	// be enough: an IPv6 address is full of colons, so two different callers
	// could otherwise write the same string and share an identity.
	const material = [salt, ...parts].map((part) => `${part.length}:${part}`).join('');
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(material));
	return [...new Uint8Array(digest)]
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('')
		.slice(0, 32);
}
