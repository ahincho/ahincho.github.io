import type { Job, Study } from '../domain/experience';

/**
 * The career timeline as facts. Nothing here is translated: the role titles and
 * the bullet points live in `src/i18n`, keyed by the ids below, so a fact is
 * stated once instead of once per language.
 *
 * Newest first — the section renders them in this order.
 */
export const jobs = [
	{
		id: 'utp',
		company: 'Universidad Tecnológica del Perú (UTP)',
		employment: 'staff',
		modality: 'remote',
		industry: 'education',
		start: '2024-01',
		end: '2026-03',
		city: 'Lima',
		countries: ['PE'],
		tags: ['Java', 'Spring Boot', 'React', 'NestJS', 'AWS', 'Azure', 'SonarCloud'],
	},
	{
		id: 'claro',
		// The region used to be part of the name because there was nowhere else to
		// put it. It comes from `countries` now.
		company: 'Claro',
		employment: 'freelance',
		modality: 'remote',
		industry: 'telecom',
		start: '2025-05',
		end: '2026-03',
		city: 'Ciudad de Guatemala',
		countries: ['GT'],
		markets: ['GT', 'HN', 'CR', 'NI'],
		tags: ['TypeScript', 'NestJS', 'Angular', 'Ionic', 'AWS', 'Terraform', 'DynamoDB'],
	},
	{
		id: 'falabella',
		company: 'Falabella',
		employment: 'freelance',
		modality: 'remote',
		industry: 'retail',
		start: '2024-03',
		end: '2024-08',
		city: 'Santiago',
		countries: ['CL'],
		markets: ['PE', 'CO', 'CL'],
		tags: ['Java', 'Spring Boot', 'FastAPI', 'React', 'Angular', 'GCP', 'Kubernetes'],
	},
	{
		id: 'joyit',
		company: 'JoyIt',
		employment: 'staff',
		modality: 'remote',
		industry: 'hr',
		start: '2023-03',
		end: '2023-12',
		city: 'Lima',
		countries: ['PE'],
		tags: ['Java', 'Kotlin', 'Spring Boot', 'Quarkus', 'AWS', 'Keycloak'],
	},
	{
		id: 'unsa',
		company: 'Universidad Nacional de San Agustín (UNSA)',
		employment: 'internship',
		modality: 'hybrid',
		industry: 'academia',
		start: '2022-04',
		end: '2023-04',
		city: 'Arequipa',
		countries: ['PE'],
		tags: ['C#', '.NET', 'Java', 'Angular', 'PostgreSQL'],
	},
	{
		id: 'bytexbyte',
		company: 'ByteXByte',
		employment: 'staff',
		modality: 'hybrid',
		industry: 'retail',
		start: '2021-04',
		end: '2022-04',
		city: 'Arequipa',
		countries: ['PE'],
		tags: ['Java', 'JavaFX', 'C#', '.NET', 'Spring Boot', 'React', 'MySQL'],
	},
] as const satisfies readonly Job[];

export type JobId = (typeof jobs)[number]['id'];

export const studies = [
	{
		id: 'unsa-degree',
		school: 'UNSA',
		start: 2020,
		end: 2024,
		note: 'GPA 3.7/4.0',
	},
	{
		id: 'uni-specialization',
		school: 'UNI',
		start: 2026,
		end: null,
	},
	{
		id: 'unsa-language-centre',
		school: 'Centro de Idiomas UNSA',
		start: 2021,
		end: 2022,
	},
] as const satisfies readonly Study[];

export type StudyId = (typeof studies)[number]['id'];
