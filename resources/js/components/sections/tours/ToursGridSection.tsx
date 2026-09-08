import { Link } from '@inertiajs/react';
import { ArrowRight, MapPin, RotateCcw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CatalogSearchSortBar } from '@/components/public/CatalogSearchSortBar';
import { tourShowHref } from '@/components/public/navigation';
import { FadeIn, RevealItem, RevealStagger } from '@/components/motion/FadeIn';
import { TourOfferBadges } from '@/components/sections/tours/TourOfferBadges';
import { useTranslations } from '@/hooks/use-translations';
import { cardSummaryClass, cardTitleClass } from '@/lib/cardText';
import type { Tour } from '@/types/tours';

type TourSort = 'newest' | 'title' | 'duration-asc' | 'duration-desc';

interface ToursGridSectionProps {
    tours: Tour[];
    onSelectTour: (tour: Tour) => void;
}

export function ToursGridSection({ tours, onSelectTour }: ToursGridSectionProps) {
    const { t } = useTranslations();
    const [searchQuery, setSearchQuery] = useState('');
    const [sort, setSort] = useState<TourSort>('newest');

    const sortOptions = useMemo(
        () => [
            { value: 'newest', label: t('toursPage.filters.sortNewest') },
            { value: 'title', label: t('toursPage.filters.sortTitle') },
            { value: 'duration-asc', label: t('toursPage.filters.sortDurationAsc') },
            { value: 'duration-desc', label: t('toursPage.filters.sortDurationDesc') },
        ],
        [t],
    );

    const filteredTours = useMemo(() => {
        const filtered = tours.filter((tour) => {
            if (!searchQuery.trim()) {
                return true;
            }

            const query = searchQuery.toLowerCase();
            const haystack = [
                tour.title,
                tour.destination,
                tour.region,
                tour.description,
                ...tour.highlights,
            ]
                .join(' ')
                .toLowerCase();

            return haystack.includes(query);
        });

        if (sort === 'title') {
            return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        }

        if (sort === 'duration-asc') {
            return [...filtered].sort((a, b) => a.durationDays - b.durationDays);
        }

        if (sort === 'duration-desc') {
            return [...filtered].sort((a, b) => b.durationDays - a.durationDays);
        }

        return filtered;
    }, [searchQuery, sort, tours]);

    const clearSearch = () => {
        setSearchQuery('');
        setSort('newest');
    };

    return (
        <section id="tour-catalog" className="bg-background py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="flex flex-col gap-2 text-start sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                                {t('toursPage.catalog.eyebrow')}
                            </p>
                            <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                                {t('toursPage.catalog.title')}
                            </h2>
                        </div>
                        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                            {t('toursPage.catalog.countNote', {
                                shown: filteredTours.length,
                                total: tours.length,
                            })}
                        </p>
                    </div>

                    <CatalogSearchSortBar
                        className="mt-6"
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                        searchPlaceholder={t('toursPage.catalog.searchPlaceholder')}
                        searchAriaLabel={t('toursPage.catalog.searchAria')}
                        sortValue={sort}
                        onSortChange={(value) => setSort(value as TourSort)}
                        sortOptions={sortOptions}
                        resultsLabel={t('toursPage.catalog.resultsCount', {
                            count: filteredTours.length,
                        })}
                    />

                    {filteredTours.length > 0 ? (
                        <RevealStagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredTours.map((tour) => (
                                <RevealItem key={tour.id} className="h-full">
                                    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface text-start shadow-sm transition-shadow hover:shadow-md">
                                        <Link
                                            href={tourShowHref(tour.slug)}
                                            className="relative block aspect-[3/2] w-full overflow-hidden bg-surface-muted"
                                        >
                                            <img
                                                src={tour.image}
                                                alt={tour.title}
                                                className="size-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                            <TourOfferBadges
                                                durationDays={tour.durationDays}
                                                durationLabel={tour.duration}
                                                highlight={tour.badge}
                                            />
                                        </Link>

                                        <div className="flex flex-1 flex-col p-4">
                                            <Link
                                                href={tourShowHref(tour.slug)}
                                                className={`font-heading text-sm font-semibold leading-snug text-foreground hover:text-secondary ${cardTitleClass}`}
                                            >
                                                {tour.title}
                                            </Link>
                                            <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                                                <MapPin
                                                    className="size-3 shrink-0 text-secondary"
                                                    aria-hidden
                                                />
                                                <span className="truncate">{tour.region}</span>
                                            </p>
                                            <p
                                                className={`mt-1 text-xs text-muted-foreground ${cardSummaryClass}`}
                                            >
                                                {tour.description}
                                            </p>

                                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/80 pt-4">
                                                <Link
                                                    href={tourShowHref(tour.slug)}
                                                    className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                                >
                                                    {t('buttons.view')}
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => onSelectTour(tour)}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                                >
                                                    {t('buttons.request')}
                                                    <ArrowRight className="size-3.5" aria-hidden />
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                </RevealItem>
                            ))}
                        </RevealStagger>
                    ) : (
                        <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
                            <Search className="mx-auto size-8 text-muted-foreground" aria-hidden />
                            <h3 className="font-heading mt-3 text-lg font-semibold text-foreground">
                                {t('toursPage.catalog.noResultsTitle')}
                            </h3>
                            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                                {t('toursPage.catalog.noResultsDescription')}
                            </p>
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                                <RotateCcw className="size-4" aria-hidden />
                                {t('common.resetFilters')}
                            </button>
                        </div>
                    )}
                </FadeIn>
            </div>
        </section>
    );
}
