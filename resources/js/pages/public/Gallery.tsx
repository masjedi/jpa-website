import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { GalleryLanding } from '@/components/sections/gallery/GalleryLanding';
import type { GalleryPhoto } from '@/types/gallery';
import { PublicLayout } from '@/layouts/PublicLayout';

interface GalleryPageProps {
    photos?: readonly GalleryPhoto[];
}

export default function Gallery({ photos = [] }: GalleryPageProps) {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta />
            <GalleryLanding photos={photos} />
        </>
    );
}

Gallery.layout = PublicLayout;
