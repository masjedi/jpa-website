import { usePage } from '@inertiajs/react';
import { type FormEvent, useId, useMemo, useState } from 'react';

import { AdminLocaleSelector } from '@/components/admin/AdminLocaleSelector';
import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createEmptyTestimonialFormValues,
    mapServerTestimonialFormErrors,
    type TestimonialFormErrors,
    type TestimonialFormSubmitPayload,
    type TestimonialFormValues,
    validateTestimonialFormValues,
} from '@/components/admin/testimonialForm';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import {
    buildInitialLocaleMap,
    localeMapToTranslatedRecord,
    useLocaleFormFields,
} from '@/hooks/use-locale-form-fields';
import { cn } from '@/lib/utils';

interface TestimonialEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    initialValues?: TestimonialFormValues;
    uploadHint: string;
    onCancel: () => void;
    onSubmit: (payload: TestimonialFormSubmitPayload) => void | Promise<void>;
}

const testimonialTranslatableFields = ['name', 'journey', 'text'] as const;

const emptyTestimonialFields = {
    name: '',
    journey: '',
    text: '',
};

export function TestimonialEntityForm({
    formId,
    mode,
    initialValues,
    uploadHint,
    onCancel,
    onSubmit,
}: TestimonialEntityFormProps) {
    const { errors: serverErrors } = usePage().props;
    const imageFieldId = useId();
    const nameFieldId = useId();
    const journeyFieldId = useId();
    const textFieldId = useId();
    const ratingFieldId = useId();
    const statusFieldId = useId();

    const startingValues = initialValues ?? createEmptyTestimonialFormValues();
    const initialByLocale = useMemo(
        () =>
            buildInitialLocaleMap(testimonialTranslatableFields, {
                name: startingValues.name,
                journey: startingValues.journey,
                text: startingValues.text,
            }),
        [startingValues.journey, startingValues.name, startingValues.text],
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
        emptyFields: emptyTestimonialFields,
    });

    const [rating, setRating] = useState(startingValues.rating);
    const [status, setStatus] = useState(startingValues.status);
    const [avatarImage, setAvatarImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState(startingValues.image);
    const [errors, setErrors] = useState<TestimonialFormErrors>(() =>
        mapServerTestimonialFormErrors(serverErrors as Record<string, string | string[] | undefined>),
    );
    const [submitting, setSubmitting] = useState(false);

    const hasImage = avatarImage !== null || startingValues.image.trim() !== '';

    const submitLabel =
        mode === 'edit'
            ? submitting
                ? 'Saving…'
                : 'Save changes'
            : submitting
              ? 'Saving…'
              : 'Create testimonial';

    const handleImageChange = (file: File | null, nextPreviewUrl: string) => {
        setAvatarImage(file);
        setPreviewUrl(nextPreviewUrl);
        setErrors((current) => ({ ...current, image: undefined }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const localeValues = commitAllLocales();
        const translated = localeMapToTranslatedRecord(testimonialTranslatableFields, localeValues);
        const payloadValues: TestimonialFormValues = {
            name: translated.name,
            journey: translated.journey,
            text: translated.text,
            image: startingValues.image,
            rating,
            status,
        };

        const nextErrors = validateTestimonialFormValues(payloadValues, hasImage);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit({
                values: payloadValues,
                avatarImage,
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
                <ImageUploadField
                    id={imageFieldId}
                    label="Portrait"
                    required={mode === 'create'}
                    disabled={submitting}
                    previewUrl={previewUrl}
                    onChange={handleImageChange}
                    error={errors.image}
                    hint={uploadHint}
                    previewAspectClass="aspect-square"
                    previewObjectFit="cover"
                />

                <AdminLocaleSelector
                    activeLocale={activeLocale}
                    completion={completion}
                    onChange={switchLocale}
                    disabled={submitting}
                />

                <AdminFormField id={nameFieldId} label="Name" required error={errors.name}>
                    <input
                        id={nameFieldId}
                        value={draft.name}
                        dir={direction}
                        disabled={submitting}
                        onChange={(event) => {
                            setField('name', event.target.value);
                            setErrors((current) => ({ ...current, name: undefined }));
                        }}
                        placeholder="Traveler name"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={adminFieldDescribedBy(nameFieldId, errors.name)}
                        className={cn(adminFieldClass, errors.name && adminFieldErrorClass)}
                    />
                </AdminFormField>

                <AdminFormField id={journeyFieldId} label="Journey" required error={errors.journey}>
                    <input
                        id={journeyFieldId}
                        value={draft.journey}
                        dir={direction}
                        disabled={submitting}
                        onChange={(event) => {
                            setField('journey', event.target.value);
                            setErrors((current) => ({ ...current, journey: undefined }));
                        }}
                        placeholder="Bamiyan Valley tour, March 2025"
                        aria-invalid={Boolean(errors.journey)}
                        aria-describedby={adminFieldDescribedBy(journeyFieldId, errors.journey)}
                        className={cn(adminFieldClass, errors.journey && adminFieldErrorClass)}
                    />
                </AdminFormField>

                <AdminFormField id={textFieldId} label="Quote" required error={errors.text}>
                    <textarea
                        id={textFieldId}
                        value={draft.text}
                        dir={direction}
                        disabled={submitting}
                        rows={4}
                        onChange={(event) => {
                            setField('text', event.target.value);
                            setErrors((current) => ({ ...current, text: undefined }));
                        }}
                        placeholder="What the traveler said about their experience"
                        aria-invalid={Boolean(errors.text)}
                        aria-describedby={adminFieldDescribedBy(textFieldId, errors.text)}
                        className={cn(
                            adminFieldClass,
                            'resize-y',
                            errors.text && adminFieldErrorClass,
                        )}
                    />
                </AdminFormField>

                <AdminFormField id={ratingFieldId} label="Rating" required error={errors.rating}>
                    <select
                        id={ratingFieldId}
                        value={rating}
                        disabled={submitting}
                        onChange={(event) => {
                            setRating(Number(event.target.value));
                            setErrors((current) => ({ ...current, rating: undefined }));
                        }}
                        className={cn(adminFieldClass, errors.rating && adminFieldErrorClass)}
                    >
                        {[5, 4, 3, 2, 1].map((value) => (
                            <option key={value} value={value}>
                                {value} stars
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
                            setStatus(event.target.value as TestimonialFormValues['status'])
                        }
                        className={adminFieldClass}
                    >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                    </select>
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
