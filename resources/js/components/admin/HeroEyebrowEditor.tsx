import { type FormEvent, useId, useState } from 'react';

import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createHeroEyebrowFormValues,
    type HeroEyebrowFormErrors,
    type HeroEyebrowFormValues,
    validateHeroEyebrowFormValues,
} from '@/components/admin/heroEyebrowForm';
import { cn } from '@/lib/utils';

interface HeroEyebrowEditorProps {
    eyebrow: string;
    onSave: (values: HeroEyebrowFormValues) => void;
}

export function HeroEyebrowEditor({ eyebrow, onSave }: HeroEyebrowEditorProps) {
    const fieldId = useId();
    const [values, setValues] = useState<HeroEyebrowFormValues>(() =>
        createHeroEyebrowFormValues(eyebrow),
    );
    const [errors, setErrors] = useState<HeroEyebrowFormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateHeroEyebrowFormValues(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            onSave({
                eyebrow: values.eyebrow.trim(),
            });
            setSaved(true);
            window.setTimeout(() => setSaved(false), 2000);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} aria-busy={submitting} className="space-y-3">
            <AdminFormField
                id={fieldId}
                label="Eyebrow label"
                required
                error={errors.eyebrow}
            >
                <input
                    id={fieldId}
                    value={values.eyebrow}
                    disabled={submitting}
                    onChange={(event) => {
                        setValues({ eyebrow: event.target.value });
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
