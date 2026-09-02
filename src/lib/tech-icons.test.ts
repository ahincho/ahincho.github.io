import { describe, expect, it } from 'vitest';
import { techIcon } from './tech-icons';

describe('techIcon', () => {
	it('does not fall back to the C language for C#', () => {
		// slugify('C#') is 'c', which resolves to the C mark. This is the bug the
		// explicit maps exist to prevent, so it is the one worth pinning down.
		expect(techIcon('C#')).toBeNull();
	});

	it('resolves the marks Simple Icons dropped over trademark requests', () => {
		for (const label of ['Java', 'AWS', 'Azure']) {
			expect(techIcon(label), label).not.toBeNull();
		}
	});

	it('borrows the provider mark for services that have none of their own', () => {
		expect(techIcon('Amazon Bedrock')).toEqual(techIcon('AWS'));
		expect(techIcon('Azure OpenAI')).toEqual(techIcon('Azure'));
	});

	it('resolves labels whose slug is not the label with punctuation stripped', () => {
		const labels = [
			'Spring Boot',
			'Node.js',
			'.NET',
			'Vue',
			'GCP',
			'GitHub Actions',
			'SonarCloud',
			'Hugging Face',
			'OpenAPI',
		];
		for (const label of labels) {
			expect(techIcon(label), label).not.toBeNull();
		}
	});

	it('returns a viewBox alongside every body it resolves', () => {
		const icon = techIcon('Java');
		expect(icon?.viewBox).toMatch(/^0 0 \d+ \d+$/);
		expect(icon?.body).toBeTruthy();
	});
});
