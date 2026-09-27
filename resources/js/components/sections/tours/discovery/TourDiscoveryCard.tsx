import { Link } from '@inertiajs/react';
import { ArrowRight, MapPin } from 'lucide-react';

import { tourShowHref } from '@/components/public/navigation';
import { TourOfferBadges } from '@/components/sections/tours/TourOfferBadges';
import { useTranslations } from '@/hooks/use-translations';
import {
    cardFooterActionsClass,
    cardFooterClass,
    cardFooterPrimaryClass,
    cardLineClass,
    cardSummaryClass,
    cardTitleClass,
} from '@/lib/cardText';
import type { Tour } from '@/types/tours';

interface TourDiscoveryCardProps {
    tour: Tour;
    onRequest: (tour: Tour) => void;
    priority?: boolean;
}

export function TourDiscoveryCard({ tour, onRequest, priority = false }: TourDiscoveryCardProps) {
    const { t } = useTranslations();
    const priceLabel = tour.priceLabel?.trim() || t('buttons.priceOnRequest');
    const metaLine = [tour.travelStyle, tour.difficulty].filter(Boolean).join(' · ');
    const locationLine = [tour.destination, tour.duration].filter(Boolean).join(' · ');

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface text-start shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/20 hover:shadow-md">
            <Link
                href={tourShowHref(tour.slug)}
                className="relative block aspect-[3/2] w-full overflow-hidden bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
                <img
                    src={tour.image}
                    alt=""
                    width={720}
                    height={480}
                    className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
                    aria-hidden
                />
                <TourOfferBadges
                    durationDays={tour.durationDays}
                    durationLabel={tour.duration}
                    highlight={tour.badge}
                />
            </Link>

            <div className="flex flex-1 flex-col p-5">
                <Link
                    href={tourShowHref(tour.slug)}
                    className={`font-heading text-[0.9375rem] font-semibold leading-snug text-foreground transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${cardTitleClass}`}
                >
                    <span className="sr-only">{t('buttons.viewItinerary')}: </span>
                    {tour.title}
                </Link>

                <p
                    className={`mt-2 flex items-center gap-1.5 text-xs text-muted-foreground ${cardLineClass}`}
                >
                    <MapPin className="size-3.5 shrink-0 text-secondary" aria-hidden />
                    <span className="truncate">{locationLine || '\u00a0'}</span>
                </p>

                <p className={`mt-1 text-xs text-muted-foreground ${cardLineClass}`}>
                    {metaLine || '\u00a0'}
                </p>

                <p
                    className={`mt-2 text-sm leading-relaxed text-muted-foreground ${cardSummaryClass}`}
                >
                    {tour.description}
                </p>

                <div className={`${cardFooterClass} border-t border-border/80`}>
                    <p className={cardFooterPrimaryClass}>{priceLabel}</p>
                    <div className={cardFooterActionsClass}>
                        <Link
                            href={tourShowHref(tour.slug)}
                            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            {t('buttons.view')}
                        </Link>
                        <button
                            type="button"
                            onClick={() => onRequest(tour)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            {t('buttons.request')}
                            <ArrowRight
                                className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                                aria-hidden
                            />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
