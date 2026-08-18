import { Link } from '@inertiajs/react';
import { ArrowRight, MapPin, RotateCcw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { destinationShowHref } from '@/components/public/navigation';
import { FadeIn } from '@/components/motion/FadeIn';
import { SpotlightCard } from '@/components/react-bits/SpotlightCard/SpotlightCard';
import {
    allDestinations,
    getDestinationRegions,
} from '@/data/destinationsData';
import { getToursForDestination } from '@/data/destinationTours';
import type { Destination } from '@/types/destinations';

function DestinationCard({
    destination,
    featured = false,
    delay = 0,
}: {
    destination: Destination;
    featured?: boolean;
    delay?: number;
}) {
    const relatedTourCount = getToursForDestination(destination).length;

    if (featured) {
        return (
            <FadeIn delay={delay}>
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
                            <span className="absolute left-3 top-3 rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                                {destination.badge}
                            </span>
                        ) : null}
                        <p className="absolute inset-x-4 bottom-4 font-heading text-xl font-semibold text-white drop-shadow">
                            {destination.name}
                        </p>
                    </Link>
                    <div className="flex flex-1 flex-col p-5 text-start">
                        <p className="text-xs font-medium text-secondary">
                            {destination.region}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                            {destination.tagline}
                        </p>
                        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                            <span className="text-xs text-muted-foreground">
                                {relatedTourCount} related tour
                                {relatedTourCount === 1 ? '' : 's'}
                            </span>
                            <Link
                                href={destinationShowHref(destination.slug)}
                                className="inline-flex items-center gap-1 text-sm font-semibold text-secondary transition-colors hover:text-foreground"
                            >
                                Explore
                                <ArrowRight className="size-4" aria-hidden />
                            </Link>
                        </div>
                    </div>
                </SpotlightCard>
            </FadeIn>
        );
    }

    return (
        <FadeIn delay={delay}>
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
                    <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
                        {destination.region}
                    </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-heading text-base font-semibold text-foreground">
                        {destination.name}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {destination.tagline}
                    </p>
                    <p className="mt-3 flex items-center gap-1 text-xs font-medium text-secondary">
                        <span>View destination</span>
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </p>
                </div>
            </Link>
        </FadeIn>
    );
}

export function DestinationsGridSection() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('all');

    const regions = useMemo(
        () => [
            { value: 'all', label: 'All regions' },
            ...getDestinationRegions().map((region) => ({
                value: region,
                label: region,
            })),
        ],
        [],
    );

    const featuredDestinations = useMemo(
        () => allDestinations.filter((destination) => destination.isFeatured),
        [],
    );

    const filteredDestinations = useMemo(() => {
        return allDestinations.filter((destination) => {
            if (searchQuery.trim()) {
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

                if (!haystack.includes(query)) {
                    return false;
                }
            }

            if (
                selectedRegion !== 'all' &&
                destination.region !== selectedRegion
            ) {
                return false;
            }

            return true;
        });
    }, [searchQuery, selectedRegion]);

    const gridDestinations = filteredDestinations.filter(
        (destination) => !destination.isFeatured || selectedRegion !== 'all' || searchQuery.trim() !== '',
    );

    const showFeatured =
        selectedRegion === 'all' &&
        searchQuery.trim() === '' &&
        featuredDestinations.length > 0;

    const hasActiveFilters =
        searchQuery.trim() !== '' || selectedRegion !== 'all';

    return (
        <section id="destination-grid" className="bg-background py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="flex flex-col gap-2 text-start sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                                Regions
                            </p>
                            <h2 className="font-heading mt-1.5 text-2xl font-semibold text-foreground sm:text-3xl">
                                Where we guide
                            </h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {filteredDestinations.length} of{' '}
                            {allDestinations.length} destinations
                        </p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.05} className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden
                        />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search destinations…"
                            aria-label="Search destinations"
                            className="w-full rounded-full border border-border bg-surface py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                        />
                    </div>
                    <select
                        value={selectedRegion}
                        onChange={(event) => setSelectedRegion(event.target.value)}
                        aria-label="Region"
                        className="rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
                    >
                        {regions.map((region) => (
                            <option key={region.value} value={region.value}>
                                {region.label}
                            </option>
                        ))}
                    </select>
                    {hasActiveFilters ? (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedRegion('all');
                            }}
                            className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-secondary hover:underline"
                        >
                            <RotateCcw className="size-3.5" aria-hidden />
                            Clear
                        </button>
                    ) : null}
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
                        className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-4 ${showFeatured ? 'mt-5' : 'mt-8'}`}
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
                            No destinations found
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                            Try a different search or clear the filters.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
