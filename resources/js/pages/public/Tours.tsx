import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { ToursLanding } from '@/components/sections/tours/ToursLanding';
import { PublicLayout } from '@/layouts/PublicLayout';

export default function Tours() {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta
                title="Tours and Packages"
                description="Explore curated Afghan tour packages, small group departures and tailored itineraries across Bamiyan, Herat, Kabul, Wakhan and Mazar-i-Sharif. Inquiry only — no instant booking."
            />
            <ToursLanding />
        </>
    );
}

Tours.layout = PublicLayout;
