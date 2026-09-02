import { useMemo } from 'react';

import { FadeIn } from '@/components/motion/FadeIn';
import { useTranslations } from '@/hooks/use-translations';

export function ServicesProcessSection() {
    const { t } = useTranslations();

    const steps = useMemo(
        () => [
            {
                step: '01',
                title: t('servicesPage.process.steps.inquiry.title'),
                description: t('servicesPage.process.steps.inquiry.description'),
            },
            {
                step: '02',
                title: t('servicesPage.process.steps.proposal.title'),
                description: t('servicesPage.process.steps.proposal.description'),
            },
            {
                step: '03',
                title: t('servicesPage.process.steps.refine.title'),
                description: t('servicesPage.process.steps.refine.description'),
            },
            {
                step: '04',
                title: t('servicesPage.process.steps.travel.title'),
                description: t('servicesPage.process.steps.travel.description'),
            },
        ],
        [t],
    );

    return (
        <section className="border-t border-border bg-background py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="max-w-2xl text-start">
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                            {t('servicesPage.process.eyebrow')}
                        </p>
                        <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                            {t('servicesPage.process.title')}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            {t('servicesPage.process.description')}
                        </p>
                    </div>
                </FadeIn>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <FadeIn key={step.step} delay={index * 0.05}>
                            <article className="relative rounded-2xl border border-border bg-surface p-5 text-start shadow-sm">
                                <span className="font-heading text-3xl font-bold text-secondary/25">
                                    {step.step}
                                </span>
                                <h3 className="font-heading mt-2 text-sm font-semibold text-foreground">
                                    {step.title}
                                </h3>
                                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                                    {step.description}
                                </p>
                            </article>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
