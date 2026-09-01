import * as simpleIcons from 'simple-icons';
import { icons as devicon } from '@iconify-json/devicon-plain';

export interface TechIcon {
	body: string;
	viewBox: string;
}

/**
 * Simple Icons removed every Amazon, Microsoft, Oracle and Salesforce mark after
 * trademark requests, which happens to be the centre of this stack. Devicon still
 * carries them, and its `plain` set paints with currentColor like Simple Icons does.
 */
const FROM_DEVICON: Record<string, string> = {
	Java: 'java',
	AWS: 'amazonwebservices',
	Azure: 'azure',
	// Both are AWS and Azure services; their own marks are not in either set.
	'Amazon Bedrock': 'amazonwebservices',
	'Azure OpenAI': 'azure',
};

/**
 * Devicon draws these as a filled badge with the logo knocked out of it, which at
 * pill size reads as a solid white block. They stay text-only.
 */
const NO_ICON = new Set(['C#', 'DynamoDB', 'Salesforce']);

/** Labels whose Simple Icons slug is not simply the label with the punctuation stripped. */
const SIMPLE_ICON_SLUGS: Record<string, string> = {
	'Spring Boot': 'springboot',
	'Node.js': 'nodedotjs',
	'.NET': 'dotnet',
	Vue: 'vuedotjs',
	GCP: 'googlecloud',
	'GitHub Actions': 'githubactions',
	SonarCloud: 'sonarqubecloud',
	'Hugging Face': 'huggingface',
	OpenAPI: 'openapiinitiative',
};

interface SimpleIcon {
	slug: string;
	path: string;
}

const bySlug = new Map<string, SimpleIcon>();
for (const value of Object.values(simpleIcons)) {
	const icon = value as Partial<SimpleIcon>;
	if (icon && typeof icon === 'object' && icon.slug && icon.path) {
		bySlug.set(icon.slug, icon as SimpleIcon);
	}
}

/** "Node.js" -> "nodejs". Matches how Simple Icons builds most of its slugs. */
const slugify = (label: string) => label.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Returns the monochrome mark for a technology, or null for the entries that are
 * practices rather than products — Scrum, DDD, RAG and friends have no logo to show.
 */
export function techIcon(label: string): TechIcon | null {
	if (NO_ICON.has(label)) return null;

	// Explicit first: slugifying "C#" yields "c", which would silently pick up the
	// icon for the C language.
	const deviconName = FROM_DEVICON[label];
	if (deviconName) {
		const icon = devicon.icons[deviconName];
		if (icon) {
			const width = icon.width ?? devicon.width ?? 24;
			const height = icon.height ?? devicon.height ?? 24;
			return { body: icon.body, viewBox: `0 0 ${width} ${height}` };
		}
	}

	const simple = bySlug.get(SIMPLE_ICON_SLUGS[label] ?? slugify(label));
	if (simple) return { body: `<path d="${simple.path}" />`, viewBox: '0 0 24 24' };

	return null;
}
