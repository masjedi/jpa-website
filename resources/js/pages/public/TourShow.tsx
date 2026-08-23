import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { OfferDetailLanding } from '@/components/sections/offers/OfferDetailLanding';
import type { TravelOfferDetail } from '@/types/travelOffer';
import { PublicLayout } from '@/layouts/PublicLayout';

interface TourShowProps {
    offer: TravelOfferDetail;
}

export default function TourShow({ offer }: TourShowProps) {
    setLayoutProps({ transparentHeader: false });

    return (
        <>
            <PageMeta title={offer.title} description={offer.tagline} image={offer.image} />
            <OfferDetailLanding offer={offer} />
        </>
    );
}

TourShow.layout = PublicLayout;
