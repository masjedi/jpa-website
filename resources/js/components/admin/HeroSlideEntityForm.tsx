import { type FormEvent, useId, useState } from 'react';

import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createEmptyHeroSlideFormValues,
    type HeroSlideFormErrors,
    type HeroSlideFormValues,
    validateHeroSlideFormValues,
} from '@/components/admin/heroSlideForm';
import { cn } from '@/lib/utils';

interface HeroSlideEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    initialValues?: HeroSlideFormValues;
    onCancel: () => void;
    onSubmit: (values: HeroSlideFormValues) => void | Promise<void>;
}

export function HeroSlideEntityForm({
    formId,
    mode,
    initialValues,
    onCancel,
    onSubmit,
}: HeroSlideEntityFormProps) {
    const titleFieldId = useId();
    const subtitleFieldId = useId();

    const [values, setValues] = useState<HeroSlideFormValues>(
        () => initialValues ?? createEmptyHeroSlideFormValues(),
    );
    const [errors, setErrors] = useState<HeroSlideFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const submitLabel =
        mode === 'edit'
            ? submitting
                ? 'Saving…'
                : 'Save changes'
            : submitting
              ? 'Saving…'
              : 'Create slide';

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateHeroSlideFormValues(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit({
                title: values.title.trim(),
                subtitle: values.subtitle.trim(),
                status: values.status,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            id={formId}
            onSubmit={handleSubmit}
            aria-busy={submitting}
            className="flex min-h-0 flex-1 flex-col"
        >
            <div className="grid gap-3 p-4">
                <AdminFormField
                    id={titleFieldId}
                    label="Title"
                    required
                    error={errors.title}
                >
                    <input
                        id={titleFieldId}
                        value={values.title}
                        disabled={submitting}
                        onChange={(event) => {
                            setValues((current) => ({ ...current, title: event.target.value }));
                            setErrors((current) => ({ ...current, title: undefined }));
                        }}
                        placeholder="Discover Afghanistan with trusted local guidance"
                        aria-invalid={Boolean(errors.title)}
                        aria-describedby={adminFieldDescribedBy(titleFieldId, errors.title)}
                        className={cn(adminFieldClass, errors.title && adminFieldErrorClass)}
                    />
                </AdminFormField>

                <AdminFormField
                    id={subtitleFieldId}
                    label="Subtitle"
                    required
                    error={errors.subtitle}
                >
                    <textarea
                        id={subtitleFieldId}
                        value={values.subtitle}
                        disabled={submitting}
                        rows={3}
                        onChange={(event) => {
                            setValues((current) => ({ ...current, subtitle: event.target.value }));
                            setErrors((current) => ({ ...current, subtitle: undefined }));
                        }}
                        placeholder="Landscapes, heritage and hospitality — planned with people who know the country deeply."
                        aria-invalid={Boolean(errors.subtitle)}
                        aria-describedby={adminFieldDescribedBy(subtitleFieldId, errors.subtitle)}
                        className={cn(
                            adminFieldClass,
                            'resize-y',
                            errors.subtitle && adminFieldErrorClass,
                        )}
                    />
                </AdminFormField>
            </div>

            <footer className="flex flex-col-reverse gap-2 border-t border-border bg-surface px-4 py-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-lg border border-border px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-lg bg-accent px-3.5 py-1.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitLabel}
                </button>
            </footer>
        </form>
    );
}
