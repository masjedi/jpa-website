import { CheckCircle2 } from 'lucide-react';

import { FadeIn } from '@/components/motion/FadeIn';
import { aboutWhyChooseUs } from '@/data/aboutData';

export function AboutWhyChooseUsSection() {
    return (
        <section
            id="why-us"
            aria-labelledby="why-us-heading"
            className="bg-surface-muted/40 py-12 sm:py-16"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="max-w-2xl text-start">
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                            Why choose us
                        </p>
                        <h2
                            id="why-us-heading"
                            className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl"
                        >
                            The difference is on the ground
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            We are not a booking platform. We are a small Afghan team
                            that plans, guides and stands behind every journey.
                        </p>
                    </div>
                </FadeIn>

                <div className="mt-12 space-y-16 sm:space-y-20">
                    {aboutWhyChooseUs.map((item, index) => {
                        const reversed = index % 2 === 1;

                        return (
                            <div
                                key={item.title}
                                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                                    reversed ? 'lg:[&>*:first-child]:order-2' : ''
                                }`}
                            >
                                <FadeIn delay={0.04}>
                                    <div className="relative overflow-hidden rounded-3xl bg-surface-muted shadow-sm">
                                        <img
                                            src={item.image}
                                            alt={item.imageAlt}
                                            className="aspect-[4/3] size-full object-cover"
                                            loading="lazy"
                                        />
                                        <div
                                            aria-hidden
                                            className="absolute inset-0 bg-gradient-to-t from-brand-surface/20 to-transparent"
                                        />
                                    </div>
                                </FadeIn>

                                <FadeIn delay={0.08}>
                                    <article className="text-start">
                                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                                            <CheckCircle2 className="size-4" aria-hidden />
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <h3 className="font-heading mt-3 text-xl font-semibold text-foreground sm:text-2xl">
                                            {item.title}
                                        </h3>
                                        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                                            {item.description}
                                        </p>
                                    </article>
                                </FadeIn>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
