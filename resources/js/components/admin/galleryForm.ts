import type { SelectedGalleryImage } from '@/components/admin/MultiImageUploadField';
import type { ManagedGalleryPhoto } from '@/types/gallery';

export type GalleryFormStatus = 'Published' | 'Draft';

export interface GalleryBulkFormValues {
    status: GalleryFormStatus;
}

export interface GalleryEditFormValues {
    alt: string;
    caption: string;
    image: string;
    status: GalleryFormStatus;
    sortOrder: number;
}

export interface GalleryBulkFormSubmitPayload {
    values: GalleryBulkFormValues;
    galleryImages: SelectedGalleryImage[];
}

export interface GalleryEditFormSubmitPayload {
    values: GalleryEditFormValues;
    galleryImage: File | null;
}

export function createEmptyGalleryBulkFormValues(): GalleryBulkFormValues {
    return {
        status: 'Draft',
    };
}

export function createEmptyGalleryEditFormValues(): GalleryEditFormValues {
    return {
        alt: '',
        caption: '',
        image: '',
        status: 'Draft',
        sortOrder: 0,
    };
}

export function galleryPhotoToEditFormValues(photo: ManagedGalleryPhoto): GalleryEditFormValues {
    return {
        alt: photo.alt,
        caption: photo.caption,
        image: photo.src,
        status: photo.status,
        sortOrder: photo.sortOrder,
    };
}

export type GalleryBulkFormField = 'galleryImages';
export type GalleryEditFormField = 'alt' | 'caption' | 'image' | 'sortOrder';

export type GalleryBulkFormErrors = Partial<Record<GalleryBulkFormField, string>>;
export type GalleryEditFormErrors = Partial<Record<GalleryEditFormField, string>>;

const bulkServerFieldMap: Record<string, GalleryBulkFormField> = {
    gallery_images: 'galleryImages',
};

const editServerFieldMap: Record<string, GalleryEditFormField> = {
    alt: 'alt',
    caption: 'caption',
    gallery_image: 'image',
    sort_order: 'sortOrder',
};

export function mapServerGalleryBulkFormErrors(
    errors: Record<string, string | string[] | undefined>,
): GalleryBulkFormErrors {
    const mapped: GalleryBulkFormErrors = {};

    for (const [key, message] of Object.entries(errors)) {
        const field = bulkServerFieldMap[key] ?? (key.startsWith('gallery_images.') ? 'galleryImages' : undefined);

        if (!field || message === undefined || mapped[field]) {
            continue;
        }

        mapped[field] = Array.isArray(message) ? message[0] : message;
    }

    return mapped;
}

export function mapServerGalleryEditFormErrors(
    errors: Record<string, string | string[] | undefined>,
): GalleryEditFormErrors {
    const mapped: GalleryEditFormErrors = {};

    for (const [key, message] of Object.entries(errors)) {
        const field = editServerFieldMap[key];

        if (!field || message === undefined) {
            continue;
        }

        mapped[field] = Array.isArray(message) ? message[0] : message;
    }

    return mapped;
}

export function buildGalleryBulkFormData({
    values,
    galleryImages,
}: GalleryBulkFormSubmitPayload): FormData {
    const formData = new FormData();

    formData.append('status', values.status);

    for (const image of galleryImages) {
        formData.append('gallery_images[]', image.file);
    }

    return formData;
}

export function buildGalleryEditFormData({
    values,
    galleryImage,
}: GalleryEditFormSubmitPayload): FormData {
    const formData = new FormData();

    formData.append('alt', values.alt);
    formData.append('caption', values.caption);
    formData.append('status', values.status);
    formData.append('sort_order', String(values.sortOrder));

    if (galleryImage) {
        formData.append('gallery_image', galleryImage);
    }

    return formData;
}

export function validateGalleryBulkFormValues(
    selectedCount: number,
): GalleryBulkFormErrors {
    const errors: GalleryBulkFormErrors = {};

    if (selectedCount === 0) {
        errors.galleryImages = 'Select at least one image';
    }

    return errors;
}

export function validateGalleryEditFormValues(
    values: GalleryEditFormValues,
    hasImage: boolean,
): GalleryEditFormErrors {
    const errors: GalleryEditFormErrors = {};

    if (!values.alt.trim()) {
        errors.alt = 'Required';
    }

    if (!values.caption.trim()) {
        errors.caption = 'Required';
    }

    if (!hasImage) {
        errors.image = 'Required';
    }

    if (values.sortOrder < 0) {
        errors.sortOrder = 'Must be 0 or greater';
    }

    return errors;
}
