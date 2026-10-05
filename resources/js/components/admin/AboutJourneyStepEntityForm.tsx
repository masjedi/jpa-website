import { type FormEvent, useId, useMemo, useState } from 'react';

import { AdminLocaleSelector } from '@/components/admin/AdminLocaleSelector';
import { AdminFormField } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createEmptyAboutJourneyStepFormValues,
    type AboutJourneyStepFormErrors,
    type AboutJourneyStepFormValues,
    type AboutJourneyStepSubmitPayload,
    validateAboutJourneyStepFormValues,
} from '@/components/admin/aboutJourneyStepForm';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import {
    buildInitialLocaleMap,
    localeMapToTranslatedRecord,
    useLocaleFormFields,
} from '@/hooks/use-locale-form-fields';
import { mediaProfiles } from '@/lib/mediaProfiles';
import type { AboutIconOption } from '@/types/aboutPage';
import { cn } from '@/lib/utils';

interface AboutJourneyStepEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    iconOptions: readonly AboutIconOption[];
    initialValues?: AboutJourneyStepFormValues;
    onCancel: () => void;
    onSubmit: (payload: AboutJourneyStepSubmitPayload) => void | Promise<void>;
}

const journeyStepTranslatableFields = ['title', 'description', 'imageAlt'] as const;

const emptyJourneyStepFields = {
    title: '',
    description: '',
    imageAlt: '',
};

export function AboutJourneyStepEntityForm({
    formId,
    mode,
    iconOptions,
    initialValues,
    onCancel,
    onSubmit,
}: AboutJourneyStepEntityFormProps) {
    const titleFieldId = useId();
    const descriptionFieldId = useId();
    const imageFieldId = useId();
    const imageAltFieldId = useId();
    const iconFieldId = useId();
    const statusFieldId = useId();

    const startingValues =
        initialValues ?? createEmptyAboutJourneyStepFormValues(iconOptions);
    const initialByLocale = useMemo(
        () =>
            buildInitialLocaleMap(journeyStepTranslatableFields, {
                title: startingValues.title,
                description: startingValues.description,
                imageAlt: startingValues.imageAlt,
            }),
        [startingValues.description, startingValues.imageAlt, startingValues.title],
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
        emptyFields: emptyJourneyStepFields,
    });

    const [iconKey, setIconKey] = useState(startingValues.iconKey);
    const [status, setStatus] = useState(startingValues.status);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(startingValues.image || null);
    const [errors, setErrors] = useState<AboutJourneyStepFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const hasImage = Boolean(imageFile) || Boolean(startingValues.image.trim());
    const submitLabel =
        mode === 'edit'
            ? submitting
                ? 'Saving…'
                : 'Save changes'
            : submitting
              ? 'Saving…'
              : 'Create journey step';

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const localeValues = commitAllLocales();
        const translated = localeMapToTranslatedRecord(journeyStepTranslatableFields, localeValues);
        const payloadValues: AboutJourneyStepFormValues = {
            title: translated.title,
            description: translated.description,
            imageAlt: translated.imageAlt,
            image: startingValues.image,
            iconKey,
            status,
        };

        const nextErrors = validateAboutJourneyStepFormValues(payloadValues, hasImage);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit({
                values: payloadValues,
                imageFile,
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
            <div className="grid gap-5 p-4 lg:grid-cols-[15rem_minmax(0,1fr)]">
                <ImageUploadField
                    id={imageFieldId}
                    required
                    disabled={submitting}
                    hint={mediaProfiles.about_journey_image.hint}
                    previewUrl={imagePreview}
                    onChange={(file, preview) => {
                        setImageFile(file);
                        setImagePreview(preview);
                        setErrors((current) => ({ ...current, image: undefined }));
                    }}
                    error={errors.image}
                />

                <div className="space-y-3">
                    <AdminLocaleSelector
                        activeLocale={activeLocale}
                        completion={completion}
                        onChange={switchLocale}
                        disabled={submitting}
                    />

                    <AdminFormField id={titleFieldId} label="Title" required error={errors.title}>
                        <input
                            id={titleFieldId}
                            value={draft.title}
                            dir={direction}
                            disabled={submitting}
                            onChange={(event) => {
                                setField('title', event.target.value);
                                setErrors((current) => ({ ...current, title: undefined }));
                            }}
                            className={cn(adminFieldClass, errors.title && adminFieldErrorClass)}
                        />
                    </AdminFormField>

                    <AdminFormField
                        id={descriptionFieldId}
                        label="Description"
                        required
                        error={errors.description}
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
                            className={cn(
                                adminFieldClass,
                                'resize-y',
                                errors.description && adminFieldErrorClass,
                            )}
                        />
                    </AdminFormField>

                    <AdminFormField
                        id={imageAltFieldId}
                        label="Image alt text"
                        required
                        error={errors.imageAlt}
                    >
                        <input
                            id={imageAltFieldId}
                            value={draft.imageAlt}
                            dir={direction}
                            disabled={submitting}
                            onChange={(event) => {
                                setField('imageAlt', event.target.value);
                                setErrors((current) => ({ ...current, imageAlt: undefined }));
                            }}
                            className={cn(
                                adminFieldClass,
                                errors.imageAlt && adminFieldErrorClass,
                            )}
                        />
                    </AdminFormField>

                    <AdminFormField id={iconFieldId} label="Icon" required error={errors.iconKey}>
                        <select
                            id={iconFieldId}
                            value={iconKey}
                            disabled={submitting}
                            onChange={(event) => setIconKey(event.target.value)}
                            className={cn(adminFieldClass, errors.iconKey && adminFieldErrorClass)}
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
                                setStatus(event.target.value as AboutJourneyStepFormValues['status'])
                            }
                            className={adminFieldClass}
                        >
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                        </select>
                    </AdminFormField>
                </div>
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
