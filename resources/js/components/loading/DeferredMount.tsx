import { type ReactNode, useRef } from 'react';

import { useInViewport } from '@/hooks/use-in-viewport';

interface DeferredMountProps {
    children: ReactNode;
    fallback: ReactNode;
    rootMargin?: string;
    minHeight?: string;
}

export function DeferredMount({
    children,
    fallback,
    rootMargin = '240px 0px',
    minHeight,
}: DeferredMountProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isVisible = useInViewport(containerRef, { rootMargin, once: true });

    return (
        <div ref={containerRef} style={minHeight ? { minHeight } : undefined}>
            {isVisible ? children : fallback}
        </div>
    );
}
