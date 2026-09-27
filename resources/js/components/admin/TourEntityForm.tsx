import { usePage } from '@inertiajs/react';
import { type FormEvent, type ReactNode, useEffect, useId, useMemo, useState } from 'react';

import { AdminLocaleSelector } from '@/components/admin/AdminLocaleSelector';
import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    applyPackageFormDefaults,
    createEmptyTourFormValues,
    emptyTourFilterOptions,
    tourListingTypeOptions,
    mapServerTourFormErrors,
    localeMapToTourTranslatableValues,
    tourFormValuesToLocaleMap,
    tourTranslatableEmptyFields,
    type TourFormErrors,
    type TourFormSubmitPayload,
    type TourFormValues,
    validateTourFormValues,
    withCurrentTourFilterOption,
} from '@/components/admin/tourForm';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { mediaProfiles } from '@/lib/mediaProfiles';
import { LazyRichTextEditor } from '@/components/admin/LazyRichTextEditor';
import { useLocaleFormFields } from '@/hooks/use-locale-form-fields';
import { cn } from '@/lib/utils';
import type { TourFilterFieldOptions } from '@/types/tourFilterOptions';

interface TourEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    initialValues?: TourFormValues;
    filterOptions?: TourFilterFieldOptions;
    onCancel: () => void;
    onSubmit: (payload: TourFormSubmitPayload) => void | Promise<void>;
}

function FormDivider() {
    return <div className="border-t border-border/70" aria-hidden />;
}

function FormGroup({
    title,
    columns = 3,
    children,
}: {
    title: string;
    columns?: 2 | 3;
    children: ReactNode;
}) {
    return (
        <section className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {title}
            </h3>
            <div
                className={cn(
                    'grid gap-3',
                    columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 xl:grid-cols-3',
                )}
            >
                {children}
            </div>
        </section>
    );
}

