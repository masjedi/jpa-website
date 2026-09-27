import { Link } from '@inertiajs/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CatalogSearchSortBar } from '@/components/public/CatalogSearchSortBar';
import { destinationShowHref } from '@/components/public/navigation';
import { FadeIn } from '@/components/motion/FadeIn';
import { SpotlightCard } from '@/components/react-bits/SpotlightCard/SpotlightCard';
import { useTranslations } from '@/hooks/use-translations';
import {
    cardFooterActionsClass,
    cardFooterClass,
    cardFooterMetaClass,
    cardSummaryClass,
    cardTitleClass,
} from '@/lib/cardText';
import type { Destination } from '@/types/destinations';

type DestinationSort = 'newest' | 'title';

function DestinationCard({
    destination,
    featured = false,
    delay = 0,
}: {
    destination: Destination;
    featured?: boolean;
    delay?: number;
}) {
    const { t } = useTranslations();
    const relatedTourCount = destination.linkedToursCount ?? 0;

    if (featured) {
        return (
            <FadeIn delay={delay} className="h-full">
                <SpotlightCard
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md"
                    spotlightColor="rgba(14, 115, 115, 0.16)"
                >
                    <Link
                        href={destinationShowHref(destination.slug)}
                        className="relative block aspect-[16/10] overflow-hidden bg-surface-muted"
                    >
                        <img
                            src={destination.image}
                            alt={destination.name}
                            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                        {destination.badge ? (
                            <span className="absolute start-3 top-3 rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                                {destination.badge}
                            </span>
                        ) : null}
                        <p className="absolute inset-x-4 bottom-4 font-heading text-xl font-semibold text-white line-clamp-2 drop-shadow">
                            {destination.name}
                        </p>
                    </Link>
                    <div className="flex flex-1 flex-col p-5 text-start">
                        <p className="text-xs font-medium text-secondary">
                            {destination.region}
                        </p>
                        <p className={`mt-2 text-sm leading-relaxed text-muted-foreground ${cardSummaryClass}`}>
                            {destination.tagline}
                        </p>
                        <div className={cardFooterClass}>
                            <span className={cardFooterMetaClass}>
                                {relatedTourCount}{' '}
                                {relatedTourCount === 1
                                    ? t('destinationsPage.grid.relatedTour')
                                    : t('destinationsPage.grid.relatedTours')}
                            </span>
                            <div className={cardFooterActionsClass}>
                                <Link
                                    href={destinationShowHref(destination.slug)}
                                    className="inline-flex items-center gap-1 text-sm font-semibold text-secondary transition-colors hover:text-foreground"
                                >
                                    {t('buttons.explore')}
                                    <ArrowRight className="size-4" aria-hidden />
                                </Link>
                            </div>
                        </div>
                    </div>
                </SpotlightCard>
            </FadeIn>
        );
    }

    return (
        <FadeIn delay={delay} className="h-full">
            <Link
                href={destinationShowHref(destination.slug)}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface text-start shadow-sm transition-shadow hover:shadow-md"
            >
                <div className="relative aspect-[3/2] overflow-hidden bg-surface-muted">
                    <img
                        src={destination.image}
                        alt={destination.name}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    <span className="absolute bottom-3 start-3 rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
                        {destination.region}
                    </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                    <h3 className={`font-heading text-base font-semibold text-foreground ${cardTitleClass}`}>
                        {destination.name}
                    </h3>
                    <p className={`mt-1 text-xs leading-relaxed text-muted-foreground ${cardSummaryClass}`}>
                        {destination.tagline}
                    </p>
                    <p className="mt-auto flex items-center gap-1 pt-3 text-xs font-medium text-secondary">
                        <span>{t('buttons.viewDestination')}</span>
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180" />
                    </p>
                </div>
            </Link>
        </FadeIn>
    );
}

interface DestinationsGridSectionProps {
    destinations: readonly Destination[];
}

export function DestinationsGridSection({ destinations }: DestinationsGridSectionProps) {
    const { t } = useTranslations();
    const [searchQuery, setSearchQuery] = useState('');
    const [sort, setSort] = useState<DestinationSort>('newest');

    const sortOptions = useMemo(
        () => [
            { value: 'newest', label: t('toursPage.filters.sortNewest') },
            { value: 'title', label: t('toursPage.filters.sortTitle') },
        ],
        [t],
    );

    const featuredDestinations = useMemo(
        () => destinations.filter((destination) => destination.isFeatured),
        [destinations],
    );

    const filteredDestinations = useMemo(() => {
        const filtered = destinations.filter((destination) => {
            if (!searchQuery.trim()) {
                return true;
            }

            const query = searchQuery.toLowerCase();
            const haystack = [
                destination.name,
                destination.tagline,
                destination.region,
                destination.description,
                ...destination.highlights,
            ]
                .join(' ')
                .toLowerCase();

            return haystack.includes(query);
        });

        if (sort === 'title') {
            return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        }

        return filtered;
    }, [destinations, searchQuery, sort]);

    const gridDestinations = filteredDestinations.filter(
        (destination) => !destination.isFeatured || searchQuery.trim() !== '',
    );

    const showFeatured = searchQuery.trim() === '' && featuredDestinations.length > 0;

    return (
        <section id="destination-grid" className="bg-background py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="flex flex-col gap-2 text-start sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                                {t('destinationsPage.grid.eyebrow')}
                            </p>
                            <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                                {t('destinationsPage.grid.title')}
                            </h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t('destinationsPage.grid.countNote', {
                                shown: filteredDestinations.length,
                                total: destinations.length,
                            })}
                        </p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.05} className="mt-6">
                    <CatalogSearchSortBar
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                        searchPlaceholder={t('destinationsPage.grid.searchPlaceholder')}
                        searchAriaLabel={t('destinationsPage.grid.searchAria')}
                        sortValue={sort}
                        onSortChange={(value) => setSort(value as DestinationSort)}
                        sortOptions={sortOptions}
                        resultsLabel={t('toursPage.catalog.resultsCount', {
                            count: filteredDestinations.length,
                        })}
                    />
                </FadeIn>

                {showFeatured ? (
                    <div className="mt-8 grid gap-5 lg:grid-cols-2">
                        {featuredDestinations.map((destination, index) => (
                            <DestinationCard
                                key={destination.id}
                                destination={destination}
                                featured
                                delay={index * 0.06}
                            />
                        ))}
                    </div>
                ) : null}

                {gridDestinations.length > 0 ? (
                    <div
                        className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${showFeatured ? 'mt-5' : 'mt-8'}`}
                    >
                        {gridDestinations.map((destination, index) => (
                            <DestinationCard
                                key={destination.id}
                                destination={destination}
                                delay={index * 0.04}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
                        <MapPin
                            className="mx-auto size-8 text-muted-foreground"
                            aria-hidden
                        />
                        <h3 className="font-heading mt-3 text-lg font-semibold text-foreground">
                            {t('destinationsPage.grid.noResultsTitle')}
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                            {destinations.length === 0
                                ? t('destinationsPage.grid.noResultsEmpty')
                                : t('destinationsPage.grid.noResultsFilter')}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
