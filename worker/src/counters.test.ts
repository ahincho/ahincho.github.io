import { describe, expect, it } from 'vitest';
import { cors, fingerprint, isBot, keys, route, today } from './counters';

const SALT = 'a-secret-nobody-else-has';
const ORIGINS = 'https://ahincho.github.io, http://localhost:4321';

describe('route', () => {
	it('reads the family and the key', () => {
		expect(route('/v1/counters/site-visits')).toEqual({ family: 'counters', key: 'site-visits' });
		expect(route('/v1/reactions/nova')).toEqual({ family: 'reactions', key: 'nova' });
	});

	it('reads a family on its own', () => {
		expect(route('/v1/counters')).toEqual({ family: 'counters', key: null });
		expect(route('/v1/reactions/')).toEqual({ family: 'reactions', key: null });
	});

	it('refuses anything that is not one of the two families', () => {
		expect(route('/v1/likes/nova')).toBeNull();
		expect(route('/v1/counters/nova/extra')).toBeNull();
		expect(route('/')).toBeNull();
	});

	it('refuses a key that could be a path or a payload rather than a name', () => {
		expect(route('/v1/counters/../../etc/passwd')).toBeNull();
		expect(route('/v1/counters/Site-Visits')).toBeNull();
		expect(route(`/v1/counters/${'a'.repeat(65)}`)).toBeNull();
	});
});

describe('keys', () => {
	it('trims the entries and drops the empty ones', () => {
		expect(keys('site-visits, cv-downloads ,')).toEqual(['site-visits', 'cv-downloads']);
		expect(keys('')).toEqual([]);
	});
});

describe('cors', () => {
	it('answers a listed origin with its own name, never a wildcard', () => {
		const headers = cors('https://ahincho.github.io', ORIGINS);
		expect(headers).toMatchObject({
			'Access-Control-Allow-Origin': 'https://ahincho.github.io',
			Vary: 'Origin',
		});
	});

	it('forbids an origin that is not on the list', () => {
		expect(cors('https://sitio-ajeno.example', ORIGINS)).toBe('forbidden');
	});

	it('lets a request without an origin through unlabelled', () => {
		expect(cors(null, ORIGINS)).toBeNull();
	});

	it('does not accept an origin that merely starts like an allowed one', () => {
		expect(cors('https://ahincho.github.io.evil.example', ORIGINS)).toBe('forbidden');
	});
});

describe('isBot', () => {
	it('recognises the usual crawlers and command-line clients', () => {
		expect(isBot('Mozilla/5.0 (compatible; Googlebot/2.1)')).toBe(true);
		expect(isBot('curl/8.5.0')).toBe(true);
		expect(isBot(null)).toBe(false);
	});

	it('leaves a real browser alone', () => {
		expect(isBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/140.0 Safari/537.36')).toBe(
			false,
		);
	});
});

describe('fingerprint', () => {
	const address = '203.0.113.9';
	const agent = 'Mozilla/5.0';

	it('gives back an opaque digest, not the parts that went in', async () => {
		const token = await fingerprint(SALT, address, agent);
		expect(token).toMatch(/^[0-9a-f]{32}$/);
		expect(token).not.toContain(address);
	});

	it('is the same caller twice', async () => {
		expect(await fingerprint(SALT, address, agent)).toBe(await fingerprint(SALT, address, agent));
	});

	it('cannot be reproduced without the salt', async () => {
		expect(await fingerprint(SALT, address, agent)).not.toBe(
			await fingerprint('another-salt', address, agent),
		);
	});

	it('separates two callers who differ only in the browser they use', async () => {
		expect(await fingerprint(SALT, address, 'Chrome')).not.toBe(
			await fingerprint(SALT, address, 'Firefox'),
		);
	});

	// The two counters exist for different spans of time, and this is where that
	// difference is actually decided.
	it('makes a visit expire at midnight but a reaction outlive it', async () => {
		const monday = today(Date.parse('2026-09-07T23:59:00Z'));
		const tuesday = today(Date.parse('2026-09-08T00:01:00Z'));
		expect(monday).not.toBe(tuesday);

		expect(await fingerprint(SALT, address, agent, monday)).not.toBe(
			await fingerprint(SALT, address, agent, tuesday),
		);
		expect(await fingerprint(SALT, address, agent)).toBe(await fingerprint(SALT, address, agent));
	});

	it('does not let one caller borrow another identity by shifting the separator', async () => {
		expect(await fingerprint(SALT, 'a:b', 'c')).not.toBe(await fingerprint(SALT, 'a', 'b:c'));
	});
});
