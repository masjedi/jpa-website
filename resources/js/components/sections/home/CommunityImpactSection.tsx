import { HandHeart, Heart, ShieldCheck, Tent, type LucideIcon } from 'lucide-react';

import { FadeIn } from '@/components/motion/FadeIn';

interface ImpactPrinciple {
    icon: LucideIcon;
    title: string;
    description: string;
}

const impactPrinciples: readonly ImpactPrinciple[] = [
    {
        icon: HandHeart,
        title: 'Locally owned services',
        description:
            'We work with Afghan-owned guesthouses, drivers and artisans so tourism income stays local.',
    },
    {
        icon: ShieldCheck,
        title: 'Cultural respect',
        description:
            'Guides share context on customs, dress and etiquette so visits are welcomed by hosts.',
    },
    {
        icon: Heart,
        title: 'Community-minded travel',
        description:
            'Small groups and fair pricing that respect the people and places we visit.',
    },
    {
        icon: Tent,
        title: 'Responsible visitor behavior',
        description:
            'Leave-no-trace practices, photography consent and support for conservation efforts.',
    },
];

export function CommunityImpactSection() {
    return (
        <section
            id="impact"
            aria-labelledby="impact-heading"
            className="relative overflow-hidden bg-brand-surface py-16 text-brand-on-surface sm:py-20"
        >
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,115,115,0.28)_0%,transparent_50%)]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,162,58,0.12)_0%,transparent_40%)]"
            />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12 xl:gap-20">
                    <FadeIn className="lg:col-span-5 lg:sticky lg:top-28">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-on-surface/60">
                            Cultural &amp; community impact
                        </p>
                        <h2
                            id="impact-heading"
                            className="font-heading mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
                        >
                            Travel that gives back
                        </h2>
                        <p className="mt-4 max-w-md text-base leading-relaxed text-brand-on-surface/75">
                            We design journeys that respect local culture and keep tourism income
                            within Afghan communities.
                        </p>
                        <div aria-hidden className="mt-8 h-px w-16 bg-accent/80" />
                    </FadeIn>

                    <ul className="mt-12 divide-y divide-brand-on-surface/10 lg:col-span-7 lg:mt-0">
                        {impactPrinciples.map((principle, index) => {
                            const Icon = principle.icon;

                            return (
                                <li key={principle.title} className="py-8 first:pt-0 last:pb-0">
                                    <FadeIn delay={index * 0.08} className="group">
                                        <div className="flex gap-5 sm:gap-8">
                                            <span
                                                aria-hidden
                                                className="font-heading shrink-0 text-3xl font-semibold tabular-nums text-accent/90 sm:text-4xl"
                                            >
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-brand-on-surface/15 bg-brand-on-surface/5 text-secondary transition-colors duration-300 group-hover:border-secondary/40 group-hover:bg-secondary/10">
                                                        <Icon className="size-4" aria-hidden />
                                                    </span>
                                                    <h3 className="font-heading pt-1 text-lg font-semibold sm:text-xl">
                                                        {principle.title}
                                                    </h3>
                                                </div>
                                                <p className="mt-3 ps-12 text-sm leading-relaxed text-brand-on-surface/70 sm:text-base">
                                                    {principle.description}
                                                </p>
                                            </div>
                                        </div>
                                    </FadeIn>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </section>
    );
}
