import { type FormEvent, useId, useState } from 'react';

import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createEmptyServiceFormValues,
    type ServiceFormErrors,
    type ServiceFormValues,
    validateServiceFormValues,
} from '@/components/admin/serviceForm';
import { cn } from '@/lib/utils';
import type { ServiceCategory, ServiceIconOption } from '@/types/services';

interface ServiceEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    iconOptions: readonly ServiceIconOption[];
    categoryOptions: readonly ServiceCategory[];
    initialValues?: ServiceFormValues;
    onCancel: () => void;
    onSubmit: (values: ServiceFormValues) => void | Promise<void>;
}

export function ServiceEntityForm({
    formId,
    mode,
    iconOptions,
    categoryOptions,
    initialValues,
    onCancel,
    onSubmit,
}: ServiceEntityFormProps) {
    const titleFieldId = useId();
    const slugFieldId = useId();
    const taglineFieldId = useId();
    const descriptionFieldId = useId();
    const categoryFieldId = useId();
    const iconFieldId = useId();
    const featuresFieldId = useId();
    const featuredFieldId = useId();
    const homeFieldId = useId();
    const statusFieldId = useId();

    const [values, setValues] = useState<ServiceFormValues>(
        () => initialValues ?? createEmptyServiceFormValues(iconOptions, categoryOptions),
    );
    const [errors, setErrors] = useState<ServiceFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const submitLabel =
        mode === 'edit'
            ? submitting
                ? 'Saving…'
                : 'Save changes'
            : submitting
              ? 'Saving…'
              : 'Create service';

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateServiceFormValues(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit({
                ...values,
                title: values.title.trim(),
                slug: values.slug.trim(),
                tagline: values.tagline.trim(),
                description: values.description.trim(),
                featuresText: values.featuresText.trim(),
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
            <div className="grid gap-3 p-4 sm:grid-cols-2">
                <AdminFormField
                    id={titleFieldId}
                    label="Title"
                    required
                    error={errors.title}
                    className="sm:col-span-2"
                >
                    <input
                        id={titleFieldId}
                        value={values.title}
                        disabled={submitting}
                        onChange={(event) => {
                            setValues((current) => ({ ...current, title: event.target.value }));
                            setErrors((current) => ({ ...current, title: undefined }));
                        }}
                        placeholder="Guided tours"
                        aria-invalid={Boolean(errors.title)}
                        aria-describedby={adminFieldDescribedBy(titleFieldId, errors.title)}
                        className={cn(adminFieldClass, errors.title && adminFieldErrorClass)}
                    />
                </AdminFormField>

                <AdminFormField id={slugFieldId} label="Slug">
                    <input
                        id={slugFieldId}
                        value={values.slug}
                        disabled={submitting}
                        onChange={(event) =>
                            setValues((current) => ({ ...current, slug: event.target.value }))
                        }
                        placeholder="Generated from title"
                        className={adminFieldClass}
                    />
                </AdminFormField>

                <AdminFormField id={categoryFieldId} label="Category">
                    <select
                        id={categoryFieldId}
                        value={values.category}
                        disabled={submitting}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                category: event.target.value as ServiceCategory,
                            }))
                        }
                        className={adminFieldClass}
                    >
                        {categoryOptions.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </AdminFormField>

                <AdminFormField
                    id={taglineFieldId}
                    label="Tagline"
                    required
                    error={errors.tagline}
                    className="sm:col-span-2"
                >
                    <input
                        id={taglineFieldId}
                        value={values.tagline}
                        disabled={submitting}
                        onChange={(event) => {
                            setValues((current) => ({ ...current, tagline: event.target.value }));
                            setErrors((current) => ({ ...current, tagline: undefined }));
                        }}
                        placeholder="Small-group journeys with experienced local guides."
                        aria-invalid={Boolean(errors.tagline)}
                        aria-describedby={adminFieldDescribedBy(taglineFieldId, errors.tagline)}
                        className={cn(adminFieldClass, errors.tagline && adminFieldErrorClass)}
                    />
                </AdminFormField>

                <AdminFormField
                    id={descriptionFieldId}
                    label="Description"
                    required
                    error={errors.description}
                    className="sm:col-span-2"
                >
                    <textarea
                        id={descriptionFieldId}
                        value={values.description}
                        disabled={submitting}
                        rows={4}
                        onChange={(event) => {
                            setValues((current) => ({
                                ...current,
                                description: event.target.value,
                            }));
                            setErrors((current) => ({ ...current, description: undefined }));
                        }}
                        placeholder="Join curated departures across Bamiyan, Herat and Kabul…"
                        aria-invalid={Boolean(errors.description)}
                        aria-describedby={adminFieldDescribedBy(
                            descriptionFieldId,
                            errors.description,
                        )}
                        className={cn(
                            adminFieldClass,
                            'resize-y',
                            errors.description && adminFieldErrorClass,
                        )}
                    />
                </AdminFormField>

                <AdminFormField id={iconFieldId} label="Icon">
                    <select
                        id={iconFieldId}
                        value={values.iconKey}
                        disabled={submitting}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                iconKey: event.target.value,
                            }))
                        }
                        className={adminFieldClass}
                    >
                        {iconOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </AdminFormField>

                <AdminFormField id={statusFieldId} label="Status">
                    <select
                        id={statusFieldId}
                        value={values.status}
                        disabled={submitting}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                status: event.target.value as ServiceFormValues['status'],
                            }))
                        }
                        className={adminFieldClass}
                    >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                    </select>
                </AdminFormField>

                <AdminFormField
                    id={featuresFieldId}
                    label="Features"
                    required
                    error={errors.featuresText}
                    className="sm:col-span-2"
                >
                    <textarea
                        id={featuresFieldId}
                        value={values.featuresText}
                        disabled={submitting}
                        rows={4}
                        onChange={(event) => {
                            setValues((current) => ({
                                ...current,
                                featuresText: event.target.value,
                            }));
                            setErrors((current) => ({ ...current, featuresText: undefined }));
                        }}
                        placeholder={'English-speaking Afghan lead guide\nPermits and regional logistics included'}
                        aria-invalid={Boolean(errors.featuresText)}
                        aria-describedby={adminFieldDescribedBy(
                            featuresFieldId,
                            errors.featuresText,
                        )}
                        className={cn(
                            adminFieldClass,
                            'resize-y',
                            errors.featuresText && adminFieldErrorClass,
                        )}
                    />
                    <p className="text-[11px] text-muted-foreground">One feature per line.</p>
                </AdminFormField>

                <label className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-surface px-3 py-2.5 text-sm font-medium text-foreground">
                    <input
                        id={featuredFieldId}
                        type="checkbox"
                        checked={values.isFeatured}
                        disabled={submitting}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                isFeatured: event.target.checked,
                            }))
                        }
                        className="size-4 rounded border-border text-secondary focus:ring-focus"
                    />
                    Featured on Services
                </label>

                <label className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-surface px-3 py-2.5 text-sm font-medium text-foreground">
                    <input
                        id={homeFieldId}
                        type="checkbox"
                        checked={values.showOnHome}
                        disabled={submitting}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                showOnHome: event.target.checked,
                            }))
                        }
                        className="size-4 rounded border-border text-secondary focus:ring-focus"
                    />
                    Show on homepage
                </label>
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
