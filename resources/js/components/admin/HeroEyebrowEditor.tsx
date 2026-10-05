import { type FormEvent, useId, useState } from 'react';

import { AdminLocaleSelector } from '@/components/admin/AdminLocaleSelector';
import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createHeroEyebrowFormValues,
    type HeroEyebrowFormErrors,
    type HeroEyebrowFormValues,
    validateHeroEyebrowFormValues,
} from '@/components/admin/heroEyebrowForm';
import { useLocaleFormField } from '@/hooks/use-locale-form-fields';
import { normalizeTranslatedString } from '@/lib/translations';
import { cn } from '@/lib/utils';
import type { TranslatedString } from '@/types/locale';

interface HeroEyebrowEditorProps {
    eyebrow: TranslatedString;
    onSave: (values: HeroEyebrowFormValues) => void;
}

export function HeroEyebrowEditor({ eyebrow, onSave }: HeroEyebrowEditorProps) {
    const fieldId = useId();
    const normalizedEyebrow = normalizeTranslatedString(eyebrow);
    const {
        activeLocale,
        switchLocale,
        draft,
        setDraft,
        commitAllLocales,
        completion,
        direction,
    } = useLocaleFormField(normalizedEyebrow);
    const [errors, setErrors] = useState<HeroEyebrowFormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const eyebrowValues = commitAllLocales();
        const nextValues = createHeroEyebrowFormValues(eyebrowValues);
        const nextErrors = validateHeroEyebrowFormValues(nextValues);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            onSave(nextValues);
            setSaved(true);
            window.setTimeout(() => setSaved(false), 2000);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} aria-busy={submitting} className="space-y-3">
            <AdminLocaleSelector
                activeLocale={activeLocale}
                completion={completion}
                onChange={switchLocale}
                disabled={submitting}
            />

            <AdminFormField
                id={fieldId}
                label="Eyebrow label"
                required
                error={errors.eyebrow}
            >
                <input
                    id={fieldId}
                    value={draft}
                    dir={direction}
                    disabled={submitting}
                    onChange={(event) => {
                        setDraft(event.target.value);
                        setErrors({});
                        setSaved(false);
                    }}
                    placeholder="Short label above the headline"
                    aria-invalid={Boolean(errors.eyebrow)}
                    aria-describedby={adminFieldDescribedBy(fieldId, errors.eyebrow)}
                    className={cn(adminFieldClass, errors.eyebrow && adminFieldErrorClass)}
                />
            </AdminFormField>

            <div className="flex items-center justify-end gap-3">
                {saved ? (
                    <p className="text-xs font-medium text-secondary" role="status">
                        Eyebrow saved
                    </p>
                ) : null}
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-lg bg-accent px-3.5 py-1.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? 'Saving…' : 'Save eyebrow'}
                </button>
            </div>
        </form>
    );
}
