import { usePage } from '@inertiajs/react';
import { type FormEvent, type ReactNode, useEffect, useId, useMemo, useState } from 'react';

import { AdminLocaleSelector } from '@/components/admin/AdminLocaleSelector';
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
import {
    buildInitialLocaleMap,
    localeMapToTranslatedRecord,
    useLocaleFormFields,
} from '@/hooks/use-locale-form-fields';
import { mediaProfiles } from '@/lib/mediaProfiles';
import { cn } from '@/lib/utils';

interface DestinationEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    initialValues?: DestinationFormValues;
    onCancel: () => void;
    onSubmit: (payload: DestinationFormSubmitPayload) => void | Promise<void>;
}

const destinationTranslatableFields = [
    'name',
    'tagline',
    'badge',
    'description',
    'highlightsText',
    'bestSeason',
    'travelStyle',
    'practicalNotesText',
] as const;

const emptyDestinationFields = {
    name: '',
    tagline: '',
    badge: '',
    description: '',
    highlightsText: '',
    bestSeason: '',
    travelStyle: '',
    practicalNotesText: '',
};

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

    const startingValues = initialValues ?? createEmptyDestinationFormValues();
    const initialByLocale = useMemo(
        () =>
            buildInitialLocaleMap(destinationTranslatableFields, {
                name: startingValues.name,
                tagline: startingValues.tagline,
                badge: startingValues.badge,
                description: startingValues.description,
                highlightsText: startingValues.highlightsText,
                bestSeason: startingValues.bestSeason,
                travelStyle: startingValues.travelStyle,
                practicalNotesText: startingValues.practicalNotesText,
            }),
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
        emptyFields: emptyDestinationFields,
    });

    const [region, setRegion] = useState(startingValues.region);
    const [image, setImage] = useState(startingValues.image);
    const [tourMatchKeywordsText, setTourMatchKeywordsText] = useState(
        startingValues.tourMatchKeywordsText,
    );
    const [isFeatured, setIsFeatured] = useState(startingValues.isFeatured);
    const [status, setStatus] = useState(startingValues.status);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(startingValues.image || null);
    const [errors, setErrors] = useState<DestinationFormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const { errors: serverErrors } = usePage().props;

    useEffect(() => {
        const mapped = mapServerDestinationFormErrors(serverErrors);

        if (Object.keys(mapped).length > 0) {
            setErrors((current) => ({ ...current, ...mapped }));
        }
    }, [serverErrors]);

    const hasImage = Boolean(imageFile) || Boolean(image.trim());
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

        const localeValues = commitAllLocales();
        const translated = localeMapToTranslatedRecord(
            destinationTranslatableFields,
            localeValues,
        );
        const payloadValues: DestinationFormValues = {
            name: translated.name,
            tagline: translated.tagline,
            badge: translated.badge,
            description: translated.description,
            highlightsText: translated.highlightsText,
            bestSeason: translated.bestSeason,
            travelStyle: translated.travelStyle,
            practicalNotesText: translated.practicalNotesText,
            region,
            image,
            tourMatchKeywordsText: tourMatchKeywordsText.trim(),
            isFeatured,
            status,
        };

        const nextErrors = validateDestinationFormValues(payloadValues, hasImage);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit({
                values: payloadValues,
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
                            if (!preview) {
                                setImage('');
                            }
                            setErrors((current) => ({ ...current, image: undefined }));
                        }}
                        error={errors.image}
                    />

                    <div className="space-y-3 rounded-xl border border-border/80 bg-surface-muted/20 p-3">
                        <AdminFormField id={statusFieldId} label="Publish status" required>
                            <select
                                id={statusFieldId}
                                value={status}
                                disabled={submitting}
                                onChange={(event) =>
                                    setStatus(event.target.value as DestinationFormValues['status'])
                                }
                                className={adminFieldClass}
                            >
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </select>
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
                            Featured destination
                        </label>
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
                            error={errors.name}
                            className={spanTwo}
                        >
                            <input
                                id={titleFieldId}
                                value={draft.name}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => {
                                    setField('name', event.target.value);
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
                                value={region}
                                disabled={submitting}
                                onChange={(event) =>
                                    setRegion(event.target.value as DestinationFormValues['region'])
                                }
                                className={adminFieldClass}
                            >
                                {destinationRegionOptions.map((option) => (
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
                            className={spanThree}
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

                        <AdminFormField id={badgeFieldId} label="Badge" className={spanThree}>
                            <input
                                id={badgeFieldId}
                                value={draft.badge}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => setField('badge', event.target.value)}
                                placeholder="Signature"
                                className={adminFieldClass}
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
                                value={draft.bestSeason}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => setField('bestSeason', event.target.value)}
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
                                value={draft.travelStyle}
                                dir={direction}
                                disabled={submitting}
                                onChange={(event) => setField('travelStyle', event.target.value)}
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
                                value={draft.highlightsText}
                                dir={direction}
                                disabled={submitting}
                                rows={4}
                                onChange={(event) =>
                                    setField('highlightsText', event.target.value)
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
                                value={draft.practicalNotesText}
                                dir={direction}
                                disabled={submitting}
                                rows={4}
                                onChange={(event) =>
                                    setField('practicalNotesText', event.target.value)
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
                                value={tourMatchKeywordsText}
                                disabled={submitting}
                                rows={3}
                                onChange={(event) => setTourMatchKeywordsText(event.target.value)}
                                placeholder={'Bamiyan\nCentral Highlands\nBand-e Amir'}
                                className={cn(adminFieldClass, 'resize-y')}
                            />
                        </AdminFormField>

                        <div className={spanTwo}>
                            <LazyRichTextEditor
                                key={activeLocale}
                                id={descriptionFieldId}
                                label="Description"
                                required
                                disabled={submitting}
                                dir={direction}
                                value={draft.description}
                                onChange={(description) => {
                                    setField('description', description);
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
