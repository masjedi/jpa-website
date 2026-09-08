import { Suspense, lazy } from 'react';

import { DeferredMount } from '@/components/loading/DeferredMount';
import type { PublicTestimonial } from '@/types/testimonials';

const TestimonialsCarousel = lazy(() =>
    import('@/components/sections/home/TestimonialsCarousel').then((module) => ({
        default: module.TestimonialsCarousel,
    })),
);

function TestimonialsSkeleton() {
    return (
        <div className="mx-auto max-w-xl space-y-6 py-4" aria-hidden>
            <div className="mx-auto size-28 rounded-full border-4 border-accent/30 bg-surface-muted sm:size-32" />
            <div className="mx-auto h-20 max-w-md rounded-2xl bg-surface-muted" />
            <div className="flex justify-center gap-2">
                {Array.from({ length: 3 }, (_, index) => (
                    <div key={index} className="size-2 rounded-full bg-surface-muted" />
                ))}
            </div>
        </div>
    );
}

export function DeferredTestimonialsCarousel({
    items,
}: {
    items: readonly PublicTestimonial[];
}) {
    return (
        <DeferredMount fallback={<TestimonialsSkeleton />} minHeight="20rem">
            <Suspense fallback={<TestimonialsSkeleton />}>
                <TestimonialsCarousel items={items} />
            </Suspense>
        </DeferredMount>
    );
}
