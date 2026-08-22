import { type ComponentType, Suspense, lazy } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import type { RichTextEditorProps } from '@/components/admin/RichTextEditor';

const RichTextEditorLazy = lazy(() =>
    import('@/components/admin/RichTextEditor').then((module) => ({
        default: module.RichTextEditor as ComponentType<RichTextEditorProps>,
    })),
);

function RichTextEditorSkeleton() {
    return (
        <div className="space-y-2" aria-hidden>
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
        </div>
    );
}

export function LazyRichTextEditor(props: RichTextEditorProps) {
    return (
        <Suspense fallback={<RichTextEditorSkeleton />}>
            <RichTextEditorLazy {...props} />
        </Suspense>
    );
}
