import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export interface Testimonial {
    name: string;
    journey: string;
    text: string;
    rating: number;
}

interface TestimonialsCarouselProps {
    items: readonly Testimonial[];
}

const AUTO_ADVANCE_MS = 5500;

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex justify-center gap-1" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => (
                <Star
                    key={index}
                    className={cn(
                        'size-4',
                        index < rating ? 'fill-accent text-accent' : 'text-border',
                    )}
                    aria-hidden
                />
            ))}
        </div>
    );
}

export function TestimonialsCarousel({ items }: TestimonialsCarouselProps) {
    const reducedMotion = useReducedMotion();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [direction, setDirection] = useState(1);

    const total = items.length;

    const goTo = useCallback((index: number, slideDirection?: number) => {
        if (total === 0) {
            return;
        }

        const nextIndex = ((index % total) + total) % total;
        if (slideDirection !== undefined) {
            setDirection(slideDirection);
        } else {
            setDirection(nextIndex >= activeIndex ? 1 : -1);
        }
        setActiveIndex(nextIndex);
    }, [activeIndex, total]);

    const goNext = useCallback(() => {
        if (total === 0) {
            return;
        }

        setDirection(1);
        setActiveIndex((current) => (current + 1) % total);
    }, [total]);

    const goPrev = useCallback(() => {
        if (total === 0) {
            return;
        }

        setDirection(-1);
        setActiveIndex((current) => (current - 1 + total) % total);
    }, [total]);

    useEffect(() => {
        if (reducedMotion || isPaused || total <= 1) {
            return;
        }

        const interval = window.setInterval(goNext, AUTO_ADVANCE_MS);

        return () => window.clearInterval(interval);
    }, [goNext, isPaused, reducedMotion, total]);

    if (total === 0) {
        return null;
    }

    const activeItem = items[activeIndex];
    const slideOffset = reducedMotion ? 0 : 48;

    return (
        <div
            className="relative mt-12"
            aria-roledescription="carousel"
            aria-label="Traveller testimonials"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setIsPaused(false);
                }
            }}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-8 top-8 text-[7rem] font-serif leading-none text-secondary/10 sm:text-[9rem]"
            >
                “
            </div>

            <div className="relative mx-auto max-w-3xl px-2 text-center sm:px-6">
                <div className="grid min-h-[14rem] place-items-center sm:min-h-[15rem]">
                    <AnimatePresence mode="wait" custom={direction} initial={false}>
                        <motion.figure
                            key={activeItem.name}
                            custom={direction}
                            initial={
                                reducedMotion
                                    ? false
                                    : { opacity: 0, x: direction * slideOffset }
                            }
                            animate={{ opacity: 1, x: 0 }}
                            exit={
                                reducedMotion
                                    ? undefined
                                    : { opacity: 0, x: direction * -slideOffset }
                            }
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full"
                        >
                            <blockquote className="font-heading text-xl font-medium leading-relaxed text-foreground sm:text-2xl lg:text-[1.75rem] lg:leading-snug">
                                {activeItem.text}
                            </blockquote>
                            <figcaption className="mt-8">
                                <div className="mx-auto flex max-w-md items-center justify-center gap-4">
                                    <span
                                        aria-hidden
                                        className="h-px w-10 bg-gradient-to-r from-transparent to-secondary/70"
                                    />
                                    <div>
                                        <p className="font-heading text-sm font-semibold text-foreground">
                                            {activeItem.name}
                                        </p>
                                        <p className="mt-1 text-xs text-secondary sm:text-sm">
                                            {activeItem.journey}
                                        </p>
                                    </div>
                                    <span
                                        aria-hidden
                                        className="h-px w-10 bg-gradient-to-l from-transparent to-secondary/70"
                                    />
                                </div>
                                <div className="mt-4">
                                    <StarRating rating={activeItem.rating} />
                                </div>
                            </figcaption>
                        </motion.figure>
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={goPrev}
                        aria-label="Previous testimonial"
                        className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-secondary/50 hover:bg-secondary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        <ChevronLeft className="size-5 rtl:rotate-180" aria-hidden />
                    </button>

                    <div
                        className="flex items-center gap-2"
                        aria-label="Choose a testimonial"
                    >
                        {items.map((item, index) => (
                            <button
                                key={item.name}
                                type="button"
                                onClick={() =>
                                    goTo(index, index > activeIndex ? 1 : -1)
                                }
                                aria-label={`Show testimonial ${index + 1} of ${total}`}
                                aria-current={index === activeIndex ? 'true' : undefined}
                                className={cn(
                                    'h-1.5 rounded-full transition-[width,background-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                                    index === activeIndex
                                        ? 'w-8 bg-secondary'
                                        : 'w-2.5 bg-border hover:bg-secondary/40',
                                )}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={goNext}
                        aria-label="Next testimonial"
                        className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-secondary/50 hover:bg-secondary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        <ChevronRight className="size-5 rtl:rotate-180" aria-hidden />
                    </button>
                </div>

                {!reducedMotion && total > 1 && !isPaused ? (
                    <div
                        aria-hidden
                        className="mx-auto mt-6 h-px max-w-xs overflow-hidden rounded-full bg-border/60"
                    >
                        <motion.div
                            key={activeIndex}
                            className="h-full origin-left bg-gradient-to-r from-secondary to-accent"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                                duration: AUTO_ADVANCE_MS / 1000,
                                ease: 'linear',
                            }}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}
