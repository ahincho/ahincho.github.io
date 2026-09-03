/**
 * The count-up behind the figures that come from the counter Workers. Kept here
 * rather than inside a component because two of them animate the same way, and
 * the floor below is the kind of detail that is only ever fixed once.
 */

/** How far along a climb is, eased, for a frame this many milliseconds in. */
export function progress(elapsed: number, duration: number): number {
	// A requestAnimationFrame stamp can predate the call that scheduled it, so
	// without the floor the first frame renders a negative count.
	const through = Math.min(Math.max(elapsed / duration, 0), 1);
	// Eased, so the count leaves zero quickly and settles onto the figure.
	return 1 - (1 - through) ** 3;
}

/**
 * Counts from zero up to `target`, painting every frame. A visitor who asked for
 * reduced motion is painted the figure once and left alone.
 */
export function climb(target: number, paint: (value: number) => void, duration = 900): void {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
		paint(target);
		return;
	}

	const started = performance.now();
	const step = (now: number) => {
		const through = progress(now - started, duration);
		paint(Math.round(target * through));
		if (through < 1) requestAnimationFrame(step);
	};
	requestAnimationFrame(step);
}
