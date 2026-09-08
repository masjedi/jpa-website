import { useMemo, useState } from 'react';

import { FadeIn } from '@/components/motion/FadeIn';
import { useTranslations } from '@/hooks/use-translations';
import { cardLineClass, cardSummaryClass, cardTitleClass } from '@/lib/cardText';
import { resolveServiceIcon } from '@/lib/serviceIcons';
import type { PublicServiceOffering, ServiceCategory } from '@/types/services';
import { serviceCategoryLabels } from '@/types/services';

interface ServicesListSectionProps {
    offerings: readonly PublicServiceOffering[];
}

export function ServicesListSection({ offerings }: ServicesListSectionProps) {
    const { t } = useTranslations();
    const [activeCategory, setActiveCategory] = useState<'all' | ServiceCategory>('all');

    const categories = useMemo(
        () => [
            { value: 'all' as const, label: t('servicesPage.catalogue.allServices') },
            ...serviceCategoryLabels.map((category) => ({
                value: category,
                label: category,
            })),
        ],
        [t],
    );

    const catalogue = useMemo(
        () => offerings.filter((service) => !service.isFeatured),
        [offerings],
    );

    const filteredServices = useMemo(() => {
        if (activeCategory === 'all') {
            return catalogue;
        }

        return catalogue.filter((service) => service.category === activeCategory);
    }, [activeCategory, catalogue]);

    return (
        <section id="services-list" className="bg-surface-muted/40 py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="flex flex-col gap-4 text-start sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                                {t('servicesPage.catalogue.eyebrow')}
                            </p>
                            <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                                {t('servicesPage.catalogue.title')}
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.value}
                                    type="button"
                                    onClick={() => setActiveCategory(category.value)}
                                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                                        activeCategory === category.value
                                            ? 'bg-primary text-primary-foreground'
                                            : 'border border-border bg-surface text-foreground hover:bg-surface-muted'
                                    }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                {filteredServices.length === 0 ? (
                    <p className="mt-8 text-sm text-muted-foreground">
                        {t('servicesPage.catalogue.emptyCategory')}
                    </p>
                ) : (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {filteredServices.map((service, index) => {
                            const Icon = resolveServiceIcon(service.iconKey);

                            return (
                                <FadeIn key={service.id} delay={index * 0.04} className="h-full">
                                    <article className="group relative flex h-full gap-4 overflow-hidden rounded-2xl border border-border bg-surface p-5 text-start shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/30 hover:shadow-md">
                                        <div
                                            aria-hidden
                                            className="absolute inset-y-0 start-0 w-1 bg-gradient-to-b from-secondary/80 via-secondary/40 to-accent/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                        />

                                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-secondary/10 group-hover:text-secondary">
                                            <Icon className="size-5" aria-hidden />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                {service.category}
                                            </p>
                                            <h3 className={`font-heading mt-0.5 text-base font-semibold text-foreground ${cardTitleClass}`}>
                                                {service.title}
                                            </h3>
                                            <p className={`mt-1.5 text-sm leading-relaxed text-muted-foreground ${cardSummaryClass}`}>
                                                {service.description}
                                            </p>
                                            <ul className="mt-3 space-y-1">
                                                {service.features.slice(0, 2).map((feature) => (
                                                    <li
                                                        key={feature}
                                                        className={`${cardLineClass} text-xs text-muted-foreground before:me-1.5 before:text-secondary before:content-['·']`}
                                                    >
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </article>
                                </FadeIn>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
