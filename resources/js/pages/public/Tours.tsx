import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { ToursLanding } from '@/components/sections/tours/ToursLanding';
import { PublicLayout } from '@/layouts/PublicLayout';
import type { TourFilterFieldOptions } from '@/types/tourFilterOptions';
import type { Tour, TourPackage } from '@/types/tours';

interface ToursPageProps {
    tours: Tour[];
    packages: TourPackage[];
    filterOptions: TourFilterFieldOptions;
}

export default function Tours({ tours, packages, filterOptions }: ToursPageProps) {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta
                title="Tours and Packages"
                description="Explore curated Afghan tour packages, small group departures and tailored itineraries across Bamiyan, Herat, Kabul, Wakhan and Mazar-i-Sharif. Inquiry only — no instant booking."
            />
            <ToursLanding tours={tours} packages={packages} filterOptions={filterOptions} />
        </>
    );
}

Tours.layout = PublicLayout;
