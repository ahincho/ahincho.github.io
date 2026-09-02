import type { CountryCode, YearMonth } from '../domain/experience';

/**
 * Dates and place names used to be written out by hand in both dictionaries —
 * 'Ene 2024 — Mar 2026' next to 'Jan 2024 — Mar 2026'. That is how the Claro end
 * date came to differ between the two. Intl derives both from the facts instead,
 * so there is one place to change and nothing to keep in step.
 */

/** '2024-01' -> 'ene 2024' / 'Jan 2024'. */
function month(value: YearMonth, lang: string): string {
	const [year, m] = value.split('-').map(Number);
	// Day 1 of the month at UTC noon, so no time zone can roll it back a day.
	const date = new Date(Date.UTC(year, m - 1, 1, 12));
	return new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
		date,
	);
}

/**
 * 'ene 2024 — mar 2026', or 'ene 2024 — Actualidad' while it is still running.
 * Spanish writes month names in lower case; the hand-written strings had them
 * capitalised, which Intl quietly corrects.
 */
export function formatPeriod(
	start: YearMonth,
	end: YearMonth | null,
	lang: string,
	presentLabel: string,
): string {
	return `${month(start, lang)} — ${end ? month(end, lang) : presentLabel}`;
}

/** 'PE' -> 'Perú' / 'Peru'. Falls back to the code if the runtime lacks the data. */
function country(code: CountryCode, lang: string): string {
	return new Intl.DisplayNames([lang], { type: 'region' }).of(code) ?? code;
}

/**
 * 'Lima, Perú', 'Chile', or 'Guatemala, El Salvador, Honduras y Nicaragua'.
 * The city is dropped when the work was not tied to one.
 */
export function formatPlace(
	city: string | undefined,
	countries: readonly CountryCode[],
	lang: string,
	/** Only the city names that differ between languages need an entry. */
	cityNames: Record<string, string> = {},
): string {
	const list = formatCountries(countries, lang);
	if (!city) return list;
	return `${cityNames[city] ?? city}, ${list}`;
}

/** 'Guatemala, Honduras, Costa Rica y Nicaragua'. */
export function formatCountries(countries: readonly CountryCode[], lang: string): string {
	const names = countries.map((code) => country(code, lang));
	return new Intl.ListFormat(lang, { style: 'long', type: 'conjunction' }).format(names);
}

/** Whole years between a start month and now, for the "years of experience" figure. */
export function yearsSince(start: YearMonth, now = new Date()): number {
	const [year, m] = start.split('-').map(Number);
	const months = (now.getUTCFullYear() - year) * 12 + (now.getUTCMonth() + 1 - m);
	return Math.floor(months / 12);
}
