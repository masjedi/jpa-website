import type { ContentRecordStatus, ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import type { ManagedGalleryPhoto } from '@/types/gallery';

interface BuildGalleryViewModelOptions {
    photo: ManagedGalleryPhoto;
    status: ContentRecordStatus;
}

export function buildGalleryViewModel({
    photo,
    status,
}: BuildGalleryViewModelOptions): ContentRecordViewModel {
    return {
        title: photo.caption,
        subtitle: photo.alt,
        imageUrl: photo.src,
        imageAlt: photo.alt,
        badgeLabel: status,
        status,
        cardEyebrow: photo.caption,
        cardCtaLabel: 'View photo',
        metaFields: [
            { id: 'caption', label: 'Caption', value: photo.caption },
            { id: 'alt', label: 'Alt text', value: photo.alt },
            { id: 'sort', label: 'Sort order', value: String(photo.sortOrder) },
            { id: 'status', label: 'Status', value: status },
        ],
    };
}
