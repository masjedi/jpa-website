import { usePage } from '@inertiajs/react';
import { type FormEvent, type ReactNode, useEffect, useId, useState } from 'react';

import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createEmptyTourFormValues,
    emptyTourFilterOptions,
    tourListingTypeOptions,
    mapServerTourFormErrors,
    type TourFormErrors,
    type TourFormSubmitPayload,
    type TourFormValues,
    validateTourFormValues,
    withCurrentTourFilterOption,
} from '@/components/admin/tourForm';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { mediaProfiles } from '@/lib/mediaProfiles';
import { LazyRichTextEditor } from '@/components/admin/LazyRichTextEditor';
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
    const taglineFieldId = useId();
    const summaryFieldId = useId();
    const destinationFieldId = useId();
    const durationFieldId = useId();
    const travelStyleFieldId = useId();
    const difficultyFieldId = useId();
    const badgeFieldId = useId();
    const packagePriceFieldId = useId();
    const idealForFieldId = useId();
    const popularFieldId = useId();
    const highlightsFieldId = useId();
    const destinationsFieldId = useId();
    const includedFieldId = useId();
    const imageFieldId = useId();
    const contentFieldId = useId();

    const [values, setValues] = useState<TourFormValues>(
        () => initialValues ?? createEmptyTourFormValues(filterOptions),
    );
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

    const isPackage = values.listingType === 'package';
    const hasImage = Boolean(imageFile) || Boolean((values.image ?? '').trim());
    const regionOptions = withCurrentTourFilterOption(filterOptions.regions, values.region);
    const travelStyleOptions = withCurrentTourFilterOption(
        filterOptions.travelStyles,
        values.travelStyle,
    );
    const difficultyOptions = withCurrentTourFilterOption(
        filterOptions.difficulties,
        values.difficulty,
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

        const nextErrors = validateTourFormValues(values, hasImage);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            const text = (value: string | null | undefined): string => (value ?? '').trim();

            await onSubmit({
                values: {
                    ...values,
                    title: text(values.title),
                    tagline: text(values.tagline),
                    summary: text(values.summary),
                    destination: text(values.destination),
                    badge: text(values.badge),
                    highlightsText: text(values.highlightsText),
                    keyDestinationsText: text(values.keyDestinationsText),
                    includedServicesText: text(values.includedServicesText),
                    priceEstimate: text(values.priceEstimate),
                    idealFor: text(values.idealFor),
                    content: text(values.content),
                    image: text(values.image),
                },
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
                        required
                        disabled={submitting}
                        previewUrl={imagePreview}
                        hint={mediaProfiles.tour_cover.hint}
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

                    <div className="space-y-3 rounded-xl border border-border/80 bg-surface-muted/20 p-3">
                        <div className="space-y-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                Listing
                            </p>
                            <ListingTypeToggle
                                value={values.listingType}
                                disabled={submitting || mode === 'edit'}
                                onChange={(listingType) =>
                                    setValues((current) => ({ ...current, listingType }))
                                }
                            />
                        </div>

                        <AdminFormField id={statusFieldId} label="Publish status" required>
                            <select
                                id={statusFieldId}
                                value={values.status}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        status: event.target.value as TourFormValues['status'],
                                    }))
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
                                value={values.badge}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({ ...current, badge: event.target.value }))
                                }
                                className={adminFieldClass}
                            />
                        </AdminFormField>

                        {isPackage ? (
                            <label className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-surface px-3 py-2.5 text-sm font-medium text-foreground">
                                <input
                                    id={popularFieldId}
                                    type="checkbox"
                                    checked={values.isPopular}
                                    disabled={submitting}
                                    onChange={(event) =>
                                        setValues((current) => ({
                                            ...current,
                                            isPopular: event.target.checked,
                                        }))
                                    }
                                    className="size-4 rounded border-border text-secondary focus:ring-focus"
                                />
                                Featured package
                            </label>
                        ) : null}
                    </div>
                </aside>

                <div className="min-w-0 space-y-5">
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
                                value={values.title}
                                disabled={submitting}
                                onChange={(event) => {
                                    setValues((current) => ({ ...current, title: event.target.value }));
                                    setErrors((current) => ({ ...current, title: undefined }));
                                }}
                                aria-invalid={Boolean(errors.title)}
                                aria-describedby={adminFieldDescribedBy(titleFieldId, errors.title)}
                                className={cn(adminFieldClass, errors.title && adminFieldErrorClass)}
                            />
                        </AdminFormField>

                        {isPackage ? (
                            <AdminFormField
                                id={taglineFieldId}
                                label="Tagline"
                                required
                                error={errors.tagline}
                                className={spanThree}
                            >
                                <input
                                    id={taglineFieldId}
                                    value={values.tagline}
                                    disabled={submitting}
                                    onChange={(event) => {
                                        setValues((current) => ({
                                            ...current,
                                            tagline: event.target.value,
                                        }));
                                        setErrors((current) => ({ ...current, tagline: undefined }));
                                    }}
                                    aria-invalid={Boolean(errors.tagline)}
                                    aria-describedby={adminFieldDescribedBy(
                                        taglineFieldId,
                                        errors.tagline,
                                    )}
                                    className={cn(
                                        adminFieldClass,
                                        errors.tagline && adminFieldErrorClass,
                                    )}
                                />
                            </AdminFormField>
                        ) : null}

                        <AdminFormField
                            id={summaryFieldId}
                            label={isPackage ? 'Description' : 'Summary'}
                            required
                            error={errors.summary}
                            className={spanThree}
                        >
                            <textarea
                                id={summaryFieldId}
                                value={values.summary}
                                disabled={submitting}
                                rows={2}
                                onChange={(event) => {
                                    setValues((current) => ({
                                        ...current,
                                        summary: event.target.value,
                                    }));
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
                                value={values.destination}
                                disabled={submitting}
                                onChange={(event) => {
                                    setValues((current) => ({
                                        ...current,
                                        destination: event.target.value,
                                    }));
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
                                value={values.region}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        region: event.target.value as TourFormValues['region'],
                                    }))
                                }
                                className={adminFieldClass}
                            >
                                {regionOptions.length === 0 ? (
                                    <option value="">Add regions in Filter & Placement</option>
                                ) : null}
                                {regionOptions.map((region) => (
                                    <option key={region} value={region}>
                                        {region}
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
                                value={values.durationDays}
                                disabled={submitting}
                                onChange={(event) => {
                                    setValues((current) => ({
                                        ...current,
                                        durationDays: Number(event.target.value) || 0,
                                    }));
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

                        {!isPackage ? (
                            <>
                                <AdminFormField id={travelStyleFieldId} label="Travel style" required>
                                    <select
                                        id={travelStyleFieldId}
                                        value={values.travelStyle}
                                        disabled={submitting}
                                        onChange={(event) =>
                                            setValues((current) => ({
                                                ...current,
                                                travelStyle: event.target
                                                    .value as TourFormValues['travelStyle'],
                                            }))
                                        }
                                        className={adminFieldClass}
                                            >
                                                {travelStyleOptions.length === 0 ? (
                                                    <option value="">
                                                        Add travel styles in Filter & Placement
                                                    </option>
                                                ) : null}
                                                {travelStyleOptions.map((style) => (
                                                    <option key={style} value={style}>
                                                        {style}
                                                    </option>
                                                ))}
                                            </select>
                                </AdminFormField>

                                <AdminFormField id={difficultyFieldId} label="Difficulty" required>
                                    <select
                                        id={difficultyFieldId}
                                        value={values.difficulty}
                                        disabled={submitting}
                                        onChange={(event) =>
                                            setValues((current) => ({
                                                ...current,
                                                difficulty: event.target
                                                    .value as TourFormValues['difficulty'],
                                            }))
                                        }
                                        className={adminFieldClass}
                                            >
                                                {difficultyOptions.length === 0 ? (
                                                    <option value="">
                                                        Add difficulties in Filter & Placement
                                                    </option>
                                                ) : null}
                                                {difficultyOptions.map((difficulty) => (
                                                    <option key={difficulty} value={difficulty}>
                                                        {difficulty}
                                                    </option>
                                                ))}
                                            </select>
                                </AdminFormField>
                            </>
                        ) : null}
                    </FormGroup>

                    {isPackage ? (
                        <>
                            <FormDivider />

                            <FormGroup title="Pricing & audience" columns={2}>
                                <AdminFormField
                                    id={packagePriceFieldId}
                                    label="Price estimate"
                                    required
                                    error={errors.priceEstimate}
                                >
                                    <input
                                        id={packagePriceFieldId}
                                        value={values.priceEstimate}
                                        disabled={submitting}
                                        onChange={(event) => {
                                            setValues((current) => ({
                                                ...current,
                                                priceEstimate: event.target.value,
                                            }));
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

                                <AdminFormField
                                    id={idealForFieldId}
                                    label="Ideal for"
                                    required
                                    error={errors.idealFor}
                                >
                                    <input
                                        id={idealForFieldId}
                                        value={values.idealFor}
                                        disabled={submitting}
                                        onChange={(event) => {
                                            setValues((current) => ({
                                                ...current,
                                                idealFor: event.target.value,
                                            }));
                                            setErrors((current) => ({
                                                ...current,
                                                idealFor: undefined,
                                            }));
                                        }}
                                        aria-invalid={Boolean(errors.idealFor)}
                                        aria-describedby={adminFieldDescribedBy(
                                            idealForFieldId,
                                            errors.idealFor,
                                        )}
                                        className={cn(
                                            adminFieldClass,
                                            errors.idealFor && adminFieldErrorClass,
                                        )}
                                    />
                                </AdminFormField>
                            </FormGroup>
                        </>
                    ) : null}

                    <FormDivider />

                    <FormGroup
                        title="Highlights & inclusions"
                        columns={isPackage ? 3 : 2}
                    >
                        <AdminFormField
                            id={highlightsFieldId}
                            label={isPackage ? 'Featured perks' : 'Route highlights'}
                            required
                            error={errors.highlightsText}
                        >
                            <textarea
                                id={highlightsFieldId}
                                value={values.highlightsText}
                                disabled={submitting}
                                rows={3}
                                onChange={(event) => {
                                    setValues((current) => ({
                                        ...current,
                                        highlightsText: event.target.value,
                                    }));
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

                        {isPackage ? (
                            <AdminFormField
                                id={destinationsFieldId}
                                label="Key destinations"
                                required
                                error={errors.keyDestinationsText}
                            >
                                <textarea
                                    id={destinationsFieldId}
                                    value={values.keyDestinationsText}
                                    disabled={submitting}
                                    rows={3}
                                    onChange={(event) => {
                                        setValues((current) => ({
                                            ...current,
                                            keyDestinationsText: event.target.value,
                                        }));
                                        setErrors((current) => ({
                                            ...current,
                                            keyDestinationsText: undefined,
                                        }));
                                    }}
                                    aria-invalid={Boolean(errors.keyDestinationsText)}
                                    aria-describedby={adminFieldDescribedBy(
                                        destinationsFieldId,
                                        errors.keyDestinationsText,
                                    )}
                                    className={cn(
                                        adminFieldClass,
                                        'resize-y',
                                        errors.keyDestinationsText && adminFieldErrorClass,
                                    )}
                                />
                            </AdminFormField>
                        ) : null}

                        <AdminFormField
                            id={includedFieldId}
                            label="Included services"
                            required={isPackage}
                            error={errors.includedServicesText}
                        >
                            <textarea
                                id={includedFieldId}
                                value={values.includedServicesText}
                                disabled={submitting}
                                rows={3}
                                onChange={(event) => {
                                    setValues((current) => ({
                                        ...current,
                                        includedServicesText: event.target.value,
                                    }));
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
                                    key={`${contentFieldId}-${initialValues?.content?.length ?? 0}`}
                                    id={contentFieldId}
                                    label="Content"
                                    required
                                    disabled={submitting}
                                    value={values.content}
                                    onChange={(content) => {
                                        setValues((current) => ({ ...current, content }));
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
