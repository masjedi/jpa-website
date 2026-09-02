import { HandHeart, Heart, ShieldCheck, Tent } from 'lucide-react';
import { useMemo } from 'react';

import { FadeIn } from '@/components/motion/FadeIn';
import { useTranslations } from '@/hooks/use-translations';

export function ServicesImpactSection() {
    const { t } = useTranslations();

    const impactPoints = useMemo(
        () => [
            {
                icon: HandHeart,
                title: t('servicesPage.impact.locallyOwned.title'),
                description: t('servicesPage.impact.locallyOwned.description'),
            },
            {
                icon: ShieldCheck,
                title: t('servicesPage.impact.culturalRespect.title'),
                description: t('servicesPage.impact.culturalRespect.description'),
            },
            {
                icon: Heart,
                title: t('servicesPage.impact.communityMinded.title'),
                description: t('servicesPage.impact.communityMinded.description'),
            },
            {
                icon: Tent,
                title: t('servicesPage.impact.responsibleTravel.title'),
                description: t('servicesPage.impact.responsibleTravel.description'),
            },
        ],
        [t],
    );

    return (
        <section className="border-t border-border bg-surface-muted/30 py-12 sm:py-14">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <p className="text-center text-xs font-semibold uppercase tracking-wider text-secondary">
                        {t('servicesPage.impact.eyebrow')}
                    </p>
                    <h2 className="font-heading mt-2 text-center text-xl font-semibold text-foreground sm:text-2xl">
                        {t('servicesPage.impact.title')}
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
