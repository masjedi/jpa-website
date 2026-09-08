import { useCallback, useMemo, useState } from 'react';

import {
    createEmptyTranslatedString,
    emptyLocaleCompletion,
    localeDirection,
    normalizeTranslatedString,
} from '@/lib/translations';
import { LOCALE_CODES, type LocaleCode, type TranslatedString } from '@/types/locale';

type LocaleFieldMap<TFields extends Record<string, string>> = Record<LocaleCode, TFields>;

interface UseLocaleFormFieldsOptions<TFields extends Record<string, string>> {
    initialByLocale: LocaleFieldMap<TFields>;
    emptyFields: TFields;
    defaultLocale?: LocaleCode;
}

export function useLocaleFormFields<TFields extends Record<string, string>>({
    initialByLocale,
    emptyFields,
    defaultLocale = 'en',
}: UseLocaleFormFieldsOptions<TFields>) {
    const [activeLocale, setActiveLocale] = useState<LocaleCode>(defaultLocale);
    const [byLocale, setByLocale] = useState<LocaleFieldMap<TFields>>(initialByLocale);
    const [draft, setDraft] = useState<TFields>(initialByLocale[defaultLocale] ?? emptyFields);

    const switchLocale = useCallback(
        (nextLocale: LocaleCode) => {
            if (nextLocale === activeLocale) {
                return;
            }

            setByLocale((current) => {
                const updated = {
                    ...current,
                    [activeLocale]: draft,
                };

                setDraft({ ...(updated[nextLocale] ?? emptyFields) });

                return updated;
            });
            setActiveLocale(nextLocale);
        },
        [activeLocale, draft, emptyFields],
    );

    const setField = useCallback(<TKey extends keyof TFields>(key: TKey, value: TFields[TKey]) => {
        setDraft((current) => ({
            ...current,
            [key]: value,
        }));
    }, []);

    const commitAllLocales = useCallback((): LocaleFieldMap<TFields> => {
        const merged = {
            ...byLocale,
            [activeLocale]: draft,
        };

        setByLocale(merged);

        return merged;
    }, [activeLocale, byLocale, draft]);

    const completion = useMemo(() => {
        const merged = {
            ...byLocale,
            [activeLocale]: draft,
        };

        return LOCALE_CODES.reduce((status, locale) => {
            const fields = merged[locale];
            status[locale] = Object.values(fields).some((value) => String(value).trim() !== '');

            return status;
        }, emptyLocaleCompletion());
    }, [activeLocale, byLocale, draft]);

    return {
        activeLocale,
        switchLocale,
        draft,
        setField,
        commitAllLocales,
        completion,
        direction: localeDirection(activeLocale),
    } as const;
}

export function translatedFieldToLocaleMap(
    title: TranslatedString,
    subtitle: TranslatedString,
): LocaleFieldMap<{ title: string; subtitle: string }> {
    const normalizedTitle = normalizeTranslatedString(title);
    const normalizedSubtitle = normalizeTranslatedString(subtitle);
    const map = {} as LocaleFieldMap<{ title: string; subtitle: string }>;

    for (const locale of LOCALE_CODES) {
        map[locale] = {
            title: normalizedTitle[locale],
            subtitle: normalizedSubtitle[locale],
        };
    }

    return map;
}

export function buildInitialLocaleMap<TField extends string>(
    fields: readonly TField[],
    values: Record<TField, TranslatedString>,
): LocaleFieldMap<Record<TField, string>> {
    const map = {} as LocaleFieldMap<Record<TField, string>>;

    for (const locale of LOCALE_CODES) {
        const localeFields = {} as Record<TField, string>;

        for (const field of fields) {
            localeFields[field] = normalizeTranslatedString(values[field])[locale];
        }

        map[locale] = localeFields;
    }

    return map;
}

export function localeMapToTranslatedRecord<TField extends string>(
    fields: readonly TField[],
    byLocale: LocaleFieldMap<Record<TField, string>>,
): Record<TField, TranslatedString> {
    const record = {} as Record<TField, TranslatedString>;

    for (const field of fields) {
        const translated = createEmptyTranslatedString();

        for (const locale of LOCALE_CODES) {
            translated[locale] = byLocale[locale]?.[field]?.trim() ?? '';
        }

        record[field] = translated;
    }

    return record;
}

export function localeMapToTranslatedFields(
    byLocale: LocaleFieldMap<{ title: string; subtitle: string }>,
): { title: TranslatedString; subtitle: TranslatedString } {
    const title = createEmptyTranslatedString();
    const subtitle = createEmptyTranslatedString();

    for (const locale of LOCALE_CODES) {
        title[locale] = byLocale[locale]?.title?.trim() ?? '';
        subtitle[locale] = byLocale[locale]?.subtitle?.trim() ?? '';
    }

    return { title, subtitle };
}

export function useLocaleFormField(
    initialValue: TranslatedString,
    defaultLocale: LocaleCode = 'en',
) {
    const normalized = normalizeTranslatedString(initialValue);

    const [activeLocale, setActiveLocale] = useState<LocaleCode>(defaultLocale);
    const [byLocale, setByLocale] = useState<TranslatedString>(normalized);
    const [draft, setDraft] = useState(normalized[defaultLocale] ?? '');

    const switchLocale = useCallback(
        (nextLocale: LocaleCode) => {
            if (nextLocale === activeLocale) {
                return;
            }

            setByLocale((current) => {
                const updated = {
                    ...current,
                    [activeLocale]: draft,
                };

                setDraft(updated[nextLocale] ?? '');

                return updated;
            });
            setActiveLocale(nextLocale);
        },
        [activeLocale, draft],
    );

    const commitAllLocales = useCallback((): TranslatedString => {
        const merged = {
            ...byLocale,
            [activeLocale]: draft.trim(),
        };

        setByLocale(merged);

        return merged;
    }, [activeLocale, byLocale, draft]);

    const completion = useMemo(() => {
        const merged = {
            ...byLocale,
            [activeLocale]: draft,
        };

        return LOCALE_CODES.reduce((status, locale) => {
            status[locale] = merged[locale].trim() !== '';

            return status;
        }, emptyLocaleCompletion());
    }, [activeLocale, byLocale, draft]);

    return {
        activeLocale,
        switchLocale,
        draft,
        setDraft,
        commitAllLocales,
        completion,
        direction: localeDirection(activeLocale),
    } as const;
}
