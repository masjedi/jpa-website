import { useEffect } from 'react';

/**
 * Locks document scroll while `locked` is true without losing the current scroll position.
 * Also blocks scroll chaining from nested overflow areas to the page behind.
 */
export function useLockBodyScroll(locked: boolean): void {
    useEffect(() => {
        if (!locked) {
            return;
        }

        const { body, documentElement } = document;
        const scrollY = window.scrollY;
        const scrollbarWidth = Math.max(0, window.innerWidth - documentElement.clientWidth);

        const previous = {
            bodyOverflow: body.style.overflow,
            bodyPosition: body.style.position,
            bodyTop: body.style.top,
            bodyLeft: body.style.left,
            bodyRight: body.style.right,
            bodyWidth: body.style.width,
            bodyPaddingRight: body.style.paddingRight,
            htmlOverflow: documentElement.style.overflow,
            htmlOverscroll: documentElement.style.overscrollBehavior,
        };

        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.left = '0';
        body.style.right = '0';
        body.style.width = '100%';
        documentElement.style.overflow = 'hidden';
        documentElement.style.overscrollBehavior = 'none';

        if (scrollbarWidth > 0) {
            body.style.paddingRight = `${scrollbarWidth}px`;
        }

        const preventTouchMove = (event: TouchEvent) => {
            const target = event.target;

            if (!(target instanceof Element)) {
                event.preventDefault();
                return;
            }

            const scrollable = target.closest('[data-scroll-lock-scrollable]');

            if (!scrollable) {
                event.preventDefault();
            }
        };

        document.addEventListener('touchmove', preventTouchMove, { passive: false });

        return () => {
            document.removeEventListener('touchmove', preventTouchMove);

            body.style.overflow = previous.bodyOverflow;
            body.style.position = previous.bodyPosition;
            body.style.top = previous.bodyTop;
            body.style.left = previous.bodyLeft;
            body.style.right = previous.bodyRight;
            body.style.width = previous.bodyWidth;
            body.style.paddingRight = previous.bodyPaddingRight;
            documentElement.style.overflow = previous.htmlOverflow;
            documentElement.style.overscrollBehavior = previous.htmlOverscroll;

            window.scrollTo(0, scrollY);
        };
    }, [locked]);
}
