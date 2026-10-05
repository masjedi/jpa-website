import { type FormEvent, useId, useMemo, useState } from 'react';

import { AdminLocaleSelector } from '@/components/admin/AdminLocaleSelector';
import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createEmptyServiceFormValues,
    type ServiceFormErrors,
    type ServiceFormValues,
    validateServiceFormValues,
} from '@/components/admin/serviceForm';
import {
    buildInitialLocaleMap,
    localeMapToTranslatedRecord,
    useLocaleFormFields,
} from '@/hooks/use-locale-form-fields';
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

const serviceTranslatableFields = ['title', 'tagline', 'description', 'featuresText'] as const;

const emptyServiceFields = {
    title: '',
    tagline: '',
    description: '',
    featuresText: '',
};

export function ServiceEntityForm({
    formId,
    mode,
    iconOptions,
    categoryOptions,
    initialValues,
    onCancel,
    onSubmit,
}: ServiceEntityFormProps) {
    const slugFieldId = useId();
    const categoryFieldId = useId();
    const iconFieldId = useId();
    const featuredFieldId = useId();
    const homeFieldId = useId();
    const statusFieldId = useId();
    const titleFieldId = useId();
    const taglineFieldId = useId();
    const descriptionFieldId = useId();
    const featuresFieldId = useId();

    const startingValues =
        initialValues ?? createEmptyServiceFormValues(iconOptions, categoryOptions);
    const initialByLocale = useMemo(
        () =>
            buildInitialLocaleMap(serviceTranslatableFields, {
                title: startingValues.title,
                tagline: startingValues.tagline,
                description: startingValues.description,
                featuresText: startingValues.featuresText,
            }),
        [
            startingValues.description,
            startingValues.featuresText,
            startingValues.tagline,
            startingValues.title,
        ],
    );

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
        emptyFields: emptyServiceFields,
    });

    const [slug, setSlug] = useState(startingValues.slug);
    const [category, setCategory] = useState(startingValues.category);
    const [iconKey, setIconKey] = useState(startingValues.iconKey);
    const [isFeatured, setIsFeatured] = useState(startingValues.isFeatured);
    const [showOnHome, setShowOnHome] = useState(startingValues.showOnHome);
    const [status, setStatus] = useState(startingValues.status);
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

        const localeValues = commitAllLocales();
        const translated = localeMapToTranslatedRecord(serviceTranslatableFields, localeValues);
        const payloadValues: ServiceFormValues = {
            title: translated.title,
            slug,
            tagline: translated.tagline,
            description: translated.description,
            category,
            iconKey,
            featuresText: translated.featuresText,
            isFeatured,
            showOnHome,
            status,
        };

        const nextErrors = validateServiceFormValues(payloadValues);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit({
                ...payloadValues,
                slug: slug.trim(),
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
                <AdminLocaleSelector
                    activeLocale={activeLocale}
                    completion={completion}
                    onChange={switchLocale}
                    disabled={submitting}
                    className="sm:col-span-2"
                />

                <AdminFormField
                    id={titleFieldId}
                    label="Title"
                    required
                    error={errors.title}
                    className="sm:col-span-2"
                >
                    <input
                        id={titleFieldId}
                        value={draft.title}
                        dir={direction}
                        disabled={submitting}
                        onChange={(event) => {
                            setField('title', event.target.value);
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
                        value={slug}
                        disabled={submitting}
                        onChange={(event) => setSlug(event.target.value)}
                        placeholder="Generated from title"
                        className={adminFieldClass}
                    />
                </AdminFormField>

                <AdminFormField id={categoryFieldId} label="Category">
                    <select
                        id={categoryFieldId}
                        value={category}
                        disabled={submitting}
                        onChange={(event) =>
                            setCategory(event.target.value as ServiceCategory)
                        }
                        className={adminFieldClass}
                    >
                        {categoryOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
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
                        value={draft.tagline}
                        dir={direction}
                        disabled={submitting}
                        onChange={(event) => {
                            setField('tagline', event.target.value);
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
                        value={draft.description}
                        dir={direction}
                        disabled={submitting}
                        rows={4}
                        onChange={(event) => {
                            setField('description', event.target.value);
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
                        value={iconKey}
                        disabled={submitting}
                        onChange={(event) => setIconKey(event.target.value)}
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
                        value={status}
                        disabled={submitting}
                        onChange={(event) =>
                            setStatus(event.target.value as ServiceFormValues['status'])
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
                        value={draft.featuresText}
                        dir={direction}
                        disabled={submitting}
                        rows={4}
                        onChange={(event) => {
                            setField('featuresText', event.target.value);
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
                        checked={isFeatured}
                        disabled={submitting}
                        onChange={(event) => setIsFeatured(event.target.checked)}
                        className="size-4 rounded border-border text-secondary focus:ring-focus"
                    />
                    Featured on Services
                </label>

                <label className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-surface px-3 py-2.5 text-sm font-medium text-foreground">
                    <input
                        id={homeFieldId}
                        type="checkbox"
                        checked={showOnHome}
                        disabled={submitting}
                        onChange={(event) => setShowOnHome(event.target.checked)}
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
