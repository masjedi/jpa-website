import { setLayoutProps } from '@inertiajs/react';
import { useCallback } from 'react';

import { AsyncContent } from '@/components/loading/AsyncContent';
import { PageMeta } from '@/components/public/PageMeta';
import { DestinationDetailLanding } from '@/components/sections/destinations/DestinationDetailLanding';
import { DestinationNotFound } from '@/components/sections/destinations/DestinationNotFound';
import { SkeletonHero, SkeletonImage } from '@/components/ui/skeleton';
import { loadDestinationBySlug } from '@/lib/contentLoaders';
import { PublicLayout } from '@/layouts/PublicLayout';

interface DestinationShowProps {
    destinationSlug: string;
}

function DestinationShowSkeleton() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
            <SkeletonHero />
            <SkeletonImage aspectRatio="aspect-[21/9]" className="mt-8 rounded-2xl" />
        </div>
    );
}

export default function DestinationShow({ destinationSlug }: DestinationShowProps) {
    setLayoutProps({ transparentHeader: false });

    const load = useCallback(() => loadDestinationBySlug(destinationSlug), [destinationSlug]);

    return (
        <AsyncContent
            reloadKey={destinationSlug}
            load={load}
            loadingFallback={<DestinationShowSkeleton />}
            notFound={
                <>
                    <PageMeta
                        title="Destination not found"
                        description="This destination may have moved or is no longer listed."
                        noIndex
                    />
                    <DestinationNotFound />
                </>
            }
        >
            {(destination) => (
                <>
                    <PageMeta
                        title={destination.name}
                        description={destination.tagline}
                        image={destination.image}
                    />
                    <DestinationDetailLanding destination={destination} />
                </>
            )}
        </AsyncContent>
    );
}

DestinationShow.layout = PublicLayout;
