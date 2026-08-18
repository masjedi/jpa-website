import { type ComponentType, useEffect, useState } from 'react';

import type { ScannerProps } from '@/components/react-bits/Scanner/Scanner';

function supportsWebGL2(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    try {
        const canvas = document.createElement('canvas');

        return Boolean(canvas.getContext('webgl2'));
    } catch {
        return false;
    }
}

export function useDeferredScanner() {
    const [Scanner, setScanner] = useState<ComponentType<ScannerProps> | null>(null);

    useEffect(() => {
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (reducedMotionQuery.matches || !supportsWebGL2()) {
            return;
        }

        let cancelled = false;

        const load = () => {
            void import('@/components/react-bits/Scanner/Scanner').then((module) => {
                if (!cancelled) {
                    setScanner(() => module.Scanner);
                }
            });
        };

        const idleWindow = window as Window & {
            requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
            cancelIdleCallback?: (id: number) => void;
        };

        if (typeof idleWindow.requestIdleCallback === 'function') {
            const idleId = idleWindow.requestIdleCallback(load, { timeout: 1200 });

            return () => {
                cancelled = true;
                idleWindow.cancelIdleCallback?.(idleId);
            };
        }

        const timeoutId = window.setTimeout(load, 250);

        return () => {
            cancelled = true;
            window.clearTimeout(timeoutId);
        };
    }, []);

    return Scanner;
}
