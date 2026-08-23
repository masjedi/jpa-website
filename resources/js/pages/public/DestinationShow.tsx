import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { DestinationDetailLanding } from '@/components/sections/destinations/DestinationDetailLanding';
import type {
    Destination,
    DestinationRelatedItem,
    DestinationRelatedTour,
} from '@/types/destinations';
import { PublicLayout } from '@/layouts/PublicLayout';

interface DestinationShowProps {
    destination: Destination;
    relatedTours: DestinationRelatedTour[];
    relatedDestinations: DestinationRelatedItem[];
}

export default function DestinationShow({
    destination,
    relatedTours,
    relatedDestinations,
}: DestinationShowProps) {
    setLayoutProps({ transparentHeader: false });

    return (
        <>
            <PageMeta
                title={destination.name}
                description={destination.tagline}
                image={destination.image}
            />
            <DestinationDetailLanding
                destination={destination}
                relatedTours={relatedTours}
                relatedDestinations={relatedDestinations}
            />
        </>
    );
}

DestinationShow.layout = PublicLayout;
