import { ArrowRight, Calendar, MapPin, RotateCcw, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { TourOfferBadges } from '@/components/sections/tours/TourOfferBadges';
import { shortDepartureStatus } from '@/components/sections/tours/tourDisplay';
import { allTours } from '@/data/toursData';
import type { Tour } from '@/types/tours';

interface ToursGridSectionProps {
    onSelectTour: (tour: Tour) => void;
}

export function ToursGridSection({ onSelectTour }: ToursGridSectionProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('all');
    const [selectedStyle, setSelectedStyle] = useState('all');
    const [selectedDuration, setSelectedDuration] = useState('all');
    const [selectedItineraryTour, setSelectedItineraryTour] = useState<Tour | null>(null);

    const destinations = useMemo(
        () => [
            { value: 'all', label: 'All regions' },
            ...Array.from(new Set(allTours.map((t) => t.region))).map((region) => ({
                value: region,
                label: region,
            })),
        ],
        [],
    );

    const travelStyles = [
        { value: 'all', label: 'All styles' },
        { value: 'Cultural & Heritage', label: 'Cultural & heritage' },
        { value: 'Adventure & Trekking', label: 'Adventure & trekking' },
        { value: 'Photography Focus', label: 'Photography' },
        { value: 'Silk Road History', label: 'Silk Road history' },
    ];

    const durations = [
        { value: 'all', label: 'Any length' },
        { value: 'short', label: 'Up to 5 days' },
        { value: 'medium', label: '6–8 days' },
        { value: 'long', label: '9+ days' },
    ];

    const filteredTours = useMemo(() => {
        return allTours.filter((tour) => {
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

            if (selectedDuration === 'short' && tour.durationDays > 5) return false;
            if (
                selectedDuration === 'medium' &&
                (tour.durationDays < 6 || tour.durationDays > 8)
            )
                return false;
            if (selectedDuration === 'long' && tour.durationDays < 9) return false;

            return true;
        });
    }, [searchQuery, selectedDestination, selectedStyle, selectedDuration]);

    const hasActiveFilters =
        searchQuery.trim() !== '' ||
        selectedDestination !== 'all' ||
        selectedStyle !== 'all' ||
        selectedDuration !== 'all';

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedDestination('all');
        setSelectedStyle('all');
        setSelectedDuration('all');
    };

    const getStatusBadgeStyle = (status: string) => {
        switch (status) {
            case 'Guaranteed':
                return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
            case 'Limited Availability':
            case 'Almost Full':
                return 'bg-accent/15 text-accent-foreground';
            default:
                return 'bg-secondary/10 text-secondary';
        }
    };

    return (
        <section id="tour-catalog" className="bg-background py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-2 text-start sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                            Tours
                        </p>
                        <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                            Browse itineraries
                        </h2>
                    </div>
                    <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                        {filteredTours.length} of {allTours.length} journeys.
                        Every tour can be private or small group.
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
                            placeholder="Search tours, places, or themes…"
                            className="w-full rounded-full border border-border bg-surface py-2.5 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                            aria-label="Search tours"
                        />
                        {searchQuery ? (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
                                aria-label="Clear search"
                            >
                                <X className="size-4" aria-hidden />
                            </button>
                        ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={selectedDestination}
                            onChange={(e) => setSelectedDestination(e.target.value)}
                            aria-label="Region"
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
                            aria-label="Travel style"
                            className="rounded-full border border-border bg-surface px-3 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                        >
                            {travelStyles.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedDuration}
                            onChange={(e) => setSelectedDuration(e.target.value)}
                            aria-label="Duration"
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
                                Clear
                            </button>
                        ) : null}
                    </div>
                </div>

                {filteredTours.length > 0 ? (
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {filteredTours.map((tour) => (
                            <article
                                key={tour.id}
                                className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface text-start shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="relative aspect-[3/2] w-full overflow-hidden bg-surface-muted">
                                    <img
                                        src={tour.image}
                                        alt={tour.title}
                                        className="size-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <TourOfferBadges
                                        durationDays={tour.durationDays}
                                        durationLabel={tour.duration}
                                        highlight={tour.badge}
                                    />
                                </div>

                                <div className="flex flex-1 flex-col p-4">
                                    <h3 className="font-heading text-sm font-semibold leading-snug text-foreground line-clamp-2">
                                        {tour.title}
                                    </h3>
                                    <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                                        <MapPin className="size-3 shrink-0 text-secondary" aria-hidden />
                                        <span className="truncate">{tour.region}</span>
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                                        {tour.description}
                                    </p>

                                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3 text-[11px]">
                                        <span className="flex items-center gap-1 text-muted-foreground">
                                            <Calendar className="size-3 shrink-0 text-secondary" aria-hidden />
                                            {tour.nextDeparture.date}
                                        </span>
                                        <span
                                            className={`shrink-0 rounded-md px-1.5 py-0.5 font-medium ${getStatusBadgeStyle(
                                                tour.nextDeparture.status,
                                            )}`}
                                            title={tour.nextDeparture.status}
                                        >
                                            {shortDepartureStatus(tour.nextDeparture.status)}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedItineraryTour(tour)}
                                            className="flex-1 rounded-full border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                        >
                                            Details
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onSelectTour(tour)}
                                            className="inline-flex items-center justify-center gap-1 rounded-full bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground transition-transform hover:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                        >
                                            Request
                                            <ArrowRight className="size-3.5" aria-hidden />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
                        <Search
                            className="mx-auto size-8 text-muted-foreground"
                            aria-hidden
                        />
                        <h3 className="font-heading mt-3 text-lg font-semibold text-foreground">
                            No matching tours
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                            Try a different search or clear the filters.
                        </p>
                        <button
                            type="button"
                            onClick={clearAllFilters}
                            className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            <RotateCcw className="size-4" aria-hidden />
                            Reset filters
                        </button>
                    </div>
                )}
            </div>

            {selectedItineraryTour && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6"
                >
                    <div
                        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl text-start sm:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                                    Day-by-day
                                </span>
                                <h3 className="font-heading mt-1 text-xl font-semibold text-foreground">
                                    {selectedItineraryTour.title}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {selectedItineraryTour.duration} • {selectedItineraryTour.destination}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedItineraryTour(null)}
                                className="rounded-full p-2 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                                aria-label="Close"
                            >
                                <X className="size-5" aria-hidden />
                            </button>
                        </div>

                        <div className="mt-5 space-y-4">
                            {selectedItineraryTour.itineraryOverview.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="relative flex items-start gap-3 border-l border-secondary/25 pl-4"
                                >
                                    <div className="absolute -left-[3.5px] top-1.5 size-1.5 rounded-full bg-secondary" />
                                    <div>
                                        <span className="text-xs font-semibold text-secondary">
                                            {item.day}: {item.title}
                                        </span>
                                        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                                            {item.summary}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 rounded-xl bg-surface-muted p-4 text-xs">
                            <p className="font-semibold text-foreground">Included</p>
                            <ul className="mt-2 grid gap-1 sm:grid-cols-2 text-muted-foreground">
                                {selectedItineraryTour.inclusions.map((inc, i) => (
                                    <li key={i} className="flex items-center gap-1.5">
                                        <span className="size-1 rounded-full bg-secondary" />
                                        <span>{inc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedItineraryTour(null)}
                                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-muted"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const tour = selectedItineraryTour;
                                    setSelectedItineraryTour(null);
                                    onSelectTour(tour);
                                }}
                                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground hover:opacity-95"
                            >
                                Request this tour
                                <ArrowRight className="size-4" aria-hidden />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
