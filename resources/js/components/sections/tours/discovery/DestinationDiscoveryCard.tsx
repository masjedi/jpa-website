import { Link } from '@inertiajs/react';
import { ArrowRight, MapPin } from 'lucide-react';

import { destinationShowHref } from '@/components/public/navigation';
import { toursForDestinationHref } from '@/components/sections/tours/discovery/discoveryQuery';
import { useTranslations } from '@/hooks/use-translations';
import {
    cardFooterActionsClass,
    cardFooterClass,
    cardFooterMetaClass,
    cardSummaryClass,
    cardTitleClass,
} from '@/lib/cardText';
import type { Destination } from '@/types/destinations';

interface DestinationDiscoveryCardProps {
    destination: Destination;
    priority?: boolean;
}

export function DestinationDiscoveryCard({
    destination,
    priority = false,
}: DestinationDiscoveryCardProps) {
    const { t } = useTranslations();
    const relatedTourCount = destination.linkedToursCount ?? 0;
    const relatedLabel =
        relatedTourCount === 1
            ? t('destinationsPage.grid.relatedTourCount', { count: relatedTourCount })
            : t('destinationsPage.grid.relatedToursCount', { count: relatedTourCount });

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface text-start shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/20 hover:shadow-md">
            <Link
                href={destinationShowHref(destination.slug)}
                className="relative block aspect-[3/2] w-full overflow-hidden bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
                <img
                    src={destination.image}
                    alt=""
                    width={720}
                    height={480}
                    className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
                    aria-hidden
                />
                <span className="absolute bottom-3 start-3 inline-flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
                    <MapPin className="size-3" aria-hidden />
                    {destination.region}
                </span>
            </Link>

            <div className="flex flex-1 flex-col p-5">
                <Link
                    href={destinationShowHref(destination.slug)}
                    className={`font-heading text-[0.9375rem] font-semibold leading-snug text-foreground transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${cardTitleClass}`}
                >
                    {destination.name}
                </Link>

                <p
                    className={`mt-2 text-sm leading-relaxed text-muted-foreground ${cardSummaryClass}`}
                >
                    {destination.tagline || destination.description}
                </p>

                <div className={`${cardFooterClass} border-t border-border/80`}>
                    {relatedTourCount > 0 ? (
                        <Link
                            href={toursForDestinationHref(destination.slug)}
                            className={`${cardFooterMetaClass} font-medium transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus`}
                        >
                            {relatedLabel}
                        </Link>
                    ) : (
                        <span className={cardFooterMetaClass}>{relatedLabel}</span>
                    )}
                    <div className={cardFooterActionsClass}>
                        <Link
                            href={destinationShowHref(destination.slug)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            {t('buttons.explore')}
                            <ArrowRight
                                className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                                aria-hidden
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
