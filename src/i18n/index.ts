import { es } from './es';
import { en } from './en';

export type Translations = typeof es;

export const translations = { es, en } as const;

export type Lang = keyof typeof translations;

export const defaultLang: Lang = 'es';

export function getLang(currentLocale: string | undefined): Lang {
	return currentLocale && currentLocale in translations ? (currentLocale as Lang) : defaultLang;
}
