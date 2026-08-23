import { Suspense, lazy } from 'react';

import { DeferredMount } from '@/components/loading/DeferredMount';
import { SkeletonCard } from '@/components/ui/skeleton';
import type { Destination } from '@/types/destinations';

const DestinationsGridSection = lazy(() =>
    import('@/components/sections/destinations/DestinationsGridSection').then((module) => ({
        default: module.DestinationsGridSection,
    })),
);

function DestinationsGridSkeleton() {
    return (
        <section className="bg-background py-12 sm:py-16" aria-hidden>
            <div className="mx-auto max-w-6xl animate-pulse px-4 sm:px-6 lg:px-8">
                <div className="h-4 w-24 rounded bg-surface-muted" />
                <div className="mt-3 h-8 w-56 max-w-full rounded bg-surface-muted" />
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <div className="h-11 flex-1 rounded-full bg-surface-muted" />
                    <div className="h-11 w-full rounded-full bg-surface-muted sm:w-48" />
                </div>
                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }, (_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export function DeferredDestinationsGridSection({
    destinations,
}: {
    destinations: readonly Destination[];
}) {
    return (
        <DeferredMount fallback={<DestinationsGridSkeleton />} minHeight="40rem">
            <Suspense fallback={<DestinationsGridSkeleton />}>
                <DestinationsGridSection destinations={destinations} />
            </Suspense>
        </DeferredMount>
    );
}
