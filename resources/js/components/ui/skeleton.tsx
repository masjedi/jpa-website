import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            aria-hidden
            className={cn('animate-pulse rounded-md bg-surface-muted', className)}
        />
    );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
    return (
        <div className={cn('space-y-2', className)} aria-hidden>
            {Array.from({ length: lines }, (_, index) => (
                <Skeleton
                    key={index}
                    className={cn('h-3', index === lines - 1 ? 'w-4/5' : 'w-full')}
                />
            ))}
        </div>
    );
}

export function SkeletonImage({
    aspectRatio = 'aspect-video',
    className,
}: {
    aspectRatio?: string;
    className?: string;
}) {
    return <Skeleton className={cn('w-full', aspectRatio, className)} />;
}

export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'overflow-hidden rounded-xl border border-border bg-surface',
                className,
            )}
            aria-hidden
        >
            <SkeletonImage aspectRatio="aspect-[4/3]" className="rounded-none" />
            <div className="space-y-3 p-4">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        </div>
    );
}

export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
    return (
        <div className="flex items-center gap-4 border-b border-border px-4 py-3" aria-hidden>
            {Array.from({ length: columns }, (_, index) => (
                <Skeleton
                    key={index}
                    className={cn('h-4', index === 0 ? 'w-32 flex-1' : 'w-20')}
                />
            ))}
        </div>
    );
}

export function SkeletonTable({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
    return (
        <div className="overflow-hidden rounded-xl border border-border bg-surface" aria-hidden>
            <div className="border-b border-border bg-surface-muted/40 px-4 py-3">
                <Skeleton className="h-4 w-40" />
            </div>
            {Array.from({ length: rows }, (_, index) => (
                <SkeletonTableRow key={index} columns={columns} />
            ))}
        </div>
    );
}

export function SkeletonHero({ className }: { className?: string }) {
    return (
        <div className={cn('space-y-4', className)} aria-busy="true" aria-label="Loading content">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-2/3 max-w-lg" />
            <SkeletonText lines={2} className="max-w-xl" />
        </div>
    );
}

export function SkeletonDomeGallery() {
    return (
        <div
            className="relative mx-auto flex size-full min-h-[min(85vh,920px)] w-full max-w-[1400px] items-center justify-center"
            aria-busy="true"
            aria-label="Loading gallery"
        >
            <div className="relative size-[min(70vw,520px)]">
                <Skeleton className="size-full rounded-full opacity-60" />
                <Skeleton className="absolute inset-[18%] rounded-full opacity-40" />
            </div>
        </div>
    );
}
