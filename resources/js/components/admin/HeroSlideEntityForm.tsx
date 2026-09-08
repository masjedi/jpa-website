import { usePage } from '@inertiajs/react';
import { type FormEvent, useEffect, useId, useMemo, useState } from 'react';

import { AdminLocaleSelector } from '@/components/admin/AdminLocaleSelector';
import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createEmptyHeroSlideFormValues,
    mapServerHeroSlideFormErrors,
    type HeroSlideFormErrors,
    type HeroSlideFormValues,
    type HeroSlideSubmitPayload,
    validateHeroSlideFormValues,
} from '@/components/admin/heroSlideForm';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import {
    localeMapToTranslatedFields,
    translatedFieldToLocaleMap,
    useLocaleFormFields,
} from '@/hooks/use-locale-form-fields';
import { mediaProfiles } from '@/lib/mediaProfiles';
import { prepareHeroSlideImage } from '@/lib/prepareImageUpload';
import { cn } from '@/lib/utils';

interface HeroSlideEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    initialValues?: HeroSlideFormValues;
    onCancel: () => void;
    onSubmit: (payload: HeroSlideSubmitPayload) => void | Promise<void>;
    onSubmittingChange?: (submitting: boolean) => void;
}

const emptySlideFields = {
    title: '',
    subtitle: '',
};

export function HeroSlideEntityForm({
    formId,
    mode,
    initialValues,
    onCancel,
    onSubmit,
    onSubmittingChange,
}: HeroSlideEntityFormProps) {
    const { errors: serverErrors } = usePage().props;
    const titleFieldId = useId();
    const subtitleFieldId = useId();
    const imageFieldId = useId();
    const heroImageSpec = mediaProfiles.hero_slide;

    const startingValues = initialValues ?? createEmptyHeroSlideFormValues();
    const initialByLocale = useMemo(
        () => translatedFieldToLocaleMap(startingValues.title, startingValues.subtitle),
        [startingValues.subtitle, startingValues.title],
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
        emptyFields: emptySlideFields,
    });

    const [status, setStatus] = useState<HeroSlideFormValues['status']>(startingValues.status);
    const [heroImage, setHeroImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
        startingValues.existingImageUrl,
    );
    const [errors, setErrors] = useState<HeroSlideFormErrors>(() =>
        mapServerHeroSlideFormErrors(serverErrors as Record<string, string | string[] | undefined>),
    );
    const [submitting, setSubmitting] = useState(false);
    const [preparingImage, setPreparingImage] = useState(false);

    useEffect(() => {
        setErrors(mapServerHeroSlideFormErrors(serverErrors as Record<string, string | string[] | undefined>));
    }, [serverErrors]);

    useEffect(() => {
        onSubmittingChange?.(submitting || preparingImage);
    }, [onSubmittingChange, preparingImage, submitting]);

    const submitLabel =
        preparingImage
            ? 'Preparing image…'
            : mode === 'edit'
              ? submitting
                  ? 'Saving…'
                  : 'Save changes'
              : submitting
                ? 'Saving…'
                : 'Create slide';

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const localeValues = commitAllLocales();
        const translated = localeMapToTranslatedFields(localeValues);
        const payloadValues: HeroSlideFormValues = {
            title: translated.title,
            subtitle: translated.subtitle,
            status,
            existingImageUrl: startingValues.existingImageUrl,
        };

        const hasImage = heroImage !== null || Boolean(startingValues.existingImageUrl);
        const nextErrors = validateHeroSlideFormValues(payloadValues, hasImage);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit({
                values: payloadValues,
                heroImage,
            });
        } catch {
            // Server validation errors are synced when Inertia updates page props.
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageChange = async (file: File | null, previewUrl: string | null) => {
        if (!file) {
            setHeroImage(null);
            setImagePreviewUrl(previewUrl);
            setErrors((current) => ({ ...current, image: undefined }));

            return;
        }

        setPreparingImage(true);
        setErrors((current) => ({ ...current, image: undefined }));

        try {
            const prepared = await prepareHeroSlideImage(file);
            const preparedPreview = URL.createObjectURL(prepared);

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

            setHeroImage(prepared);
            setImagePreviewUrl(preparedPreview);
        } catch {
            setErrors((current) => ({
                ...current,
                image: 'The selected image could not be prepared for upload.',
            }));
            setHeroImage(null);
            setImagePreviewUrl(startingValues.existingImageUrl);
        } finally {
            setPreparingImage(false);
        }
    };

    return (
        <form
            id={formId}
            onSubmit={handleSubmit}
            aria-busy={submitting || preparingImage}
            className="flex min-h-0 flex-1 flex-col"
        >
            <div className="grid gap-3 p-4">
                <ImageUploadField
                    id={imageFieldId}
                    label="Hero background image"
                    required
                    disabled={submitting || preparingImage}
                    previewUrl={imagePreviewUrl}
                    onChange={handleImageChange}
                    error={errors.image}
                    hint={heroImageSpec.hint}
                    previewAspectClass="aspect-video"
                    previewMaxHeightClass="max-h-56"
                    previewObjectFit="cover"
                />

                <AdminLocaleSelector
                    activeLocale={activeLocale}
                    completion={completion}
                    onChange={switchLocale}
                    disabled={submitting || preparingImage}
                />

                <AdminFormField
                    id={titleFieldId}
                    label="Title"
                    required
                    error={errors.title}
                >
                    <input
                        id={titleFieldId}
                        value={draft.title}
                        dir={direction}
                        disabled={submitting || preparingImage}
                        onChange={(event) => {
                            setField('title', event.target.value);
                            setErrors((current) => ({ ...current, title: undefined }));
                        }}
                        placeholder="Headline shown in the homepage hero"
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
                        value={draft.subtitle}
                        dir={direction}
                        disabled={submitting || preparingImage}
                        rows={3}
                        onChange={(event) => {
                            setField('subtitle', event.target.value);
                            setErrors((current) => ({ ...current, subtitle: undefined }));
                        }}
                        placeholder="Supporting sentence under the headline"
                        aria-invalid={Boolean(errors.subtitle)}
                        aria-describedby={adminFieldDescribedBy(subtitleFieldId, errors.subtitle)}
                        className={cn(
                            adminFieldClass,
                            'resize-y',
                            errors.subtitle && adminFieldErrorClass,
                        )}
                    />
                </AdminFormField>

                <AdminFormField id={`${formId}-status`} label="Status" required>
                    <select
                        id={`${formId}-status`}
                        value={status}
                        disabled={submitting || preparingImage}
                        onChange={(event) => {
                            setStatus(event.target.value as HeroSlideFormValues['status']);
                        }}
                        className={adminFieldClass}
                    >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                    </select>
                </AdminFormField>

                {preparingImage ? (
                    <p className="text-xs text-muted-foreground" role="status">
                        Optimizing the selected image for upload…
                    </p>
                ) : null}

                {submitting && heroImage ? (
                    <p className="text-xs text-muted-foreground" role="status">
                        Processing and uploading the hero image. Large files can take up to a minute on
                        shared hosting.
                    </p>
                ) : null}
            </div>

            <footer className="flex flex-col-reverse gap-2 border-t border-border bg-surface px-4 py-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting || preparingImage}
                    className="inline-flex items-center justify-center rounded-lg border border-border px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting || preparingImage}
                    className="inline-flex items-center justify-center rounded-lg bg-accent px-3.5 py-1.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitLabel}
                </button>
            </footer>
        </form>
    );
}
