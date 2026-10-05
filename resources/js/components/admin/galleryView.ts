import type { ContentRecordStatus, ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import { primaryTranslation } from '@/lib/translations';
import type { ManagedGalleryPhoto } from '@/types/gallery';

interface BuildGalleryViewModelOptions {
    photo: ManagedGalleryPhoto;
    status: ContentRecordStatus;
}

export function buildGalleryViewModel({
    photo,
    status,
}: BuildGalleryViewModelOptions): ContentRecordViewModel {
    const caption = primaryTranslation(photo.caption);
    const alt = primaryTranslation(photo.alt);

    return {
        title: caption,
        subtitle: alt,
        imageUrl: photo.src,
        imageAlt: alt,
        badgeLabel: status,
        status,
        cardEyebrow: caption,
        cardCtaLabel: 'View photo',
        metaFields: [
            { id: 'caption', label: 'Caption', value: caption },
            { id: 'alt', label: 'Alt text', value: alt },
            { id: 'sort', label: 'Sort order', value: String(photo.sortOrder) },
            { id: 'status', label: 'Status', value: status },
        ],
    };
}
