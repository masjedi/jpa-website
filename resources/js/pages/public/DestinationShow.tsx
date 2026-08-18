import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { DestinationDetailLanding } from '@/components/sections/destinations/DestinationDetailLanding';
import { DestinationNotFound } from '@/components/sections/destinations/DestinationNotFound';
import { getDestinationBySlug } from '@/data/destinationsData';
import { PublicLayout } from '@/layouts/PublicLayout';

interface DestinationShowProps {
    destinationSlug: string;
}

export default function DestinationShow({ destinationSlug }: DestinationShowProps) {
    setLayoutProps({ transparentHeader: false });

    const destination = getDestinationBySlug(destinationSlug);

    if (!destination) {
        return (
            <>
                <PageMeta
                    title="Destination not found"
                    description="This destination may have moved or is no longer listed."
                    noIndex
                />
                <DestinationNotFound />
            </>
        );
    }

    return (
        <>
            <PageMeta
                title={destination.name}
                description={destination.tagline}
                image={destination.image}
            />
            <DestinationDetailLanding destination={destination} />
        </>
    );
}

DestinationShow.layout = PublicLayout;
