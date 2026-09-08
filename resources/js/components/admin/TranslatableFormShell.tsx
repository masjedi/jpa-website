import { type ReactNode } from 'react';

import { AdminLocaleSelector } from '@/components/admin/AdminLocaleSelector';
import { useLocaleFormFields } from '@/hooks/use-locale-form-fields';
import type { LocaleCode } from '@/types/locale';

interface TranslatableFormShellProps<TFields extends Record<string, string>> {
    initialByLocale: Record<LocaleCode, TFields>;
    emptyFields: TFields;
    disabled?: boolean;
    children: (context: {
        activeLocale: LocaleCode;
        draft: TFields;
        setField: <TKey extends keyof TFields>(key: TKey, value: TFields[TKey]) => void;
        direction: 'ltr' | 'rtl';
        commitAllLocales: () => Record<LocaleCode, TFields>;
        completion: Record<LocaleCode, boolean>;
    }) => ReactNode;
}

export function TranslatableFormShell<TFields extends Record<string, string>>({
    initialByLocale,
    emptyFields,
    disabled = false,
    children,
}: TranslatableFormShellProps<TFields>) {
    const {
        activeLocale,
        switchLocale,
        draft,
        setField,
        commitAllLocales,
        completion,
        direction,
    } = useLocaleFormFields({
        initialByLocale,
        emptyFields,
    });

    return (
        <div className="space-y-3">
            <AdminLocaleSelector
                activeLocale={activeLocale}
                completion={completion}
                onChange={switchLocale}
                disabled={disabled}
            />
            {children({
                activeLocale,
                draft,
                setField,
                direction,
                commitAllLocales,
                completion,
            })}
        </div>
    );
}
