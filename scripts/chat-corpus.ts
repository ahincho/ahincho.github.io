/**
 * Writes `public/chat-corpus.json`: one plain-text document per language,
 * assembled from the same dictionaries and data the pages render from.
 *
 * The chatbot reads this and nothing else, so the two cannot disagree — a
 * deploy is the only step that changes what it knows. Run by `pnpm build`.
 */

import { writeFile } from 'node:fs/promises';
import { es } from '../src/i18n/es.ts';
import { en } from '../src/i18n/en.ts';
import { jobs, studies } from '../src/data/experience.ts';
import { formatCountries, formatPeriod, formatPlace } from '../src/lib/format.ts';

type Dictionary = typeof es;

function experienceSection(t: Dictionary, lang: string): string {
	const lines: string[] = [];
	for (const job of jobs) {
		const copy = t.experience.jobs[job.id];
		const meta = [
			formatPeriod(job.start, job.end, lang, t.experience.present),
			formatPlace(job.city, job.countries, lang, t.experience.cities),
			t.experience.modality[job.modality],
			t.experience.employment[job.employment],
			t.experience.industry[job.industry],
		].join(' · ');

		lines.push(`### ${job.company} — ${copy.role}`, meta);
		if ('markets' in job) {
			lines.push(`${t.experience.marketsLabel} ${formatCountries(job.markets, lang)}`);
		}
		lines.push(...copy.bullets.map((b) => `- ${b}`));
		lines.push(`${lang === 'es' ? 'Tecnologías' : 'Technologies'}: ${job.tags.join(', ')}`, '');
	}
	return lines.join('\n');
}

function studiesSection(t: Dictionary): string {
	return studies
		.map((study) => {
			const years = study.end ? `${study.start} — ${study.end}` : `${study.start}`;
			const note = 'note' in study ? ` · ${study.note}` : '';
			return `- ${study.school}: ${t.experience.studies[study.id].degree} (${years}${note})`;
		})
		.join('\n');
}

/** Only the fields both case studies share; each carries plenty the bot does not need. */
interface Project {
	title: string;
	tagline: string;
	description: string;
	roleLabel: string;
	roleText: string;
	figures: readonly { value: string; label: string }[];
	highlights: readonly string[];
}

function projectSection(project: Project): string {
	return [
		`### ${project.title}`,
		project.tagline,
		project.description,
		...project.figures.map((f) => `- ${f.value} ${f.label}`),
		...project.highlights.map((h) => `- ${h}`),
		`${project.roleLabel} ${project.roleText}`,
		'',
	].join('\n');
}

/** Strips the inline HTML a few paragraphs carry for emphasis. */
const plain = (value: string) => value.replace(/<[^>]+>/g, '');

function document(t: Dictionary, lang: string): string {
	return [
		`# ${t.meta.title}`,
		'',
		`## ${lang === 'es' ? 'Perfil' : 'Profile'}`,
		`${lang === 'es' ? 'Ubicación' : 'Location'}: ${t.hero.location}`,
		t.hero.whoami,
		plain(t.hero.lead),
		'',
		...t.hero.stats.map((s) => `- ${s.value} ${s.label}`),
		...t.about.paragraphs.map(plain),
		'',
		`${t.about.focusTitle}: ${t.about.focus.join(', ')}`,
		'',
		`## ${t.experience.title}`,
		experienceSection(t, lang),
		`## ${t.experience.educationTitle}`,
		studiesSection(t),
		'',
		`## ${t.projects.title}`,
		projectSection(t.projects.sparkMatch),
		projectSection(t.projects.nova),
		projectSection(t.projects.assistant),
		`## ${t.skills.title}`,
		...t.skills.groups.map((g) => `- ${g.name}: ${g.items.join(', ')}`),
		'',
		`## ${t.contact.title}`,
		plain(t.contact.lead),
	].join('\n');
}

const corpus = {
	generatedAt: new Date().toISOString(),
	languages: {
		es: document(es, 'es'),
		en: document(en as unknown as Dictionary, 'en'),
	},
};

await writeFile('public/chat-corpus.json', JSON.stringify(corpus, null, '\t') + '\n', 'utf8');

for (const [lang, text] of Object.entries(corpus.languages)) {
	const chars = text.length;
	console.log(
		`  ${lang}: ${chars.toLocaleString()} characters, ~${Math.round(chars / 3.5)} tokens`,
	);
}
