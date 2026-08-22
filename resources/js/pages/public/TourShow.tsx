import { setLayoutProps } from '@inertiajs/react';
import { useCallback } from 'react';

import { AsyncContent } from '@/components/loading/AsyncContent';
import { PageMeta } from '@/components/public/PageMeta';
import { OfferDetailLanding } from '@/components/sections/offers/OfferDetailLanding';
import { OfferNotFound } from '@/components/sections/offers/OfferNotFound';
import { SkeletonHero, SkeletonImage } from '@/components/ui/skeleton';
import { loadTourOfferBySlug } from '@/lib/contentLoaders';
import { PublicLayout } from '@/layouts/PublicLayout';

interface TourShowProps {
    tourSlug: string;
}

function TourShowSkeleton() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
            <SkeletonHero />
            <SkeletonImage aspectRatio="aspect-[21/9]" className="mt-8 rounded-2xl" />
        </div>
    );
}

export default function TourShow({ tourSlug }: TourShowProps) {
    setLayoutProps({ transparentHeader: false });

    const load = useCallback(() => loadTourOfferBySlug(tourSlug), [tourSlug]);

    return (
        <AsyncContent
            reloadKey={tourSlug}
            load={load}
            loadingFallback={<TourShowSkeleton />}
            notFound={
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
            }
        >
            {(offer) => (
                <>
                    <PageMeta title={offer.title} description={offer.tagline} image={offer.image} />
                    <OfferDetailLanding offer={offer} />
                </>
            )}
        </AsyncContent>
    );
}

TourShow.layout = PublicLayout;
