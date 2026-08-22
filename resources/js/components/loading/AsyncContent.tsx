import { type ReactNode, useEffect, useState } from 'react';

import { SkeletonHero } from '@/components/ui/skeleton';

type AsyncState<T> =
    | { status: 'loading' }
    | { status: 'ready'; data: T }
    | { status: 'not-found' }
    | { status: 'error' };

interface AsyncContentProps<T> {
    load: () => Promise<T | null | undefined>;
    reloadKey?: string;
    loadingFallback?: ReactNode;
    notFound: ReactNode;
    errorFallback?: ReactNode;
    children: (data: T) => ReactNode;
}

export function AsyncContent<T>({
    load,
    reloadKey,
    loadingFallback,
    notFound,
    errorFallback,
    children,
}: AsyncContentProps<T>) {
    const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });

    useEffect(() => {
        let cancelled = false;

        setState({ status: 'loading' });

        load()
            .then((data) => {
                if (cancelled) {
                    return;
                }

                if (data == null) {
                    setState({ status: 'not-found' });
                    return;
                }

                setState({ status: 'ready', data });
            })
            .catch(() => {
                if (!cancelled) {
                    setState({ status: 'error' });
                }
            });

        return () => {
            cancelled = true;
        };
        // reloadKey drives refetch; load is tied to the current slug via parent useCallback
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadKey]);

    if (state.status === 'loading') {
        return <>{loadingFallback ?? <SkeletonHero className="mx-auto max-w-3xl px-4 py-16" />}</>;
    }

    if (state.status === 'not-found') {
        return notFound;
    }

    if (state.status === 'error') {
        return (
            errorFallback ?? (
                <div className="mx-auto max-w-lg px-4 py-16 text-center">
                    <p className="text-sm text-muted-foreground">
                        Something went wrong while loading this page.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-4 inline-flex rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"
                    >
                        Try again
                    </button>
                </div>
            )
        );
    }

    return children(state.data);
}
