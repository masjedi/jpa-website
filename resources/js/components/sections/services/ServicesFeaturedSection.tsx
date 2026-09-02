import { Check } from 'lucide-react';

import { FadeIn } from '@/components/motion/FadeIn';
import { BorderGlow } from '@/components/react-bits/BorderGlow/BorderGlow';
import { useTranslations } from '@/hooks/use-translations';
import { resolveServiceIcon } from '@/lib/serviceIcons';
import type { PublicServiceOffering } from '@/types/services';

interface ServicesFeaturedSectionProps {
    offerings: readonly PublicServiceOffering[];
}

export function ServicesFeaturedSection({ offerings }: ServicesFeaturedSectionProps) {
    const { t } = useTranslations();
    const featured = offerings.filter((service) => service.isFeatured);

    if (featured.length === 0) {
        return null;
    }

    return (
        <section className="border-b border-border bg-background py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-start">
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                            {t('servicesPage.featured.eyebrow')}
                        </p>
                        <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                            {t('servicesPage.featured.title')}
                        </h2>
                    </div>
                </FadeIn>

                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                    {featured.map((service, index) => {
                        const Icon = resolveServiceIcon(service.iconKey);

                        return (
                            <FadeIn key={service.id} delay={index * 0.06}>
                                <BorderGlow
                                    className="h-full"
                                    backgroundColor="var(--surface)"
                                    borderRadius={20}
                                    colors={['#0E7373', '#163B5C', '#D7A23A']}
                                    glowColor="182 78 26"
                                    edgeSensitivity={24}
                                    animated={false}
                                >
                                    <article className="flex h-full flex-col rounded-[20px] border border-border bg-surface p-6 text-start sm:p-7">
                                        <div className="flex items-start gap-4">
                                            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                                                <Icon className="size-6" aria-hidden />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                                                    {service.category}
                                                </p>
                                                <h3 className="font-heading mt-1 text-xl font-semibold text-foreground">
                                                    {service.title}
                                                </h3>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {service.tagline}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                                            {service.description}
                                        </p>

                                        <ul className="mt-5 space-y-2 border-t border-border pt-5">
                                            {service.features.map((feature) => (
                                                <li
                                                    key={feature}
                                                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                                                >
                                                    <Check
                                                        className="mt-0.5 size-4 shrink-0 text-secondary"
                                                        aria-hidden
                                                    />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </article>
                                </BorderGlow>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
