import { describe, expect, it } from 'vitest';
import { es } from './es';
import { en } from './en';
import { techIcon } from '../lib/tech-icons';

/**
 * Technologies that are deliberately shown as text. Practices have no logo, and
 * the rest are marks both icon sets only ship as a filled badge, which at pill
 * size reads as a solid block. Anything not listed here has to resolve, so a new
 * technology with no mark fails the suite instead of quietly rendering bare.
 */
const TEXT_ONLY = new Set([
	'C#',
	'DynamoDB',
	'Salesforce',
	'Scrum',
	'DDD',
	'Event-Driven',
	'Micro-frontends',
	'AI-SDLC',
	'Deep Agents',
	'RAG',
	'SAST/DAST',
]);

/**
 * Every label that reaches a TechPill. The chips in the Nova architecture diagram
 * are plain spans, not pills, so they are out of scope. The project tags live in
 * ProjectIndex.astro rather than here and are not covered yet — moving them into
 * the data layer would bring them in.
 */
function pillLabels(): string[] {
	return [
		...es.skills.groups.flatMap((group) => group.items),
		...es.experience.jobs.flatMap((job) => job.tags),
	];
}

/** Every array in the tree, keyed by its path, so both dictionaries can be compared. */
function arrayLengths(
	node: unknown,
	path = '',
	out = new Map<string, number>(),
): Map<string, number> {
	if (Array.isArray(node)) {
		out.set(path, node.length);
		node.forEach((value, i) => arrayLengths(value, `${path}[${i}]`, out));
	} else if (node && typeof node === 'object') {
		for (const [k, v] of Object.entries(node)) arrayLengths(v, path ? `${path}.${k}` : k, out);
	}
	return out;
}

describe('dictionaries', () => {
	it('shows an icon for every technology that is not deliberately text-only', () => {
		const bare = [...new Set(pillLabels())].filter(
			(label) => !TEXT_ONLY.has(label) && !techIcon(label),
		);
		expect(bare, `no icon resolves for: ${bare.join(', ')}`).toEqual([]);
	});

	it('does not list a technology as text-only that actually has a mark', () => {
		// Keeps the exclusion list honest as the icon sets add marks back.
		const resolvable = [...TEXT_ONLY].filter((label) => techIcon(label));
		expect(resolvable, `these could show an icon now: ${resolvable.join(', ')}`).toEqual([]);
	});

	it('keeps both dictionaries the same shape', () => {
		// The type system pins the keys; nothing pins the lengths, so a job that
		// gained a bullet in Spanish but not in English would slip through.
		expect(arrayLengths(en)).toEqual(arrayLengths(es));
	});
});
