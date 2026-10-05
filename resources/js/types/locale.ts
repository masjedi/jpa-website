export const LOCALE_CODES = ['en', 'fa', 'ps', 'de', 'fr'] as const;

export type LocaleCode = (typeof LOCALE_CODES)[number];

export type TranslatedString = Record<LocaleCode, string>;

export type LocaleMeta = Record<string, { label: string; native: string }>;

export const RTL_LOCALES: readonly LocaleCode[] = ['fa', 'ps'];

export const LOCALE_LABELS: Record<LocaleCode, string> = {
    en: 'English',
    fa: 'Dari',
    ps: 'Pashto',
    de: 'German',
    fr: 'French',
};
