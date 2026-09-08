import { LOCALE_CODES, RTL_LOCALES, type LocaleCode, type TranslatedString } from '@/types/locale';

export function createEmptyTranslatedString(): TranslatedString {
    return Object.fromEntries(LOCALE_CODES.map((locale) => [locale, ''])) as TranslatedString;
}

export function normalizeTranslatedString(
    value: string | Partial<TranslatedString> | null | undefined,
): TranslatedString {
    const normalized = createEmptyTranslatedString();

    if (typeof value === 'string') {
        normalized.en = value;

        return normalized;
    }

    if (!value || typeof value !== 'object') {
        return normalized;
    }

    for (const locale of LOCALE_CODES) {
        normalized[locale] = value[locale] ?? '';
    }

    return normalized;
}

export function translationCompletion(
    value: TranslatedString,
): Record<LocaleCode, boolean> {
    const completion = {} as Record<LocaleCode, boolean>;

    for (const locale of LOCALE_CODES) {
        completion[locale] = value[locale].trim() !== '';
    }

    return completion;
}

export function primaryTranslation(value: TranslatedString): string {
    for (const locale of LOCALE_CODES) {
        const text = value[locale]?.trim() ?? '';

        if (text !== '') {
            return text;
        }
    }

    return '';
}

export function localeDirection(locale: LocaleCode): 'ltr' | 'rtl' {
    return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
}

export function isLocaleCode(value: string): value is LocaleCode {
    return LOCALE_CODES.includes(value as LocaleCode);
}

export function appendTranslatedStringToFormData(
    formData: FormData,
    key: string,
    value: TranslatedString,
): void {
    for (const locale of LOCALE_CODES) {
        formData.append(`${key}[${locale}]`, value[locale]);
    }
}

export function emptyLocaleCompletion(): Record<LocaleCode, boolean> {
    return Object.fromEntries(LOCALE_CODES.map((locale) => [locale, false])) as Record<
        LocaleCode,
        boolean
    >;
}
