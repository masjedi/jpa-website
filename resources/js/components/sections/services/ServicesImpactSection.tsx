import { HandHeart, Heart, ShieldCheck, Tent } from 'lucide-react';

import { FadeIn } from '@/components/motion/FadeIn';

const impactPoints = [
    {
        icon: HandHeart,
        title: 'Locally owned',
        description: 'Tourism income stays with Afghan guesthouses, drivers and artisans.',
    },
    {
        icon: ShieldCheck,
        title: 'Cultural respect',
        description: 'Guides share customs and etiquette so visits are welcomed.',
    },
    {
        icon: Heart,
        title: 'Community-minded',
        description: 'Small groups and fair pricing for people and places we visit.',
    },
    {
        icon: Tent,
        title: 'Responsible travel',
        description: 'Leave-no-trace practices and photography consent on every route.',
    },
] as const;

export function ServicesImpactSection() {
    return (
        <section className="border-t border-border bg-surface-muted/30 py-12 sm:py-14">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <p className="text-center text-xs font-semibold uppercase tracking-wider text-secondary">
                        Our approach
                    </p>
                    <h2 className="font-heading mt-2 text-center text-xl font-semibold text-foreground sm:text-2xl">
                        Travel that gives back
                    </h2>
                </FadeIn>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {impactPoints.map((point, index) => {
                        const Icon = point.icon;

                        return (
                            <FadeIn key={point.title} delay={index * 0.04}>
                                <article className="rounded-xl border border-border bg-surface p-4 text-center">
                                    <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                                        <Icon className="size-5" aria-hidden />
                                    </div>
                                    <h3 className="font-heading mt-3 text-sm font-semibold text-foreground">
                                        {point.title}
                                    </h3>
                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                        {point.description}
                                    </p>
                                </article>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
