import { type ComponentType, Suspense, lazy } from 'react';

import { SkeletonDomeGallery } from '@/components/ui/skeleton';
import type { DomeGalleryProps } from '@/components/react-bits/DomeGallery/DomeGallery';

const DomeGallery = lazy(() =>
    import('@/components/react-bits/DomeGallery/DomeGallery').then((module) => ({
        default: module.DomeGallery as ComponentType<DomeGalleryProps>,
    })),
);

export function LazyDomeGallery(props: DomeGalleryProps) {
    return (
        <div className="relative mx-auto h-[min(70vh,920px)] w-full max-w-[1400px] sm:h-[min(85vh,920px)]">
            <Suspense fallback={<SkeletonDomeGallery />}>
                <div className="size-full">
                    <DomeGallery {...props} />
                </div>
            </Suspense>
        </div>
    );
}
