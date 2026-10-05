import { WhenVisible } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { SkeletonCard } from '@/components/ui/skeleton';

interface HomeDeferredSectionProps {
    data: 'featuredTours' | 'featuredDestinations' | 'galleryPreview' | 'latestArticles' | 'faqItems';
    columns?: 1 | 3 | 4 | 6;
    children: ReactNode;
}

function HomeSectionSkeleton({ columns = 3 }: { columns?: 1 | 3 | 4 | 6 }) {
    if (columns === 1) {
        return (
            <div className="space-y-3" aria-busy="true" aria-label="Loading section content">
                {Array.from({ length: 3 }, (_, index) => (
                    <div
                        key={index}
                        className="h-16 animate-pulse rounded-2xl border border-border bg-surface-muted"
                    />
                ))}
            </div>
        );
    }

    const gridClassName =
        columns === 4
            ? 'mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'
            : columns === 6
              ? 'mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6'
              : 'mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3';

    return (
        <div className={gridClassName} aria-busy="true" aria-label="Loading section content">
            {Array.from({ length: columns }, (_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
}

export function HomeDeferredSection({
    data,
    columns = 3,
    children,
}: HomeDeferredSectionProps) {
    return (
        <WhenVisible data={data} buffer={240} fallback={<HomeSectionSkeleton columns={columns} />}>
            {children}
        </WhenVisible>
    );
}
