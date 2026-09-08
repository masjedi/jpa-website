import { usePage } from '@inertiajs/react';
import { type FormEvent, useEffect, useId, useMemo, useState } from 'react';

import { AdminLocaleSelector } from '@/components/admin/AdminLocaleSelector';
import { AdminFormField, adminFieldDescribedBy } from '@/components/admin/AdminFormField';
import { adminFieldClass, adminFieldErrorClass } from '@/components/admin/adminForm';
import {
    createEmptyGalleryBulkFormValues,
    createEmptyGalleryEditFormValues,
    mapServerGalleryBulkFormErrors,
    mapServerGalleryEditFormErrors,
    type GalleryBulkFormErrors,
    type GalleryBulkFormSubmitPayload,
    type GalleryBulkFormValues,
    type GalleryEditFormErrors,
    type GalleryEditFormSubmitPayload,
    type GalleryEditFormValues,
    validateGalleryBulkFormValues,
    validateGalleryEditFormValues,
} from '@/components/admin/galleryForm';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import {
    MultiImageUploadField,
    type SelectedGalleryImage,
} from '@/components/admin/MultiImageUploadField';
import {
    buildInitialLocaleMap,
    localeMapToTranslatedRecord,
    useLocaleFormFields,
} from '@/hooks/use-locale-form-fields';
import { mediaProfiles } from '@/lib/mediaProfiles';
import { cn } from '@/lib/utils';

interface GalleryEntityFormProps {
    formId: string;
    mode: 'create' | 'edit';
    initialEditValues?: GalleryEditFormValues;
    onCancel: () => void;
    onSubmitBulk: (payload: GalleryBulkFormSubmitPayload) => void | Promise<void>;
    onSubmitEdit: (payload: GalleryEditFormSubmitPayload) => void | Promise<void>;
}

const galleryEditTranslatableFields = ['alt', 'caption'] as const;

const emptyGalleryEditFields = {
    alt: '',
    caption: '',
};

