import { Link } from '@inertiajs/react';
import { ArrowRight, MapPin, RotateCcw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { tourShowHref } from '@/components/public/navigation';
import { FadeIn, RevealItem, RevealStagger } from '@/components/motion/FadeIn';
import { TourOfferBadges } from '@/components/sections/tours/TourOfferBadges';
import { useTranslations } from '@/hooks/use-translations';
import type { TourFilterFieldOptions } from '@/types/tourFilterOptions';
import type { Tour } from '@/types/tours';

interface ToursGridSectionProps {
    tours: Tour[];
    filterOptions: TourFilterFieldOptions;
    onSelectTour: (tour: Tour) => void;
}

function toFilterChoices(
    values: readonly string[],
    allLabel: string,
): { value: string; label: string }[] {
    return [
        { value: 'all', label: allLabel },
        ...values.map((value) => ({ value, label: value })),
    ];
}

export function ToursGridSection({
    tours,
    filterOptions,
    onSelectTour,
}: ToursGridSectionProps) {
    const { t } = useTranslations();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('all');
    const [selectedStyle, setSelectedStyle] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [selectedDuration, setSelectedDuration] = useState('all');

    const destinations = useMemo(
        () => toFilterChoices(filterOptions.regions, t('toursPage.catalog.allRegions')),
        [filterOptions.regions, t],
    );

    const travelStyles = useMemo(
        () => toFilterChoices(filterOptions.travelStyles, t('toursPage.catalog.allStyles')),
        [filterOptions.travelStyles, t],
    );

    const difficulties = useMemo(
        () => toFilterChoices(filterOptions.difficulties, t('toursPage.catalog.allDifficulties')),
        [filterOptions.difficulties, t],
    );

    const durations = useMemo(
        () => [
            { value: 'all', label: t('toursPage.catalog.anyLength') },
            { value: 'short', label: t('toursPage.catalog.upTo5Days') },
            { value: 'medium', label: t('toursPage.catalog.days6to8') },
            { value: 'long', label: t('toursPage.catalog.days9Plus') },
        ],
        [t],
    );

    const filteredTours = useMemo(() => {
        return tours.filter((tour) => {
            if (searchQuery.trim()) {
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

                if (!haystack.includes(query)) return false;
            }

            if (selectedDestination !== 'all' && tour.region !== selectedDestination) {
                return false;
            }

            if (selectedStyle !== 'all' && tour.travelStyle !== selectedStyle) {
                return false;
            }

            if (selectedDifficulty !== 'all' && tour.difficulty !== selectedDifficulty) {
                return false;
            }

            if (selectedDuration === 'short' && tour.durationDays > 5) return false;
            if (
                selectedDuration === 'medium' &&
                (tour.durationDays < 6 || tour.durationDays > 8)
            )
                return false;
            if (selectedDuration === 'long' && tour.durationDays < 9) return false;

            return true;
        });
    }, [searchQuery, selectedDestination, selectedStyle, selectedDifficulty, selectedDuration, tours]);

    const hasActiveFilters =
        searchQuery.trim() !== '' ||
        selectedDestination !== 'all' ||
        selectedStyle !== 'all' ||
        selectedDifficulty !== 'all' ||
        selectedDuration !== 'all';

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedDestination('all');
        setSelectedStyle('all');
        setSelectedDifficulty('all');
        setSelectedDuration('all');
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

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden
                        />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('toursPage.catalog.searchPlaceholder')}
                            className="w-full rounded-full border border-border bg-surface py-2.5 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                            aria-label={t('toursPage.catalog.searchAria')}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={selectedDestination}
                            onChange={(e) => setSelectedDestination(e.target.value)}
                            aria-label={t('common.region')}
                            className="rounded-full border border-border bg-surface px-3 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                        >
                            {destinations.map((d) => (
                                <option key={d.value} value={d.value}>
                                    {d.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedStyle}
                            onChange={(e) => setSelectedStyle(e.target.value)}
                            aria-label={t('toursPage.catalog.travelStyle')}
                            className="rounded-full border border-border bg-surface px-3 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                        >
                            {travelStyles.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            aria-label={t('common.difficulty')}
                            className="rounded-full border border-border bg-surface px-3 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                        >
                            {difficulties.map((difficulty) => (
                                <option key={difficulty.value} value={difficulty.value}>
                                    {difficulty.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedDuration}
                            onChange={(e) => setSelectedDuration(e.target.value)}
                            aria-label={t('common.duration')}
                            className="rounded-full border border-border bg-surface px-3 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                        >
                            {durations.map((dur) => (
                                <option key={dur.value} value={dur.value}>
                                    {dur.label}
                                </option>
                            ))}
                        </select>
                        {hasActiveFilters ? (
                            <button
                                type="button"
                                onClick={clearAllFilters}
                                className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-secondary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                                <RotateCcw className="size-3.5" aria-hidden />
                                {t('common.clear')}
                            </button>
                        ) : null}
                    </div>
                </div>

                {filteredTours.length > 0 ? (
                    <RevealStagger className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {filteredTours.map((tour) => (
                            <RevealItem key={tour.id}>
                            <article
                                className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface text-start shadow-sm transition-shadow hover:shadow-md"
                            >
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
                                        className="font-heading text-sm font-semibold leading-snug text-foreground line-clamp-2 hover:text-secondary"
                                    >
                                        {tour.title}
                                    </Link>
                                    <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                                        <MapPin className="size-3 shrink-0 text-secondary" aria-hidden />
                                        <span className="truncate">{tour.region}</span>
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                                        {tour.description}
                                    </p>

                                    <div className="mt-4 flex gap-2">
                                        <Link
                                            href={tourShowHref(tour.slug)}
                                            className="flex-1 rounded-full border border-border bg-surface px-3 py-2 text-center text-xs font-semibold text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                        >
                                            {t('buttons.view')}
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => onSelectTour(tour)}
                                            className="inline-flex items-center justify-center gap-1 rounded-full bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
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
                        <Search
                            className="mx-auto size-8 text-muted-foreground"
                            aria-hidden
                        />
                        <h3 className="font-heading mt-3 text-lg font-semibold text-foreground">
                            {t('toursPage.catalog.noResultsTitle')}
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                            {t('toursPage.catalog.noResultsDescription')}
                        </p>
                        <button
                            type="button"
                            onClick={clearAllFilters}
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
