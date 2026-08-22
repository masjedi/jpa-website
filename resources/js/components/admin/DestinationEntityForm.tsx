import { type FormEvent, useId, useState } from 'react';

import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createEmptyDestinationFormValues,
    destinationRegionOptions,
    type DestinationFormErrors,
    type DestinationFormValues,
    validateDestinationFormValues,
} from '@/components/admin/destinationForm';
import { ImageUploadField, readImageFileAsDataUrl } from '@/components/admin/ImageUploadField';
import { LazyRichTextEditor } from '@/components/admin/LazyRichTextEditor';
import { cn } from '@/lib/utils';

interface DestinationEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    initialValues?: DestinationFormValues;
    onCancel: () => void;
    onSubmit: (values: DestinationFormValues) => void | Promise<void>;
}

export function DestinationEntityForm({
    formId,
    mode,
    initialValues,
    onCancel,
    onSubmit,
}: DestinationEntityFormProps) {
    const regionFieldId = useId();
    const titleFieldId = useId();
    const taglineFieldId = useId();
    const imageFieldId = useId();
    const descriptionFieldId = useId();

    const [values, setValues] = useState<DestinationFormValues>(
        () => initialValues ?? createEmptyDestinationFormValues(),
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        () => initialValues?.image || null,
    );
    const [errors, setErrors] = useState<DestinationFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const hasImage = Boolean(imageFile) || Boolean(values.image.trim());
    const submitLabel =
        mode === 'edit'
            ? submitting
                ? 'Saving…'
                : 'Save changes'
            : submitting
              ? 'Saving…'
              : 'Create destination';

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateDestinationFormValues(values, hasImage);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            const image = imageFile ? await readImageFileAsDataUrl(imageFile) : values.image.trim();

            await onSubmit({
                name: values.name.trim(),
                tagline: values.tagline.trim(),
                region: values.region,
                image,
                description: values.description.trim(),
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
            <div className="grid gap-3 p-4 lg:grid-cols-3">
                <AdminFormField id={regionFieldId} label="Region" required>
                    <select
                        id={regionFieldId}
                        value={values.region}
                        disabled={submitting}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                region: event.target.value as DestinationFormValues['region'],
                            }))
                        }
                        className={adminFieldClass}
                    >
                        {destinationRegionOptions.map((region) => (
                            <option key={region} value={region}>
                                {region}
                            </option>
                        ))}
                    </select>
                </AdminFormField>

                <AdminFormField
                    id={titleFieldId}
                    label="Title"
                    required
                    error={errors.name}
                >
                    <input
                        id={titleFieldId}
                        value={values.name}
                        disabled={submitting}
                        onChange={(event) => {
                            setValues((current) => ({ ...current, name: event.target.value }));
                            setErrors((current) => ({ ...current, name: undefined }));
                        }}
                        placeholder="Kabul"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={adminFieldDescribedBy(titleFieldId, errors.name)}
                        className={cn(adminFieldClass, errors.name && adminFieldErrorClass)}
                    />
                </AdminFormField>

                <AdminFormField
                    id={taglineFieldId}
                    label="Sub-title"
                    required
                    error={errors.tagline}
                >
                    <input
                        id={taglineFieldId}
                        value={values.tagline}
                        disabled={submitting}
                        onChange={(event) => {
                            setValues((current) => ({ ...current, tagline: event.target.value }));
                            setErrors((current) => ({ ...current, tagline: undefined }));
                        }}
                        placeholder="Museums, gardens, and the rhythm of the capital."
                        aria-invalid={Boolean(errors.tagline)}
                        aria-describedby={adminFieldDescribedBy(taglineFieldId, errors.tagline)}
                        className={cn(adminFieldClass, errors.tagline && adminFieldErrorClass)}
                    />
                </AdminFormField>

                <ImageUploadField
                    id={imageFieldId}
                    className="lg:col-span-1"
                    required
                    disabled={submitting}
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

                <div className="lg:col-span-2">
                    <LazyRichTextEditor
                        id={descriptionFieldId}
                        label="Description"
                        required
                        disabled={submitting}
                        value={values.description}
                        onChange={(description) => {
                            setValues((current) => ({ ...current, description }));
                            setErrors((current) => ({ ...current, description: undefined }));
                        }}
                        placeholder="Write the destination story, highlights, and practical notes for the detail page."
                        error={errors.description}
                    />
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