export function GalleryEntityForm({
    formId,
    mode,
    initialEditValues,
    onCancel,
    onSubmitBulk,
    onSubmitEdit,
}: GalleryEntityFormProps) {
    const statusFieldId = useId();
    const altFieldId = useId();
    const captionFieldId = useId();
    const imageFieldId = useId();
    const sortOrderFieldId = useId();
    const multiImageFieldId = useId();

    const startingEditValues = initialEditValues ?? createEmptyGalleryEditFormValues();
    const initialByLocale = useMemo(
        () =>
            buildInitialLocaleMap(galleryEditTranslatableFields, {
                alt: startingEditValues.alt,
                caption: startingEditValues.caption,
            }),
        [startingEditValues.alt, startingEditValues.caption],
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
        emptyFields: emptyGalleryEditFields,
    });

    const [bulkValues, setBulkValues] = useState<GalleryBulkFormValues>(
        createEmptyGalleryBulkFormValues,
    );
    const [editStatus, setEditStatus] = useState(startingEditValues.status);
    const [editImage, setEditImage] = useState(startingEditValues.image);
    const [editSortOrder, setEditSortOrder] = useState(startingEditValues.sortOrder);
    const [selectedImages, setSelectedImages] = useState<SelectedGalleryImage[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        () => initialEditValues?.image || null,
    );
    const [bulkErrors, setBulkErrors] = useState<GalleryBulkFormErrors>({});
    const [editErrors, setEditErrors] = useState<GalleryEditFormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const { errors: serverErrors } = usePage().props;

    useEffect(() => {
        const mappedBulk = mapServerGalleryBulkFormErrors(serverErrors);
        const mappedEdit = mapServerGalleryEditFormErrors(serverErrors);

        if (Object.keys(mappedBulk).length > 0) {
            setBulkErrors((current) => ({ ...current, ...mappedBulk }));
        }

        if (Object.keys(mappedEdit).length > 0) {
            setEditErrors((current) => ({ ...current, ...mappedEdit }));
        }
    }, [serverErrors]);

    const hasEditImage = Boolean(imageFile) || Boolean(editImage.trim());
    const submitLabel =
        mode === 'edit'
            ? submitting
                ? 'Saving…'
                : 'Save changes'
            : submitting
              ? 'Uploading…'
              : `Upload ${selectedImages.length || ''} photo${selectedImages.length === 1 ? '' : 's'}`.trim();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            if (mode === 'create') {
                const nextErrors = validateGalleryBulkFormValues(selectedImages.length);
                setBulkErrors(nextErrors);

                if (Object.keys(nextErrors).length > 0) {
                    return;
                }

                await onSubmitBulk({
                    values: bulkValues,
                    galleryImages: selectedImages,
                });

                return;
            }

            const localeValues = commitAllLocales();
            const translated = localeMapToTranslatedRecord(
                galleryEditTranslatableFields,
                localeValues,
            );
            const editValues: GalleryEditFormValues = {
                alt: translated.alt,
                caption: translated.caption,
                image: editImage.trim(),
                status: editStatus,
                sortOrder: editSortOrder,
            };

            const nextErrors = validateGalleryEditFormValues(editValues, hasEditImage);
            setEditErrors(nextErrors);

            if (Object.keys(nextErrors).length > 0) {
                return;
            }

            await onSubmitEdit({
                values: editValues,
                galleryImage: imageFile,
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
                    {mode === 'create' ? (
                        <MultiImageUploadField
                            id={multiImageFieldId}
                            required
                            disabled={submitting}
                            selectedImages={selectedImages}
                            onChange={(images) => {
                                setSelectedImages(images);
                                setBulkErrors((current) => ({
                                    ...current,
                                    galleryImages: undefined,
                                }));
                            }}
                            hint={mediaProfiles.gallery_image.hint}
                            error={bulkErrors.galleryImages}
                        />
                    ) : (
                        <ImageUploadField
                            id={imageFieldId}
                            label="Image"
                            required
                            disabled={submitting}
                            previewUrl={imagePreview}
                            hint={mediaProfiles.gallery_image.hint}
                            onChange={(file, preview) => {
                                setImageFile(file);
                                setImagePreview(preview);
                                if (!preview) {
                                    setEditImage('');
                                }
                                setEditErrors((current) => ({ ...current, image: undefined }));
                            }}
                            error={editErrors.image}
                        />
                    )}

                    <div className="rounded-xl border border-border/80 bg-surface-muted/20 p-3">
                        <AdminFormField id={statusFieldId} label="Publish status" required>
                            <select
                                id={statusFieldId}
                                value={mode === 'create' ? bulkValues.status : editStatus}
                                disabled={submitting}
                                onChange={(event) => {
                                    const status = event.target.value as GalleryBulkFormValues['status'];

                                    if (mode === 'create') {
                                        setBulkValues((current) => ({ ...current, status }));
                                    } else {
                                        setEditStatus(status);
                                    }
                                }}
                                className={adminFieldClass}
                            >
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </select>
                        </AdminFormField>
                    </div>
                </aside>

                <div className="min-w-0 space-y-5">
                    {mode === 'create' ? (
                        <div className="rounded-xl border border-border/80 bg-surface-muted/20 p-4 text-sm leading-relaxed text-muted-foreground">
                            <p className="font-medium text-foreground">Bulk upload</p>
                            <p className="mt-2">
                                Select multiple images at once. Alt text and captions are
                                generated from each filename — edit individual photos after
                                upload to refine details and sort order.
                            </p>
                        </div>
                    ) : (
                        <>
                            <AdminLocaleSelector
                                activeLocale={activeLocale}
                                completion={completion}
                                onChange={switchLocale}
                                disabled={submitting}
                            />

                            <div className="grid gap-3 sm:grid-cols-2">
                                <AdminFormField
                                    id={captionFieldId}
                                    label="Caption"
                                    required
                                    error={editErrors.caption}
                                >
                                    <input
                                        id={captionFieldId}
                                        value={draft.caption}
                                        dir={direction}
                                        disabled={submitting}
                                        onChange={(event) => {
                                            setField('caption', event.target.value);
                                            setEditErrors((current) => ({
                                                ...current,
                                                caption: undefined,
                                            }));
                                        }}
                                        placeholder="Band-e Amir, Bamiyan"
                                        aria-invalid={Boolean(editErrors.caption)}
                                        aria-describedby={adminFieldDescribedBy(
                                            captionFieldId,
                                            editErrors.caption,
                                        )}
                                        className={cn(
                                            adminFieldClass,
                                            editErrors.caption && adminFieldErrorClass,
                                        )}
                                    />
                                </AdminFormField>

                                <AdminFormField
                                    id={altFieldId}
                                    label="Alt text"
                                    required
                                    error={editErrors.alt}
                                >
                                    <input
                                        id={altFieldId}
                                        value={draft.alt}
                                        dir={direction}
                                        disabled={submitting}
                                        onChange={(event) => {
                                            setField('alt', event.target.value);
                                            setEditErrors((current) => ({
                                                ...current,
                                                alt: undefined,
                                            }));
                                        }}
                                        placeholder="Band-e Amir lakes at sunset, Bamiyan"
                                        aria-invalid={Boolean(editErrors.alt)}
                                        aria-describedby={adminFieldDescribedBy(
                                            altFieldId,
                                            editErrors.alt,
                                        )}
                                        className={cn(
                                            adminFieldClass,
                                            editErrors.alt && adminFieldErrorClass,
                                        )}
                                    />
                                </AdminFormField>

                                <AdminFormField
                                    id={sortOrderFieldId}
                                    label="Sort order"
                                    error={editErrors.sortOrder}
                                    className="sm:col-span-2"
                                >
                                    <input
                                        id={sortOrderFieldId}
                                        type="number"
                                        min={0}
                                        value={editSortOrder}
                                        disabled={submitting}
                                        onChange={(event) => {
                                            setEditSortOrder(Number(event.target.value));
                                            setEditErrors((current) => ({
                                                ...current,
                                                sortOrder: undefined,
                                            }));
                                        }}
                                        className={cn(
                                            adminFieldClass,
                                            editErrors.sortOrder && adminFieldErrorClass,
                                        )}
                                    />
                                </AdminFormField>
                            </div>
                        </>
                    )}
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
                    disabled={submitting || (mode === 'create' && selectedImages.length === 0)}
                    className="inline-flex items-center justify-center rounded-lg bg-accent px-3.5 py-1.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitLabel}
                </button>
            </footer>
        </form>
    );
}
