import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';
import type { PublicTestimonial } from '@/types/testimonials';

interface TestimonialsCarouselProps {
    items: readonly PublicTestimonial[];
}

const AUTO_ADVANCE_MS = 6000;

function TestimonialAvatar({ name, image }: { name: string; image: string }) {
    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');

    return (
        <div className="mx-auto size-28 rounded-full border-4 border-accent p-1 sm:size-32">
            {image ? (
                <img
                    src={image}
                    alt=""
                    width={128}
                    height={128}
                    className="size-full rounded-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                />
            ) : (
                <div
                    aria-hidden
                    className="flex size-full items-center justify-center rounded-full bg-surface-muted font-heading text-lg font-semibold text-muted-foreground"
                >
                    {initials || '?'}
                </div>
            )}
        </div>
    );
}

export function TestimonialsCarousel({ items }: TestimonialsCarouselProps) {
    const { t } = useTranslations();
    const reducedMotion = useReducedMotion();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [direction, setDirection] = useState(1);

    const total = items.length;

    const goTo = useCallback(
        (index: number, slideDirection?: number) => {
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
        },
        [activeIndex, total],
    );

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
    const slideOffset = reducedMotion ? 0 : 32;

    return (
        <div
            className="relative mt-10 sm:mt-12"
            aria-roledescription="carousel"
            aria-label={t('home.testimonials.title')}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setIsPaused(false);
                }
            }}
        >
            <div className="relative mx-auto max-w-3xl px-12 sm:px-16">
                {total > 1 ? (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            aria-label="Previous testimonial"
                            className="absolute start-0 top-[4.5rem] z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:top-[5rem] sm:size-11"
                        >
                            <ChevronLeft className="size-5 rtl:rotate-180" aria-hidden />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            aria-label="Next testimonial"
                            className="absolute end-0 top-[4.5rem] z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:top-[5rem] sm:size-11"
                        >
                            <ChevronRight className="size-5 rtl:rotate-180" aria-hidden />
                        </button>
                    </>
                ) : null}

                <div className="grid min-h-[18rem] place-items-center sm:min-h-[19rem]">
                    <AnimatePresence mode="wait" custom={direction} initial={false}>
                        <motion.figure
                            key={activeItem.id}
                            custom={direction}
                            initial={
                                reducedMotion
                                    ? false
                                    : { opacity: 0, y: direction * slideOffset }
                            }
                            animate={{ opacity: 1, y: 0 }}
                            exit={
                                reducedMotion
                                    ? undefined
                                    : { opacity: 0, y: direction * -slideOffset }
                            }
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full text-center"
                        >
                            <TestimonialAvatar name={activeItem.name} image={activeItem.image} />

                            <blockquote className="mt-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
                                <span aria-hidden className="text-secondary/70">
                                    “
                                </span>
                                {activeItem.text}
                                <span aria-hidden className="text-secondary/70">
                                    ”
                                </span>
                            </blockquote>

                            <figcaption className="mt-6">
                                <p className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                                    {activeItem.name}
                                </p>
                                {activeItem.journey ? (
                                    <p className="mt-1 text-sm text-secondary">{activeItem.journey}</p>
                                ) : null}
                            </figcaption>
                        </motion.figure>
                    </AnimatePresence>
                </div>
            </div>

            {total > 1 ? (
                <div
                    className="mt-8 flex items-center justify-center gap-2"
                    aria-label={t('home.testimonials.title')}
                >
                    {items.map((item, index) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => goTo(index, index > activeIndex ? 1 : -1)}
                            aria-label={`Show testimonial ${index + 1} of ${total}`}
                            aria-current={index === activeIndex ? 'true' : undefined}
                            className={cn(
                                'rounded-full transition-[width,background-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                                index === activeIndex
                                    ? 'size-2.5 bg-accent'
                                    : 'size-2 bg-border hover:bg-secondary/40',
                            )}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
}
