import { Suspense, lazy } from 'react';

import { DeferredMount } from '@/components/loading/DeferredMount';
import { SkeletonCard } from '@/components/ui/skeleton';
import type { Testimonial } from '@/components/sections/home/TestimonialsCarousel';

const CommunityImpactSection = lazy(() =>
    import('@/components/sections/home/CommunityImpactSection').then((module) => ({
        default: module.CommunityImpactSection,
    })),
);

const TestimonialsCarousel = lazy(() =>
    import('@/components/sections/home/TestimonialsCarousel').then((module) => ({
        default: module.TestimonialsCarousel,
    })),
);

function CommunityImpactSkeleton() {
    return (
        <div
            className="mx-auto max-w-7xl animate-pulse px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
            aria-hidden
        >
            <div className="h-4 w-40 rounded bg-surface-muted" />
            <div className="mt-4 h-10 w-2/3 max-w-md rounded bg-surface-muted" />
            <div className="mt-10 grid gap-6 lg:grid-cols-12">
                <div className="min-h-[320px] rounded-2xl bg-surface-muted lg:col-span-5 lg:min-h-[420px]" />
                <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
                    {Array.from({ length: 4 }, (_, index) => (
                        <div key={index} className="min-h-[160px] rounded-2xl bg-surface-muted" />
                    ))}
                </div>
            </div>
        </div>
    );
}

function TestimonialsSkeleton() {
    return (
        <div className="mx-auto max-w-2xl space-y-6 py-4" aria-hidden>
            <SkeletonCard className="border-0 shadow-none" />
            <div className="flex justify-center gap-2">
                {Array.from({ length: 3 }, (_, index) => (
                    <div key={index} className="size-2 rounded-full bg-surface-muted" />
                ))}
            </div>
        </div>
    );
}

export function DeferredCommunityImpactSection() {
    return (
        <DeferredMount fallback={<CommunityImpactSkeleton />} minHeight="32rem">
            <Suspense fallback={<CommunityImpactSkeleton />}>
                <CommunityImpactSection />
            </Suspense>
        </DeferredMount>
    );
}

export function DeferredTestimonialsCarousel({
    items,
}: {
    items: readonly Testimonial[];
}) {
    return (
        <DeferredMount fallback={<TestimonialsSkeleton />} minHeight="20rem">
            <Suspense fallback={<TestimonialsSkeleton />}>
                <TestimonialsCarousel items={items} />
            </Suspense>
        </DeferredMount>
    );
}
