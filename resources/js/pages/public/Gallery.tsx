import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { GalleryLanding } from '@/components/sections/gallery/GalleryLanding';
import { PublicLayout } from '@/layouts/PublicLayout';

export default function Gallery() {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta
                title="Gallery"
                description="Explore travel photography from Afghanistan — landscapes, heritage sites and everyday life captured on guided journeys."
            />
            <GalleryLanding />
        </>
    );
}

Gallery.layout = PublicLayout;
