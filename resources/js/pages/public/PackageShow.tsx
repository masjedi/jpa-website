import { setLayoutProps } from '@inertiajs/react';

import { PageMeta } from '@/components/public/PageMeta';
import { OfferDetailLanding } from '@/components/sections/offers/OfferDetailLanding';
import { OfferNotFound } from '@/components/sections/offers/OfferNotFound';
import { getTravelOfferByPackageSlug } from '@/lib/travelOfferMappers';
import { PublicLayout } from '@/layouts/PublicLayout';

interface PackageShowProps {
    packageSlug: string;
}

export default function PackageShow({ packageSlug }: PackageShowProps) {
    setLayoutProps({ transparentHeader: false });

    const offer = getTravelOfferByPackageSlug(packageSlug);

    if (!offer) {
        return (
            <>
                <PageMeta
                    title="Package not found"
                    description="This package may have moved or is no longer listed."
                    noIndex
                />
                <OfferNotFound
                    title="Package not found"
                    description="This package may have moved or is no longer available."
                    backHref="/tours#packages"
                    backLabel="Back to packages"
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

PackageShow.layout = PublicLayout;
