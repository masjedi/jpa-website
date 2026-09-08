import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import {
    type DestinationFilterOption,
} from '@/components/sections/tours/discovery/discoveryQuery';
import { ToursDiscoveryLanding } from '@/components/sections/tours/discovery/ToursDiscoveryLanding';
import { PublicLayout } from '@/layouts/PublicLayout';
import type { Destination } from '@/types/destinations';
import type { TourFilterFieldOptions } from '@/types/tourFilterOptions';
import type { Tour, TourPackage } from '@/types/tours';

interface ToursPageProps {
    view?: 'tours' | 'packages' | 'destinations';
    tours?: Tour[];
    packages?: TourPackage[];
    destinations?: Destination[];
    filterOptions?: TourFilterFieldOptions;
    destinationFilters?: DestinationFilterOption[];
    heroImage?: string | null;
}

export default function Tours({
    view = 'tours',
    tours = [],
    packages = [],
    destinations = [],
    filterOptions = { regions: [], travelStyles: [], difficulties: [] },
    destinationFilters = [],
    heroImage = null,
}: ToursPageProps) {
    setLayoutProps({ transparentHeader: true });

    return (
        <>
            <PageMeta />
            <ToursDiscoveryLanding
                view={view}
                tours={tours}
                packages={packages}
                destinations={destinations}
                filterOptions={filterOptions}
                destinationFilters={destinationFilters}
                heroImage={heroImage}
            />
        </>
    );
}

Tours.layout = PublicLayout;
