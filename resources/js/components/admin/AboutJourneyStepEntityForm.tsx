import { type FormEvent, useId, useState } from 'react';

import {
    createEmptyAboutJourneyStepFormValues,
    type AboutJourneyStepFormErrors,
    type AboutJourneyStepFormValues,
    type AboutJourneyStepSubmitPayload,
    validateAboutJourneyStepFormValues,
} from '@/components/admin/aboutJourneyStepForm';
import { AdminFormField } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
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

    const [values, setValues] = useState<AboutJourneyStepFormValues>(
        () => initialValues ?? createEmptyAboutJourneyStepFormValues(iconOptions),
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        () => initialValues?.image || null,
    );
    const [errors, setErrors] = useState<AboutJourneyStepFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const hasImage = Boolean(imageFile) || Boolean(values.image.trim());
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

        const nextErrors = validateAboutJourneyStepFormValues(values, hasImage);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit({
                values: {
                    ...values,
                    title: values.title.trim(),
                    description: values.description.trim(),
                    imageAlt: values.imageAlt.trim(),
                },
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
                        setValues((current) => ({
                            ...current,
                            image: preview ? current.image : '',
                        }));
                        setErrors((current) => ({ ...current, image: undefined }));
                    }}
                    error={errors.image}
                />

                <div className="grid gap-3">
                    <AdminFormField id={titleFieldId} label="Title" required error={errors.title}>
                        <input
                            id={titleFieldId}
                            value={values.title}
                            disabled={submitting}
                            onChange={(event) => {
                                setValues((current) => ({ ...current, title: event.target.value }));
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
                            value={values.imageAlt}
                            disabled={submitting}
                            onChange={(event) => {
                                setValues((current) => ({
                                    ...current,
                                    imageAlt: event.target.value,
                                }));
                                setErrors((current) => ({ ...current, imageAlt: undefined }));
                            }}
                            className={cn(adminFieldClass, errors.imageAlt && adminFieldErrorClass)}
                        />
                    </AdminFormField>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField
                            id={iconFieldId}
                            label="Icon"
                            required
                            error={errors.iconKey}
                        >
                            <select
                                id={iconFieldId}
                                value={values.iconKey}
                                disabled={submitting}
                                onChange={(event) => {
                                    setValues((current) => ({
                                        ...current,
                                        iconKey: event.target.value,
                                    }));
                                    setErrors((current) => ({ ...current, iconKey: undefined }));
                                }}
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
                                value={values.status}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        status: event.target.value as AboutJourneyStepFormValues['status'],
                                    }))
                                }
                                className={adminFieldClass}
                            >
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </select>
                        </AdminFormField>
                    </div>
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
