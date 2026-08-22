import { type RefObject, useEffect, useState } from 'react';

interface UseInViewportOptions {
    rootMargin?: string;
    threshold?: number;
    once?: boolean;
}

export function useInViewport(
    ref: RefObject<Element | null>,
    { rootMargin = '200px 0px', threshold = 0, once = true }: UseInViewportOptions = {},
): boolean {
    const [isInViewport, setIsInViewport] = useState(false);

    useEffect(() => {
        const element = ref.current;

        if (!element || (once && isInViewport)) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInViewport(true);

                    if (once) {
                        observer.disconnect();
                    }
                } else if (!once) {
                    setIsInViewport(false);
                }
            },
            { rootMargin, threshold },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [isInViewport, once, ref, rootMargin, threshold]);

    return isInViewport;
}