function ListingTypeToggle({
    value,
    disabled,
    onChange,
}: {
    value: TourFormValues['listingType'];
    disabled?: boolean;
    onChange: (value: TourFormValues['listingType']) => void;
}) {
    return (
        <div
            className={cn(
                'grid grid-cols-2 gap-1 rounded-xl border border-border bg-surface-muted/40 p-1',
                disabled && 'opacity-70',
            )}
            role="group"
            aria-label="Listing type"
        >
            {tourListingTypeOptions.map((option) => {
                const active = value === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        disabled={disabled}
                        aria-pressed={active}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            'rounded-lg px-2.5 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                            active
                                ? 'bg-surface text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground',
                            disabled && 'cursor-not-allowed',
                        )}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

const spanTwo = 'sm:col-span-2';
const spanThree = 'sm:col-span-2 xl:col-span-3';

export function TourEntityForm({
    formId,
    mode,
    initialValues,
    filterOptions = emptyTourFilterOptions,
    onCancel,
    onSubmit,
}: TourEntityFormProps) {
    const statusFieldId = useId();
    const regionFieldId = useId();
    const titleFieldId = useId();
    const summaryFieldId = useId();
    const destinationFieldId = useId();
    const durationFieldId = useId();
    const travelStyleFieldId = useId();
    const difficultyFieldId = useId();
    const badgeFieldId = useId();
    const packagePriceFieldId = useId();
    const popularFieldId = useId();
    const highlightsFieldId = useId();
    const includedFieldId = useId();
    const imageFieldId = useId();
    const contentFieldId = useId();

    const startingValues = initialValues ?? createEmptyTourFormValues(filterOptions);
    const initialByLocale = useMemo(
        () => tourFormValuesToLocaleMap(startingValues),
        [startingValues],
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
        emptyFields: tourTranslatableEmptyFields(),
    });

    const [listingType, setListingType] = useState(startingValues.listingType);
    const [region, setRegion] = useState(startingValues.region);
    const [durationDays, setDurationDays] = useState(startingValues.durationDays);
    const [travelStyle, setTravelStyle] = useState(startingValues.travelStyle);
    const [difficulty, setDifficulty] = useState(startingValues.difficulty);
    const [isPopular, setIsPopular] = useState(startingValues.isPopular);
    const [status, setStatus] = useState(startingValues.status);
    const [existingImage, setExistingImage] = useState(startingValues.image);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        () => initialValues?.image || null,
    );
    const [errors, setErrors] = useState<TourFormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const { errors: serverErrors } = usePage().props;

    useEffect(() => {
        const mapped = mapServerTourFormErrors(serverErrors);

        if (Object.keys(mapped).length > 0) {
            setErrors((current) => ({ ...current, ...mapped }));
        }
    }, [serverErrors]);

    const isPackage = listingType === 'package';
    const hasImage = Boolean(imageFile) || Boolean((existingImage ?? '').trim());
    const regionOptions = withCurrentTourFilterOption(filterOptions.regions, region);
    const travelStyleOptions = withCurrentTourFilterOption(
        filterOptions.travelStyles,
        travelStyle,
    );
    const difficultyOptions = withCurrentTourFilterOption(
        filterOptions.difficulties,
        difficulty,
    );
    const submitLabel =
        mode === 'edit'
            ? submitting
                ? 'Saving…'
                : 'Save changes'
            : submitting
              ? 'Saving…'
              : isPackage
                ? 'Create package'
                : 'Create tour';

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const shared = {
            listingType,
            region,
            durationDays,
            travelStyle,
            difficulty,
            image: existingImage,
            isPopular,
            status,
        };
        const values = applyPackageFormDefaults(
            localeMapToTourTranslatableValues(commitAllLocales(), shared),
        );
        const nextErrors = validateTourFormValues(values, hasImage);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit({
                values,
                coverImage: imageFile,
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
            <div className="grid gap-5 p-5 xl:grid-cols-[17rem_minmax(0,1fr)] xl:items-start">
                <aside className="space-y-4 xl:sticky xl:top-0">
                    <ImageUploadField
                        id={imageFieldId}
                        required={mode === 'create'}
                        disabled={submitting}
                        previewUrl={imagePreview}
                        hint={mediaProfiles.tour_cover.hint}
                        onChange={(file, preview) => {
                            setImageFile(file);
                            setImagePreview(preview);
                            setExistingImage(preview ? existingImage : '');
                            setErrors((current) => ({ ...current, image: undefined }));
                        }}
                        error={errors.image}
                    />

                    <div className="space-y-3 rounded-xl border border-border/80 bg-surface-muted/20 p-3">
                        <div className="space-y-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                Listing
                            </p>
                            <ListingTypeToggle
                                value={listingType}
                                disabled={submitting || mode === 'edit'}
                                onChange={setListingType}
                            />
                        </div>

                        <AdminFormField id={statusFieldId} label="Publish status" required>
                            <select
                                id={statusFieldId}
                                value={status}
                                disabled={submitting}
                                onChange={(event) =>
                                    setStatus(event.target.value as TourFormValues['status'])
                                }
                                className={adminFieldClass}
                            >
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </select>
                        </AdminFormField>

                        <AdminFormField id={badgeFieldId} label="Badge">
                            <input
                                id={badgeFieldId}
                                value={draft.badge}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => {
                                    setField('badge', event.target.value);
                                }}
                                className={adminFieldClass}
                            />
                        </AdminFormField>

                        {isPackage ? (
                            <label className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-surface px-3 py-2.5 text-sm font-medium text-foreground">
                                <input
                                    id={popularFieldId}
                                    type="checkbox"
                                    checked={isPopular}
                                    disabled={submitting}
                                    onChange={(event) => setIsPopular(event.target.checked)}
                                    className="size-4 rounded border-border text-secondary focus:ring-focus"
                                />
                                Featured package
                            </label>
                        ) : null}
                    </div>
                </aside>

                <div className="min-w-0 space-y-5">
                    <AdminLocaleSelector
                        activeLocale={activeLocale}
                        completion={completion}
                        onChange={switchLocale}
                        disabled={submitting}
                    />

                    <FormGroup title="Identity">
                        <AdminFormField
                            id={titleFieldId}
                            label="Title"
                            required
                            error={errors.title}
                            className={spanTwo}
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
                                aria-invalid={Boolean(errors.title)}
                                aria-describedby={adminFieldDescribedBy(titleFieldId, errors.title)}
                                className={cn(adminFieldClass, errors.title && adminFieldErrorClass)}
                            />
                        </AdminFormField>

                        <AdminFormField
                            id={summaryFieldId}
                            label="Summary"
                            required
                            error={errors.summary}
                            className={spanThree}
                        >
                            <textarea
                                id={summaryFieldId}
                                value={draft.summary}
                                dir={direction}
                                disabled={submitting}
                                rows={2}
                                onChange={(event) => {
                                    setField('summary', event.target.value);
                                    setErrors((current) => ({ ...current, summary: undefined }));
                                }}
                                aria-invalid={Boolean(errors.summary)}
                                aria-describedby={adminFieldDescribedBy(summaryFieldId, errors.summary)}
                                className={cn(
                                    adminFieldClass,
                                    'resize-y',
                                    errors.summary && adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>
                    </FormGroup>

                    <FormDivider />

                    <FormGroup title="Filters & placement">
                        <AdminFormField
                            id={destinationFieldId}
                            label="Primary destination"
                            required
                            error={errors.destination}
                        >
                            <input
                                id={destinationFieldId}
                                value={draft.destination}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => {
                                    setField('destination', event.target.value);
                                    setErrors((current) => ({ ...current, destination: undefined }));
                                }}
                                aria-invalid={Boolean(errors.destination)}
                                aria-describedby={adminFieldDescribedBy(
                                    destinationFieldId,
                                    errors.destination,
                                )}
                                className={cn(
                                    adminFieldClass,
                                    errors.destination && adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>

                        <AdminFormField id={regionFieldId} label="Region" required>
                            <select
                                id={regionFieldId}
                                value={region}
                                disabled={submitting}
                                onChange={(event) =>
                                    setRegion(event.target.value as TourFormValues['region'])
                                }
                                className={adminFieldClass}
                            >
                                {regionOptions.length === 0 ? (
                                    <option value="">Add regions in Filter & Placement</option>
                                ) : null}
                                {regionOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </AdminFormField>

                        <AdminFormField
                            id={durationFieldId}
                            label="Duration (days)"
                            required
                            error={errors.durationDays}
                        >
                            <input
                                id={durationFieldId}
                                type="number"
                                min={isPackage ? 0 : 1}
                                value={durationDays}
                                disabled={submitting}
                                onChange={(event) => {
                                    setDurationDays(Number(event.target.value) || 0);
                                    setErrors((current) => ({ ...current, durationDays: undefined }));
                                }}
                                aria-invalid={Boolean(errors.durationDays)}
                                aria-describedby={adminFieldDescribedBy(
                                    durationFieldId,
                                    errors.durationDays,
                                )}
                                className={cn(
                                    adminFieldClass,
                                    errors.durationDays && adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>

                        {isPackage ? (
                            <AdminFormField
                                id={packagePriceFieldId}
                                label="Price estimate"
                                required
                                error={errors.priceEstimate}
                            >
                                <input
                                    id={packagePriceFieldId}
                                    value={draft.priceEstimate}
                                    dir={direction}
                                    disabled={submitting}
                                    onChange={(event) => {
                                        setField('priceEstimate', event.target.value);
                                        setErrors((current) => ({
                                            ...current,
                                            priceEstimate: undefined,
                                        }));
                                    }}
                                    aria-invalid={Boolean(errors.priceEstimate)}
                                    aria-describedby={adminFieldDescribedBy(
                                        packagePriceFieldId,
                                        errors.priceEstimate,
                                    )}
                                    className={cn(
                                        adminFieldClass,
                                        errors.priceEstimate && adminFieldErrorClass,
                                    )}
                                />
                            </AdminFormField>
                        ) : null}

                        <AdminFormField id={travelStyleFieldId} label="Travel style" required>
                            <select
                                id={travelStyleFieldId}
                                value={travelStyle}
                                disabled={submitting}
                                onChange={(event) =>
                                    setTravelStyle(
                                        event.target.value as TourFormValues['travelStyle'],
                                    )
                                }
                                className={adminFieldClass}
                            >
                                {travelStyleOptions.length === 0 ? (
                                    <option value="">Add travel styles in Filter & Placement</option>
                                ) : null}
                                {travelStyleOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </AdminFormField>

                        <AdminFormField id={difficultyFieldId} label="Difficulty" required>
                            <select
                                id={difficultyFieldId}
                                value={difficulty}
                                disabled={submitting}
                                onChange={(event) =>
                                    setDifficulty(
                                        event.target.value as TourFormValues['difficulty'],
                                    )
                                }
                                className={adminFieldClass}
                            >
                                {difficultyOptions.length === 0 ? (
                                    <option value="">Add difficulties in Filter & Placement</option>
                                ) : null}
                                {difficultyOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </AdminFormField>
                    </FormGroup>

                    <FormDivider />

                    <FormGroup title="Highlights & inclusions" columns={2}>
                        <AdminFormField
                            id={highlightsFieldId}
                            label="Route highlights"
                            required
                            error={errors.highlightsText}
                        >
                            <textarea
                                id={highlightsFieldId}
                                value={draft.highlightsText}
                                dir={direction}
                                disabled={submitting}
                                rows={3}
                                onChange={(event) => {
                                    setField('highlightsText', event.target.value);
                                    setErrors((current) => ({ ...current, highlightsText: undefined }));
                                }}
                                aria-invalid={Boolean(errors.highlightsText)}
                                aria-describedby={adminFieldDescribedBy(
                                    highlightsFieldId,
                                    errors.highlightsText,
                                )}
                                className={cn(
                                    adminFieldClass,
                                    'resize-y',
                                    errors.highlightsText && adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>

                        <AdminFormField
                            id={includedFieldId}
                            label="Included services"
                            required={isPackage}
                            error={errors.includedServicesText}
                        >
                            <textarea
                                id={includedFieldId}
                                value={draft.includedServicesText}
                                dir={direction}
                                disabled={submitting}
                                rows={3}
                                onChange={(event) => {
                                    setField('includedServicesText', event.target.value);
                                    setErrors((current) => ({
                                        ...current,
                                        includedServicesText: undefined,
                                    }));
                                }}
                                aria-invalid={Boolean(errors.includedServicesText)}
                                aria-describedby={adminFieldDescribedBy(
                                    includedFieldId,
                                    errors.includedServicesText,
                                )}
                                className={cn(
                                    adminFieldClass,
                                    'resize-y',
                                    errors.includedServicesText && adminFieldErrorClass,
                                )}
                            />
                        </AdminFormField>
                    </FormGroup>

                    {!isPackage ? (
                        <>
                            <FormDivider />
                            <section className="space-y-3">
                                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                    Detail page
                                </h3>
                                <LazyRichTextEditor
                                    key={activeLocale}
                                    id={contentFieldId}
                                    label="Content"
                                    required
                                    disabled={submitting}
                                    value={draft.content}
                                    dir={direction}
                                    onChange={(content) => {
                                        setField('content', content);
                                        setErrors((current) => ({ ...current, content: undefined }));
                                    }}
                                    placeholder=""
                                    error={errors.content}
                                />
                            </section>
                        </>
                    ) : null}
                </div>
            </div>

            <footer className="flex flex-col-reverse gap-2 border-t border-border bg-surface/95 px-5 py-3 backdrop-blur sm:flex-row sm:justify-end">
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
