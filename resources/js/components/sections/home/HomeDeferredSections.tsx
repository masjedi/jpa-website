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
    return <div className="min-h-[28rem] bg-brand-surface" aria-hidden />;
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
        <DeferredMount fallback={<CommunityImpactSkeleton />} minHeight="28rem">
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
