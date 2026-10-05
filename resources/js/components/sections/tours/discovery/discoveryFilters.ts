import type { Destination } from '@/types/destinations';
import type { Tour, TourPackage } from '@/types/tours';

import {
    type DiscoveryQueryState,
    type DiscoverySort,
} from '@/components/sections/tours/discovery/discoveryQuery';

function matchesDuration(days: number, duration: string): boolean {
    if (duration === 'short') {
        return days <= 5;
    }
    if (duration === 'medium') {
        return days >= 6 && days <= 8;
    }
    if (duration === 'long') {
        return days >= 9;
    }

    return true;
}

function sortByTitle<T extends { title?: string; name?: string }>(
    items: T[],
    direction: 'asc' | 'desc' = 'asc',
): T[] {
    return [...items].sort((a, b) => {
        const left = (a.title ?? a.name ?? '').toLocaleLowerCase();
        const right = (b.title ?? b.name ?? '').toLocaleLowerCase();
        const result = left.localeCompare(right);

        return direction === 'asc' ? result : -result;
    });
}

function sortTours(tours: Tour[], sort: DiscoverySort): Tour[] {
    if (sort === 'title') {
        return sortByTitle(tours);
    }

    if (sort === 'duration-asc') {
        return [...tours].sort((a, b) => a.durationDays - b.durationDays);
    }

    if (sort === 'duration-desc') {
        return [...tours].sort((a, b) => b.durationDays - a.durationDays);
    }

    return tours;
}

function sortPackages(packages: TourPackage[], sort: DiscoverySort): TourPackage[] {
    if (sort === 'title') {
        return sortByTitle(packages);
    }

    if (sort === 'duration-asc') {
        return [...packages].sort((a, b) => a.durationDays - b.durationDays);
    }

    if (sort === 'duration-desc') {
        return [...packages].sort((a, b) => b.durationDays - a.durationDays);
    }

    return packages;
}

function sortDestinations(destinations: Destination[], sort: DiscoverySort): Destination[] {
    if (sort === 'title') {
        return sortByTitle(destinations.map((destination) => ({
            ...destination,
            title: destination.name,
        })));
    }

    return destinations;
}

export function filterTours(tours: Tour[], state: DiscoveryQueryState): Tour[] {
    const filtered = tours.filter((tour) => {
        if (state.q.trim()) {
            const query = state.q.toLowerCase();
            const haystack = [
                tour.title,
                tour.destination,
                tour.region,
                tour.description,
                tour.travelStyle,
                tour.difficulty,
                ...tour.highlights,
            ]
                .join(' ')
                .toLowerCase();

            if (!haystack.includes(query)) {
                return false;
            }
        }

        if (
            state.destination !== 'all' &&
            !(tour.destinationSlugs ?? []).includes(state.destination)
        ) {
            return false;
        }

        if (state.region !== 'all' && (tour.regionValue ?? tour.region) !== state.region) {
            return false;
        }

        if (state.style !== 'all' && (tour.travelStyleValue ?? tour.travelStyle) !== state.style) {
            return false;
        }

        if (state.difficulty !== 'all' && (tour.difficultyValue ?? tour.difficulty) !== state.difficulty) {
            return false;
        }

        if (!matchesDuration(tour.durationDays, state.duration)) {
            return false;
        }

        return true;
    });

    return sortTours(filtered, state.sort);
}

export function filterPackages(packages: TourPackage[], state: DiscoveryQueryState): TourPackage[] {
    const filtered = packages.filter((pkg) => {
        if (!state.q.trim()) {
            return true;
        }

        const query = state.q.toLowerCase();
        const haystack = [
            pkg.title,
            pkg.tagline,
            pkg.description,
            pkg.priceEstimate,
            ...pkg.keyDestinations,
            ...pkg.featuredPerks,
            ...pkg.includedServices,
        ]
            .join(' ')
            .toLowerCase();

        return haystack.includes(query);
    });

    return sortPackages(filtered, state.sort);
}

export function filterDestinations(
    destinations: Destination[],
    state: DiscoveryQueryState,
): Destination[] {
    const filtered = destinations.filter((destination) => {
        if (state.q.trim()) {
            const query = state.q.toLowerCase();
            const haystack = [
                destination.name,
                destination.tagline,
                destination.region,
                destination.description,
            ]
                .join(' ')
                .toLowerCase();

            if (!haystack.includes(query)) {
                return false;
            }
        }

        if (state.region !== 'all' && (destination.regionValue ?? destination.region) !== state.region) {
            return false;
        }

        return true;
    });

    return sortDestinations(filtered, state.sort);
}
