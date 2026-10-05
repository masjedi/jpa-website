import type { LocaleCode, TranslatedString } from '@/types/locale';
import { LOCALE_CODES } from '@/types/locale';

export type AdminJsonPayload = Record<
    string,
    string | number | boolean | null | TranslatedString
>;

export function validateEnglishRequired(
    value: TranslatedString,
    label: string,
): string | undefined {
    if (!value.en.trim()) {
        return `${label} (English) is required`;
    }

    return undefined;
}

export function mapTranslatableServerErrors(
    errors: Record<string, string | string[] | undefined>,
    fieldMap: Record<string, string>,
): Record<string, string> {
    const mapped: Record<string, string> = {};

    for (const [key, message] of Object.entries(errors)) {
        const field = fieldMap[key];

        if (!field || message === undefined) {
            continue;
        }

        mapped[field] = Array.isArray(message) ? message[0] : message;
    }

    return mapped;
}

export function buildTranslatableFieldMap(prefix: string, fields: readonly string[]): Record<string, string> {
    const map: Record<string, string> = {};

    for (const field of fields) {
        map[field] = field;
        map[`${prefix}${field}`] = field;

        for (const locale of LOCALE_CODES) {
            map[`${field}.${locale}`] = field;
        }
    }

    for (const locale of LOCALE_CODES) {
        map[`${prefix}.${locale}`] = prefix.replace(/\.$/, '');
    }

    return map;
}

export function appendTranslatedRecordToFormData(
    formData: FormData,
    prefix: string,
    record: Record<LocaleCode, Record<string, string>>,
    fields: readonly string[],
): void {
    for (const locale of LOCALE_CODES) {
        for (const field of fields) {
            formData.append(`${prefix}[${locale}][${field}]`, record[locale]?.[field] ?? '');
        }
    }
}

export function appendTranslatedStringToFormData(
    formData: FormData,
    key: string,
    value: TranslatedString,
): void {
    for (const locale of LOCALE_CODES) {
        formData.append(`${key}[${locale}]`, value[locale] ?? '');
    }
}

export function translatedRecordFromFormValues<TFields extends Record<string, string>>(
    fields: readonly (keyof TFields & string)[],
    values: Record<LocaleCode, TFields>,
): Record<string, TranslatedString | Record<LocaleCode, string>> {
    const payload: Record<string, TranslatedString> = {};

    for (const field of fields) {
        const translated = {} as TranslatedString;

        for (const locale of LOCALE_CODES) {
            translated[locale] = values[locale]?.[field] ?? '';
        }

        payload[field] = translated;
    }

    return payload;
}
