import { Link } from '@inertiajs/react';
import { ArrowRight, MessageCircle } from 'lucide-react';

import { FadeIn } from '@/components/motion/FadeIn';
import { planTripHref } from '@/components/public/navigation';

export function AboutCtaSection() {
    return (
        <section
            aria-labelledby="about-cta-heading"
            className="relative overflow-hidden bg-brand-surface py-16 text-brand-on-surface sm:py-20"
        >
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,115,115,0.32)_0%,transparent_55%)]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,162,58,0.12)_0%,transparent_38%)]"
            />

            <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                <FadeIn>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-on-surface/60">
                        Start planning
                    </p>
                    <h2
                        id="about-cta-heading"
                        className="font-heading mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
                    >
                        Ready to explore Afghanistan with us?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-on-surface/75">
                        Tell us your dates, interests and travel style. Our team
                        will respond with an honest, human-reviewed itinerary —
                        no instant checkout, no empty promises.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href={planTripHref}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            <MessageCircle className="size-4" aria-hidden />
                            Book Now
                        </Link>
                        <Link
                            href="/tours"
                            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-brand-on-surface/25 px-7 py-3 text-sm font-medium text-brand-on-surface transition-colors hover:bg-brand-on-surface/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            Browse tours
                            <ArrowRight className="size-4" aria-hidden />
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
