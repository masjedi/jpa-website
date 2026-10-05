import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';

import { FadeIn, RevealItem, RevealStagger } from '@/components/motion/FadeIn';
import { servicesHref } from '@/components/public/navigation';
import { useTranslations } from '@/hooks/use-translations';
import { mapHomeServicesToEditorialRows } from '@/lib/homeServices';
import { cn } from '@/lib/utils';
import type { HomeServicePreview } from '@/types/services';

interface HomeServicesSectionProps {
    services: readonly HomeServicePreview[];
    imageSrc: string;
}

function ServiceRow({
    number,
    title,
    description,
    href,
    isLast,
}: {
    number: string;
    title: string;
    description: string;
    href: string;
    isLast: boolean;
}) {
    const { t } = useTranslations();

    return (
        <li className={cn(!isLast && 'border-b border-brand-on-surface/12')}>
            <Link
                href={href}
                className={cn(
                    'group flex items-start gap-4 py-5 text-start sm:gap-5 sm:py-6',
                    'rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                    'hover:bg-brand-on-surface/[0.04] motion-safe:transition-colors motion-safe:duration-300',
                )}
            >
                <span
                    aria-hidden
                    className="pt-0.5 font-heading text-sm font-medium tabular-nums text-accent/80 motion-safe:transition-colors motion-safe:duration-300 group-hover:text-accent"
                >
                    {number}
                </span>

                <span className="min-w-0 flex-1">
                    <h3 className="font-heading text-lg font-semibold text-brand-on-surface motion-safe:transition-colors motion-safe:duration-300 group-hover:text-secondary sm:text-xl">
                        {title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-brand-on-surface/68 sm:text-[0.9375rem]">
                        {description}
                    </p>
                </span>

                <span
                    className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border border-brand-on-surface/14 text-brand-on-surface/70 motion-safe:transition-all motion-safe:duration-300 group-hover:border-secondary/40 group-hover:text-secondary motion-safe:group-hover:translate-x-0.5 rtl:motion-safe:group-hover:-translate-x-0.5"
                    aria-hidden
                >
                    <ArrowRight className="size-4 rtl:rotate-180" />
                </span>

                <span className="sr-only">
                    {t('home.services.rowLinkHint', { title })}
                </span>
            </Link>
        </li>
    );
}

export function HomeServicesSection({ services, imageSrc }: HomeServicesSectionProps) {
    const { t } = useTranslations();

    const rows = useMemo(() => mapHomeServicesToEditorialRows(services), [services]);

    if (rows.length === 0) {
        return null;
    }

    return (
        <section id="services" className="bg-brand-deep py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-start lg:gap-x-12 lg:gap-y-8">
                        <header className="order-1 text-start lg:col-start-2 lg:row-start-1">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                                {t('home.services.eyebrow')}
                            </p>
                            <h2 className="mt-3 font-heading text-3xl font-semibold text-brand-on-surface sm:text-4xl">
                                {t('home.services.title')}
                            </h2>
                            <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-on-surface/70">
                                {t('home.services.description')}
                            </p>
                        </header>

                        {imageSrc ? (
                            <figure className="order-2 overflow-hidden rounded-2xl lg:col-start-1 lg:row-start-1 lg:row-span-3">
                                <img
                                    src={imageSrc}
                                    alt={t('home.services.imageAlt')}
                                    width={720}
                                    height={900}
                                    loading="lazy"
                                    decoding="async"
                                    className="aspect-[4/5] w-full object-cover object-center"
                                />
                            </figure>
                        ) : (
                            <div
                                aria-hidden
                                className="order-2 hidden aspect-[4/5] rounded-2xl bg-brand-on-surface/6 lg:col-start-1 lg:row-start-1 lg:row-span-3 lg:block"
                            />
                        )}

                        <div className="order-3 lg:col-start-2 lg:row-start-2">
                            <RevealStagger>
                                <ul>
                                    {rows.map((row, index) => (
                                        <RevealItem key={row.key}>
                                            <ServiceRow
                                                number={row.number}
                                                title={t(`home.services.items.${row.key}.title`)}
                                                description={t(
                                                    `home.services.items.${row.key}.description`,
                                                )}
                                                href={servicesHref}
                                                isLast={index === rows.length - 1}
                                            />
                                        </RevealItem>
                                    ))}
                                </ul>
                            </RevealStagger>

                            <div className="mt-8 border-t border-brand-on-surface/12 pt-8">
                                <Link
                                    href={servicesHref}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:w-auto"
                                >
                                    {t('home.services.cta')}
                                    <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                                </Link>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
