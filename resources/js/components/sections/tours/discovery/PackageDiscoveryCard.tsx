import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

import { packageShowHref } from '@/components/public/navigation';
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
import type { TourPackage } from '@/types/tours';

interface PackageDiscoveryCardProps {
    pkg: TourPackage;
    onRequest: (pkg: TourPackage) => void;
    priority?: boolean;
}

export function PackageDiscoveryCard({
    pkg,
    onRequest,
    priority = false,
}: PackageDiscoveryCardProps) {
    const { t } = useTranslations();
    const destinationsLine =
        pkg.keyDestinations.length > 0
            ? [
                  ...pkg.keyDestinations.slice(0, 3),
                  pkg.keyDestinations.length > 3
                      ? `+${pkg.keyDestinations.length - 3}`
                      : null,
              ]
                  .filter(Boolean)
                  .join(' · ')
            : '';
    const inclusionLine = pkg.includedServices.slice(0, 2).join(' · ');

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface text-start shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/20 hover:shadow-md">
            <Link
                href={packageShowHref(pkg.slug)}
                className="relative block aspect-[3/2] w-full overflow-hidden bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
                <img
                    src={pkg.image}
                    alt=""
                    width={720}
                    height={480}
                    className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
                    aria-hidden
                />
                <TourOfferBadges
                    durationDays={pkg.durationDays}
                    durationLabel={pkg.duration}
                    highlight={pkg.badge}
                />
            </Link>

            <div className="flex flex-1 flex-col p-5">
                <Link
                    href={packageShowHref(pkg.slug)}
                    className={`font-heading text-[0.9375rem] font-semibold leading-snug text-foreground transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${cardTitleClass}`}
                >
                    {pkg.title}
                </Link>

                <p
                    className={`mt-2 text-sm leading-relaxed text-muted-foreground ${cardSummaryClass}`}
                >
                    {pkg.tagline || pkg.description}
                </p>

                <p className={`mt-2 text-xs text-muted-foreground ${cardLineClass}`}>
                    {destinationsLine || '\u00a0'}
                </p>

                <p className={`mt-1 text-xs text-muted-foreground ${cardLineClass}`}>
                    {inclusionLine || '\u00a0'}
                </p>

                <div className={`${cardFooterClass} border-t border-border/80`}>
                    <p className={cardFooterPrimaryClass}>{pkg.priceEstimate}</p>
                    <div className={cardFooterActionsClass}>
                        <Link
                            href={packageShowHref(pkg.slug)}
                            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            {t('buttons.view')}
                        </Link>
                        <button
                            type="button"
                            onClick={() => onRequest(pkg)}
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
