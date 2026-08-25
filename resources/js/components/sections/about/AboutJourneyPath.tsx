import type { LucideIcon } from 'lucide-react';

import { FadeIn } from '@/components/motion/FadeIn';
import { resolveAboutIcon } from '@/lib/aboutIcons';
import type { PublicAboutJourneyStep } from '@/types/aboutPage';
import { cn } from '@/lib/utils';

function JourneyImage({
    step,
    curve,
}: {
    step: PublicAboutJourneyStep;
    curve: 'left' | 'right';
}) {
    return (
        <div
            className={cn(
                'relative z-10 overflow-hidden border-[6px] border-secondary bg-surface-muted shadow-[0_18px_40px_rgba(22,59,92,0.08)]',
                curve === 'left'
                    ? 'rounded-s-[999px] rounded-e-[2rem]'
                    : 'rounded-e-[999px] rounded-s-[2rem]',
            )}
        >
            {step.image ? (
                <img
                    src={step.image}
                    alt={step.imageAlt}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                />
            ) : (
                <div
                    className="aspect-[4/3] w-full bg-surface-muted"
                    role="img"
                    aria-label={step.imageAlt}
                />
            )}
        </div>
    );
}

function JourneyContent({
    step,
    icon: Icon,
}: {
    step: PublicAboutJourneyStep;
    icon: LucideIcon;
}) {
    return (
        <article className="relative z-10 max-w-md rounded-2xl bg-background px-4 py-5 text-start sm:px-5 lg:py-6">
            <div className="inline-flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Icon className="size-5" aria-hidden />
            </div>
            <h3 className="font-heading mt-5 text-xl font-semibold text-foreground sm:text-2xl">
                {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {step.description}
            </p>
        </article>
    );
}

interface AboutJourneyPathProps {
    steps: readonly PublicAboutJourneyStep[];
}

export function AboutJourneyPath({ steps }: AboutJourneyPathProps) {
    if (steps.length === 0) {
        return null;
    }

    return (
        <section
            id="journey"
            aria-labelledby="journey-path-heading"
            className="overflow-hidden bg-background pb-16 pt-4 sm:pb-20 sm:pt-8 lg:pb-24"
        >
            <h2 id="journey-path-heading" className="sr-only">
                How our guiding work has grown
            </h2>

            <div className="relative isolate mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <svg
                    aria-hidden
                    className="pointer-events-none absolute inset-x-8 top-8 z-0 hidden h-[calc(100%-4rem)] w-[calc(100%-4rem)] lg:block"
                    viewBox="0 0 1000 2200"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M 280 0
                           C 280 180, 720 240, 720 440
                           C 720 640, 280 700, 280 900
                           C 280 1100, 720 1160, 720 1360
                           C 720 1560, 280 1620, 280 1820
                           C 280 2000, 720 2060, 720 2200"
                        className="stroke-secondary/80"
                        fill="none"
                        strokeWidth="24"
                        strokeLinecap="round"
                    />
                </svg>

                <div className="relative z-10 space-y-16 sm:space-y-20 lg:space-y-24">
                    {steps.map((step, index) => {
                        const reversed = index % 2 === 1;
                        const Icon = resolveAboutIcon(step.iconKey);

                        return (
                            <FadeIn key={step.id} delay={index * 0.04}>
                                <div
                                    className={cn(
                                        'relative z-10 grid items-center gap-8 lg:grid-cols-2 lg:gap-14 xl:gap-20',
                                        reversed && 'lg:[&>*:first-child]:order-2',
                                    )}
                                >
                                    <JourneyImage step={step} curve={reversed ? 'right' : 'left'} />
                                    <JourneyContent step={step} icon={Icon} />
                                </div>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
