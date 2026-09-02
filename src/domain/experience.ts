/**
 * Contracts for the career timeline. Types only — no logic, no rendering, and
 * nothing language-specific: everything here is a fact that reads the same in
 * Spanish and in English. The prose that describes each entry lives in the
 * dictionaries, keyed by the ids declared alongside the data.
 */

/** ISO 3166-1 alpha-2. Country names are resolved per locale with Intl. */
export type CountryCode = 'PE' | 'CL' | 'CO' | 'GT' | 'SV' | 'HN' | 'NI' | 'CR' | 'PA' | 'DO';

/** Where the work happened, which recruiters filter on and the site never stated. */
export type Modality = 'onsite' | 'hybrid' | 'remote';

/** How the engagement was held. It used to be appended to the role string. */
export type Employment = 'staff' | 'freelance' | 'internship';

/** Sector coverage: the part of the track record a single stack cannot show. */
export type Industry = 'education' | 'telecom' | 'retail' | 'hr' | 'academia';

/**
 * A month, as 'YYYY-MM'. The template literal pins the shape, not the range —
 * '2024-13' would still type-check, which is what the data test is for.
 */
export type YearMonth = `${number}-${number}`;

/** One position. Language-neutral throughout. */
export interface Job {
	readonly id: string;
	readonly company: string;
	readonly employment: Employment;
	readonly modality: Modality;
	readonly industry: Industry;
	readonly start: YearMonth;
	/** null while the engagement is still running. */
	readonly end: YearMonth | null;
	/** Omitted when the work was not tied to a city. */
	readonly city?: string;
	/**
	 * Where the engagement itself was based. Non-empty by construction: a country
	 * is the one thing a foreign reader cannot infer, since "Lima" alone does not
	 * say Peru, so leaving it out is a compile error rather than a silent gap.
	 */
	readonly countries: readonly [CountryCode, ...CountryCode[]];
	/**
	 * Countries the work actually reached, when that is wider than where it was
	 * contracted from. Claro was a Guatemalan engagement serving four markets;
	 * saying "4 countries" in a bullet named none of them.
	 */
	readonly markets?: readonly [CountryCode, ...CountryCode[]];
	readonly tags: readonly string[];
}

/** The only part of a position that gets translated. */
export interface JobCopy {
	readonly role: string;
	readonly bullets: readonly string[];
}

/** One qualification. Years only — months were never shown. */
export interface Study {
	readonly id: string;
	readonly school: string;
	readonly start: number;
	/** null when it is a single-year entry. */
	readonly end: number | null;
	/** Anything worth appending, such as a grade. */
	readonly note?: string;
}

export interface StudyCopy {
	readonly degree: string;
}
