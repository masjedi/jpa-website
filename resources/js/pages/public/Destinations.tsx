import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { DestinationsLanding } from '@/components/sections/destinations/DestinationsLanding';
import { PublicLayout } from '@/layouts/PublicLayout';

export default function Destinations() {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta
                title="Destinations"
                description="Explore Afghan destinations — Bamiyan, Kabul, Herat, Mazar-i-Sharif, Wakhan and more — with locally guided travel planning."
            />
            <DestinationsLanding />
        </>
    );
}

Destinations.layout = PublicLayout;
