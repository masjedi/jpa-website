import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { OfferDetailLanding } from '@/components/sections/offers/OfferDetailLanding';
import { OfferNotFound } from '@/components/sections/offers/OfferNotFound';
import { getTravelOfferByTourSlug } from '@/lib/travelOfferMappers';
import { PublicLayout } from '@/layouts/PublicLayout';

interface TourShowProps {
    tourSlug: string;
}

export default function TourShow({ tourSlug }: TourShowProps) {
    setLayoutProps({ transparentHeader: false });

    const offer = getTravelOfferByTourSlug(tourSlug);

    if (!offer) {
        return (
            <>
                <PageMeta
                    title="Tour not found"
                    description="This tour may have moved or is no longer listed."
                    noIndex
                />
                <OfferNotFound
                    title="Tour not found"
                    description="This tour may have moved or is no longer available."
                    backHref="/tours#tour-catalog"
                    backLabel="Back to tours"
                />
            </>
        );
    }

    return (
        <>
            <PageMeta title={offer.title} description={offer.tagline} image={offer.image} />
            <OfferDetailLanding offer={offer} />
        </>
    );
}

TourShow.layout = PublicLayout;
