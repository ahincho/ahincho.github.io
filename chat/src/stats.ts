/**
 * The parts of the stats endpoint that are decisions rather than storage, kept
 * out of the Worker so they can be tested with plain vitest.
 */

export interface Day {
	day: string;
	questions: number;
	people: number;
}

/**
 * Compares without giving away how much of the token was right. The length is
 * still visible, which is a fair trade for code anyone can check by reading it.
 */
export function matches(given: string | null, expected: string): boolean {
	if (!given || !expected || given.length !== expected.length) return false;
	let differences = 0;
	for (let i = 0; i < given.length; i += 1) {
		differences |= given.charCodeAt(i) ^ expected.charCodeAt(i);
	}
	return differences === 0;
}

/** Totals, and the span they were counted over. */
export function summarise(days: Day[]): {
	days: Day[];
	questions: number;
	people: number;
	since: string | null;
	until: string | null;
} {
	const ordered = [...days].sort((a, b) => a.day.localeCompare(b.day));
	return {
		days: ordered,
		questions: ordered.reduce((total, day) => total + day.questions, 0),
		// Deliberately not a unique-people total: the same person on two days is
		// two rows and there is no way, from a token that changes daily, to know
		// they were one person. Summing would claim more people than there were.
		people: ordered.reduce((total, day) => total + day.people, 0),
		since: ordered[0]?.day ?? null,
		until: ordered[ordered.length - 1]?.day ?? null,
	};
}

/** The day a token was minted for, in the same UTC terms the token uses. */
export function dayOf(now = Date.now()): string {
	return new Date(now).toISOString().slice(0, 10);
}

/** The oldest day worth keeping a per-person row for. */
export function cutoff(keepDays: number, now = Date.now()): string {
	return dayOf(now - keepDays * 24 * 60 * 60 * 1000);
}
