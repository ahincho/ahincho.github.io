import { describe, expect, it } from 'vitest';
import { jobs, studies } from './experience';

// Every engagement having a country is enforced by the type, not by a test:
// `countries` is a non-empty tuple, so an empty list will not compile.

/** 'YYYY-MM' with a month that exists. The template literal type cannot check the range. */
const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

describe('experience data', () => {
	it('gives every entry a unique id', () => {
		const ids = [...jobs.map((j) => j.id), ...studies.map((s) => s.id)];
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('states months that exist', () => {
		for (const job of jobs) {
			expect(job.start, job.id).toMatch(YEAR_MONTH);
			if (job.end) expect(job.end, job.id).toMatch(YEAR_MONTH);
		}
	});

	it('never ends before it starts', () => {
		for (const job of jobs) {
			if (job.end) expect(job.end >= job.start, `${job.id}: ${job.start} → ${job.end}`).toBe(true);
		}
		for (const study of studies) {
			if (study.end) expect(study.end >= study.start, study.id).toBe(true);
		}
	});

	it('lists the timeline by end date, newest first', () => {
		// Ordered by when each engagement finished, not when it began: UTP and
		// Claro overlap and both ran to March 2026. A current role sorts first.
		const ends = jobs.map((job) => job.end ?? '9999-99');
		for (let i = 1; i < ends.length; i += 1) {
			expect(ends[i - 1] >= ends[i], `${jobs[i - 1].id} before ${jobs[i].id}`).toBe(true);
		}
	});
});
