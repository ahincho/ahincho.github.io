import { describe, expect, it } from 'vitest';
import { cutoff, dayOf, matches, summarise } from './stats';

const SECRET = 'a-token-nobody-else-has';

describe('matches', () => {
	it('accepts the token it was given', () => {
		expect(matches(SECRET, SECRET)).toBe(true);
	});

	it('refuses a wrong token, a prefix of it, and a missing one', () => {
		expect(matches('a-token-nobody-else-hat', SECRET)).toBe(false);
		expect(matches(SECRET.slice(0, -1), SECRET)).toBe(false);
		expect(matches(null, SECRET)).toBe(false);
		expect(matches('', SECRET)).toBe(false);
	});

	// Without this the endpoint would open itself the moment the secret was
	// missing from the environment, which is exactly when it must not.
	it('refuses everything when no token is configured', () => {
		expect(matches('', '')).toBe(false);
		expect(matches('anything', '')).toBe(false);
	});
});

describe('summarise', () => {
	const days = [
		{ day: '2026-09-03', questions: 4, people: 2 },
		{ day: '2026-09-01', questions: 10, people: 3 },
		{ day: '2026-09-02', questions: 7, people: 3 },
	];

	it('puts the days back in order however they arrived', () => {
		expect(summarise(days).days.map((day) => day.day)).toEqual([
			'2026-09-01',
			'2026-09-02',
			'2026-09-03',
		]);
	});

	it('adds up the questions and reports the span', () => {
		const out = summarise(days);
		expect(out.questions).toBe(21);
		expect(out.since).toBe('2026-09-01');
		expect(out.until).toBe('2026-09-03');
	});

	it('adds people per day rather than pretending to know they were different', () => {
		// 2 + 3 + 3, not "8 unique people": a token changes daily, so the same
		// reader on three days is three rows and nothing can tell us otherwise.
		expect(summarise(days).people).toBe(8);
	});

	it('says nothing rather than something wrong when there are no days', () => {
		expect(summarise([])).toMatchObject({ questions: 0, people: 0, since: null, until: null });
	});

	it('leaves the array it was handed alone', () => {
		const original = [...days];
		summarise(days);
		expect(days).toEqual(original);
	});
});

describe('dayOf and cutoff', () => {
	it('rolls the day over at midnight in Arequipa, not in London', () => {
		// Seven in the evening in Peru is already tomorrow in UTC. It must not be
		// a new day here, or one evening's questions would be split across rows.
		expect(dayOf(Date.parse('2026-09-03T00:01:00Z'))).toBe('2026-09-02');
		expect(dayOf(Date.parse('2026-09-03T04:59:00Z'))).toBe('2026-09-02');
		// 05:00Z is where the day actually turns.
		expect(dayOf(Date.parse('2026-09-03T05:00:00Z'))).toBe('2026-09-03');
	});

	it('counts back the days it was asked for', () => {
		expect(cutoff(60, Date.parse('2026-09-03T12:00:00Z'))).toBe('2026-07-05');
		expect(cutoff(1, Date.parse('2026-01-01T12:00:00Z'))).toBe('2025-12-31');
	});
});
