import { Link } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';

import type { PublicHeroSlide } from '@/types/heroSection';

function HeroSlideBackground({
    slide,
    priority,
}: {
    slide: PublicHeroSlide;
    priority: boolean;
}) {
    if (!slide.imageUrl) {
        return (
            <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-brand-deep via-primary to-secondary/35"
            />
        );
    }

    return (
        <picture aria-hidden className="absolute inset-0 block size-full">
            {slide.imageUltraUrl ? (
                <source media="(min-width: 2560px)" srcSet={slide.imageUltraUrl} type="image/webp" />
            ) : null}
            {slide.imageUrl ? (
                <source media="(min-width: 1024px)" srcSet={slide.imageUrl} type="image/webp" />
            ) : null}
            <img
                src={slide.imageMediumUrl ?? slide.imageUrl}
                alt=""
                decoding="async"
                fetchPriority={priority ? 'high' : 'auto'}
                loading={priority ? 'eager' : 'lazy'}
                className="size-full object-cover object-center"
            />
        </picture>
    );
}

interface HeroCarouselProps {
    slides: readonly PublicHeroSlide[];
    eyebrow: string;
    carouselLabel: string;
    chooseMessageLabel: string;
    showMessageLabel: (current: number, total: number) => string;
    emptySlidesLabel: string;
    exploreToursLabel: string;
    sendInquiryLabel: string;
    donateButton: ReactNode;
}

export function HeroCarousel({
    slides,
    eyebrow,
    carouselLabel,
    chooseMessageLabel,
    showMessageLabel,
    emptySlidesLabel,
    exploreToursLabel,
    sendInquiryLabel,
    donateButton,
}: HeroCarouselProps) {
    const reducedMotion = useReducedMotion();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (slides.length === 0) {
            return;
        }

        if (activeIndex >= slides.length) {
            setActiveIndex(0);
        }
    }, [activeIndex, slides.length]);

    useEffect(() => {
        if (reducedMotion || isPaused || slides.length <= 1) {
            return;
        }

        const interval = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % slides.length);
        }, 6000);

        return () => window.clearInterval(interval);
    }, [isPaused, reducedMotion, slides.length]);

    const activeSlide = slides[activeIndex] ?? null;

    return (
        <section
            id="hero"
            className="relative isolate grid min-h-screen w-full place-items-center overflow-hidden bg-brand-deep"
            aria-label={carouselLabel}
            aria-roledescription="carousel"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
        >
            <div aria-hidden className="absolute inset-0">
                {slides.length === 0 ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-deep via-primary to-secondary/35" />
                ) : (
                    <AnimatePresence mode="sync" initial={false}>
                        <motion.div
                            key={activeSlide?.id ?? 'empty'}
                            className="absolute inset-0"
                            initial={reducedMotion ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={reducedMotion ? undefined : { opacity: 0 }}
                            transition={{ duration: 0.9, ease: 'easeInOut' }}
                        >
                            {activeSlide ? (
                                <HeroSlideBackground slide={activeSlide} priority={activeIndex === 0} />
                            ) : null}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            <div className="relative z-10 max-w-3xl px-4 py-28 text-center sm:px-6 lg:py-32">
                <div className="relative mx-auto max-w-2xl [text-shadow:0_1px_2px_rgba(7,23,34,0.85),0_2px_12px_rgba(7,23,34,0.35)]">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-on-surface/80">
                        {eyebrow}
                    </p>

                    {slides.length > 0 && activeSlide ? (
                        <>
                            <div className="grid min-h-[13.5rem] place-items-center sm:min-h-[14rem]">
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.div
                                            key={activeSlide.id}
                                            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
                                            transition={{ duration: 0.45, ease: 'easeOut' }}
                                        >
                                            <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.15] text-brand-on-surface sm:text-5xl lg:text-[3.25rem]">
                                                {activeSlide.title}
                                            </h1>
                                            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-brand-on-surface/90 sm:text-lg">
                                                {activeSlide.subtitle}
                                            </p>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                <div
                                    className="mt-3 flex items-center justify-center gap-2"
                                    aria-label={chooseMessageLabel}
                                >
                                    {slides.map((slide, index) => (
                                        <button
                                            key={slide.id}
                                            type="button"
                                            onClick={() => setActiveIndex(index)}
                                            aria-label={showMessageLabel(index + 1, slides.length)}
                                            aria-current={index === activeIndex ? 'true' : undefined}
                                            className="inline-flex min-h-11 min-w-11 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                        >
                                            <span
                                                aria-hidden
                                                className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                                                    index === activeIndex
                                                        ? 'w-8 bg-accent'
                                                        : 'w-3 bg-brand-on-surface/45'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                        </>
                    ) : (
                        <div className="mt-5 grid min-h-[13.5rem] place-items-center sm:min-h-[14rem]">
                            <p className="max-w-lg text-base leading-relaxed text-brand-on-surface/90 sm:text-lg">
                                {emptySlidesLabel}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-7 flex flex-col items-center justify-center gap-4">
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <a
                            href="#tours"
                            className="inline-flex min-w-[9.5rem] items-center justify-center rounded-full bg-secondary px-6 py-2.5 text-sm font-medium text-secondary-foreground shadow-[0_8px_24px_rgba(14,115,115,0.32)] transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            {exploreToursLabel}
                        </a>
                        <Link
                            id="plan-trip"
                            href="/contact"
                            className="inline-flex min-w-[9.5rem] items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground shadow-[0_8px_24px_rgba(215,162,58,0.28)] transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            {sendInquiryLabel}
                        </Link>
                    </div>
                    {donateButton}
                </div>
            </div>
        </section>
    );
}
