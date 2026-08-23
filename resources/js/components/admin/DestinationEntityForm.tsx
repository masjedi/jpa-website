import { usePage } from '@inertiajs/react';
import { type FormEvent, type ReactNode, useEffect, useId, useState } from 'react';

import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createEmptyDestinationFormValues,
    destinationRegionOptions,
    mapServerDestinationFormErrors,
    type DestinationFormErrors,
    type DestinationFormSubmitPayload,
    type DestinationFormValues,
    validateDestinationFormValues,
} from '@/components/admin/destinationForm';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { LazyRichTextEditor } from '@/components/admin/LazyRichTextEditor';
import { mediaProfiles } from '@/lib/mediaProfiles';
import { cn } from '@/lib/utils';

interface DestinationEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    initialValues?: DestinationFormValues;
    onCancel: () => void;
    onSubmit: (payload: DestinationFormSubmitPayload) => void | Promise<void>;
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

const spanTwo = 'sm:col-span-2';
const spanThree = 'sm:col-span-2 xl:col-span-3';

export function DestinationEntityForm({
    formId,
    mode,
    initialValues,
    onCancel,
    onSubmit,
}: DestinationEntityFormProps) {
    const statusFieldId = useId();
    const regionFieldId = useId();
    const titleFieldId = useId();
    const taglineFieldId = useId();
    const badgeFieldId = useId();
    const featuredFieldId = useId();
    const imageFieldId = useId();
    const descriptionFieldId = useId();
    const highlightsFieldId = useId();
    const seasonFieldId = useId();
    const styleFieldId = useId();
    const notesFieldId = useId();
    const keywordsFieldId = useId();

    const [values, setValues] = useState<DestinationFormValues>(
        () => initialValues ?? createEmptyDestinationFormValues(),
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        () => initialValues?.image || null,
    );
    const [errors, setErrors] = useState<DestinationFormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const { errors: serverErrors } = usePage().props;

    useEffect(() => {
        const mapped = mapServerDestinationFormErrors(serverErrors);

        if (Object.keys(mapped).length > 0) {
            setErrors((current) => ({ ...current, ...mapped }));
        }
    }, [serverErrors]);

    const hasImage = Boolean(imageFile) || Boolean((values.image ?? '').trim());
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
            const text = (value: string | null | undefined): string => (value ?? '').trim();

            await onSubmit({
                values: {
                    ...values,
                    name: text(values.name),
                    tagline: text(values.tagline),
                    badge: text(values.badge),
                    image: text(values.image),
                    description: text(values.description),
                    highlightsText: text(values.highlightsText),
                    bestSeason: text(values.bestSeason),
                    travelStyle: text(values.travelStyle),
                    practicalNotesText: text(values.practicalNotesText),
                    tourMatchKeywordsText: text(values.tourMatchKeywordsText),
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
                        hint={mediaProfiles.destination_cover.hint}
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
                        <AdminFormField id={statusFieldId} label="Publish status" required>
                            <select
                                id={statusFieldId}
                                value={values.status}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        status: event.target.value as DestinationFormValues['status'],
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
                                    setValues((current) => ({
                                        ...current,
                                        badge: event.target.value,
                                    }))
                                }
                                placeholder="Signature"
                                className={adminFieldClass}
                            />
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
                            Featured destination
                        </label>
                    </div>
                </aside>

                <div className="min-w-0 space-y-5">
                    <FormGroup title="Identity">
                        <AdminFormField
                            id={titleFieldId}
                            label="Title"
                            required
                            error={errors.name}
                            className={spanTwo}
                        >
                            <input
                                id={titleFieldId}
                                value={values.name}
                                disabled={submitting}
                                onChange={(event) => {
                                    setValues((current) => ({
                                        ...current,
                                        name: event.target.value,
                                    }));
                                    setErrors((current) => ({ ...current, name: undefined }));
                                }}
                                placeholder="Bamiyan Valley"
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={adminFieldDescribedBy(titleFieldId, errors.name)}
                                className={cn(adminFieldClass, errors.name && adminFieldErrorClass)}
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
                                        region: event.target
                                            .value as DestinationFormValues['region'],
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
                                placeholder="Alpine lakes, cliff monasteries, and highland silence."
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
                    </FormGroup>

                    <FormDivider />

                    <FormGroup title="Travel details" columns={2}>
                        <AdminFormField
                            id={seasonFieldId}
                            label="Best season"
                            error={errors.bestSeason}
                        >
                            <input
                                id={seasonFieldId}
                                value={values.bestSeason}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        bestSeason: event.target.value,
                                    }))
                                }
                                placeholder="May – October"
                                className={adminFieldClass}
                            />
                        </AdminFormField>

                        <AdminFormField
                            id={styleFieldId}
                            label="Travel style"
                            error={errors.travelStyle}
                        >
                            <input
                                id={styleFieldId}
                                value={values.travelStyle}
                                disabled={submitting}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        travelStyle: event.target.value,
                                    }))
                                }
                                placeholder="Cultural & nature"
                                className={adminFieldClass}
                            />
                        </AdminFormField>
                    </FormGroup>

                    <FormDivider />

                    <FormGroup title="Content" columns={2}>
                        <AdminFormField
                            id={highlightsFieldId}
                            label="Highlights"
                            className={spanTwo}
                        >
                            <textarea
                                id={highlightsFieldId}
                                value={values.highlightsText}
                                disabled={submitting}
                                rows={4}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        highlightsText: event.target.value,
                                    }))
                                }
                                placeholder={'Buddha cliff niches\nBand-e Amir lakes'}
                                className={cn(adminFieldClass, 'resize-y')}
                            />
                        </AdminFormField>

                        <AdminFormField
                            id={notesFieldId}
                            label="Practical notes"
                            className={spanTwo}
                        >
                            <textarea
                                id={notesFieldId}
                                value={values.practicalNotesText}
                                disabled={submitting}
                                rows={4}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        practicalNotesText: event.target.value,
                                    }))
                                }
                                placeholder={'Highland roads from Kabul\nModerate walking'}
                                className={cn(adminFieldClass, 'resize-y')}
                            />
                        </AdminFormField>

                        <AdminFormField
                            id={keywordsFieldId}
                            label="Tour match keywords"
                            className={spanTwo}
                        >
                            <textarea
                                id={keywordsFieldId}
                                value={values.tourMatchKeywordsText}
                                disabled={submitting}
                                rows={3}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        tourMatchKeywordsText: event.target.value,
                                    }))
                                }
                                placeholder={'Bamiyan\nCentral Highlands\nBand-e Amir'}
                                className={cn(adminFieldClass, 'resize-y')}
                            />
                        </AdminFormField>

                        <div className={spanTwo}>
                            <LazyRichTextEditor
                                id={descriptionFieldId}
                                label="Description"
                                required
                                disabled={submitting}
                                value={values.description}
                                onChange={(description) => {
                                    setValues((current) => ({ ...current, description }));
                                    setErrors((current) => ({
                                        ...current,
                                        description: undefined,
                                    }));
                                }}
                                placeholder="Write the destination story for the detail page."
                                error={errors.description}
                            />
                        </div>
                    </FormGroup>
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
