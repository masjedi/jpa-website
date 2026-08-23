import { Link } from '@inertiajs/react';
import { ArrowRight, HandHeart, Heart, ShieldCheck, Tent, type LucideIcon } from 'lucide-react';

import { FadeIn, RevealItem, RevealStagger } from '@/components/motion/FadeIn';
import { SpotlightCard } from '@/components/react-bits/SpotlightCard/SpotlightCard';

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
            'Afghan-owned guesthouses, drivers and artisans — tourism income stays local.',
    },
    {
        icon: ShieldCheck,
        title: 'Cultural respect',
        description:
            'Guides share customs, dress and etiquette so visits are welcomed by hosts.',
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
            'Leave-no-trace practices, photography consent and conservation support.',
    },
];

export function CommunityImpactSection() {
    return (
        <section
            id="impact"
            aria-labelledby="impact-heading"
            className="bg-background py-16 sm:py-20"
        >
            <div className="mx-auto max-w-7xl px-4 text-start sm:px-6 lg:px-8">
                <FadeIn>
                    <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
                        Cultural &amp; community impact
                    </p>
                    <h2
                        id="impact-heading"
                        className="mt-3 font-heading text-3xl font-semibold text-foreground sm:text-4xl"
                    >
                        Travel that gives back
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                        We design journeys that respect local culture and keep tourism
                        income within Afghan communities.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/about"
                            prefetch="hover"
                            className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            Our story &amp; values
                            <ArrowRight className="size-4" aria-hidden />
                        </Link>
                    </div>
                </FadeIn>

                <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:items-stretch">
                    <FadeIn className="lg:col-span-5">
                        <figure className="group relative h-full min-h-[320px] overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-sm lg:min-h-[420px]">
                            <img
                                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80"
                                alt="Local artisan at work in a craft workshop"
                                width={900}
                                height={1125}
                                className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                loading="lazy"
                                decoding="async"
                            />
                            <div
                                aria-hidden
                                className="absolute inset-0 bg-gradient-to-t from-brand-surface/90 via-brand-surface/20 to-transparent"
                            />
                            <figcaption className="absolute inset-x-0 bottom-0 p-6 text-start sm:p-8">
                                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                                    On the ground
                                </p>
                                <blockquote className="font-heading mt-2 text-lg font-semibold leading-snug text-brand-on-surface sm:text-xl">
                                    &ldquo;Every itinerary connects travellers with people
                                    and places we know personally.&rdquo;
                                </blockquote>
                            </figcaption>
                        </figure>
                    </FadeIn>

                    <RevealStagger
                        className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-2 lg:content-stretch"
                        stagger={0.06}
                    >
                        {impactPrinciples.map((principle) => {
                            const Icon = principle.icon;

                            return (
                                <RevealItem key={principle.title} className="h-full">
                                    <SpotlightCard
                                        className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 text-start shadow-sm"
                                        spotlightColor="rgba(14, 115, 115, 0.2)"
                                    >
                                        <div className="flex size-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                                            <Icon className="size-5" aria-hidden />
                                        </div>
                                        <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                                            {principle.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                            {principle.description}
                                        </p>
                                    </SpotlightCard>
                                </RevealItem>
                            );
                        })}
                    </RevealStagger>
                </div>
            </div>
        </section>
    );
}
