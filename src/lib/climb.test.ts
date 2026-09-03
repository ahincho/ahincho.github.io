import { describe, expect, it } from 'vitest';
import { progress } from './climb';

describe('progress', () => {
	it('never runs backwards past zero', () => {
		// The bug this floor exists for: requestAnimationFrame hands the callback
		// the frame's own timestamp, which can be earlier than the performance.now()
		// read that scheduled it. Without the floor the first frame painted -1.
		expect(progress(-5, 900)).toBe(0);
		expect(progress(-900, 900)).toBe(0);
	});

	it('starts at zero and arrives exactly at one', () => {
		expect(progress(0, 900)).toBe(0);
		expect(progress(900, 900)).toBe(1);
	});

	it('stays at one once the time is up', () => {
		expect(progress(901, 900)).toBe(1);
		expect(progress(90_000, 900)).toBe(1);
	});

	it('only ever moves forwards', () => {
		let last = -1;
		for (let elapsed = 0; elapsed <= 900; elapsed += 30) {
			const now = progress(elapsed, 900);
			expect(now).toBeGreaterThanOrEqual(last);
			last = now;
		}
	});

	it('leaves zero faster than it arrives', () => {
		// Eased rather than linear: the first tenth of the time covers far more
		// ground than the last, which is what makes the count feel like it settles.
		const opening = progress(90, 900) - progress(0, 900);
		const closing = progress(900, 900) - progress(810, 900);
		expect(opening).toBeGreaterThan(closing * 5);
	});
});
