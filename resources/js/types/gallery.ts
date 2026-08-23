export interface GalleryPhoto {
    id: string;
    src: string;
    alt: string;
    caption: string;
}

export interface ManagedGalleryPhoto {
    id: number;
    status: 'Published' | 'Draft';
    src: string;
    thumbSrc: string;
    alt: string;
    caption: string;
    sortOrder: number;
}
