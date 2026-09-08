import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { OfferDetailLanding } from '@/components/sections/offers/OfferDetailLanding';
import type { TravelOfferDetail } from '@/types/travelOffer';
import { PublicLayout } from '@/layouts/PublicLayout';

interface PackageShowProps {
    offer: TravelOfferDetail;
}

export default function PackageShow({ offer }: PackageShowProps) {
    setLayoutProps({ transparentHeader: false });

    return (
        <>
            <PageMeta />
            <OfferDetailLanding offer={offer} />
        </>
    );
}

PackageShow.layout = PublicLayout;
