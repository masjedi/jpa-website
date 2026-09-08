export type DiscoveryView = 'tours' | 'packages' | 'destinations';

export type DiscoverySort = 'newest' | 'title' | 'duration-asc' | 'duration-desc';

export interface DestinationFilterOption {
    slug: string;
    name: string;
}

export interface DiscoveryQueryState {
    view: DiscoveryView;
    q: string;
    destination: string;
    region: string;
    style: string;
    difficulty: string;
    duration: string;
    sort: DiscoverySort;
    page: number;
}

export const DISCOVERY_PAGE_SIZE = 9;

export function parseDiscoveryView(value: string | null | undefined): DiscoveryView {
    if (value === 'packages' || value === 'destinations') {
        return value;
    }

    return 'tours';
}

export function discoveryViewHref(view: DiscoveryView): string {
    if (view === 'tours') {
        return '/tours';
    }

    return `/tours?view=${view}`;
}

export function toursForDestinationHref(destinationSlug: string): string {
    const params = new URLSearchParams({
        destination: destinationSlug,
    });

    return `/tours?${params.toString()}`;
}

export function parseDiscoveryQuery(search: string): DiscoveryQueryState {
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);

    const sort = params.get('sort');
    const page = Number.parseInt(params.get('page') ?? '1', 10);

    return {
        view: parseDiscoveryView(params.get('view')),
        q: params.get('q')?.trim() ?? '',
        destination: params.get('destination')?.trim() || 'all',
        region: params.get('region')?.trim() || 'all',
        style: params.get('style')?.trim() || 'all',
        difficulty: params.get('difficulty')?.trim() || 'all',
        duration: params.get('duration')?.trim() || 'all',
        sort:
            sort === 'title' ||
            sort === 'duration-asc' ||
            sort === 'duration-desc' ||
            sort === 'newest'
                ? sort
                : 'newest',
        page: Number.isFinite(page) && page > 0 ? page : 1,
    };
}

export function buildDiscoverySearch(
    state: DiscoveryQueryState,
    options?: { omitPage?: boolean },
): string {
    const params = new URLSearchParams();

    if (state.view !== 'tours') {
        params.set('view', state.view);
    }

    if (state.q.trim() !== '') {
        params.set('q', state.q.trim());
    }

    if (state.view === 'tours') {
        if (state.destination !== 'all') {
            params.set('destination', state.destination);
        }
        if (state.region !== 'all') {
            params.set('region', state.region);
        }
        if (state.style !== 'all') {
            params.set('style', state.style);
        }
        if (state.difficulty !== 'all') {
            params.set('difficulty', state.difficulty);
        }
        if (state.duration !== 'all') {
            params.set('duration', state.duration);
        }
    }

    if (state.view === 'destinations' && state.region !== 'all') {
        params.set('region', state.region);
    }

    if (state.sort !== 'newest') {
        params.set('sort', state.sort);
    }

    if (!options?.omitPage && state.page > 1) {
        params.set('page', String(state.page));
    }

    const query = params.toString();

    return query === '' ? '/tours' : `/tours?${query}`;
}

export function countActiveDiscoveryFilters(state: DiscoveryQueryState): number {
    let count = 0;

    if (state.q.trim() !== '') {
        count += 1;
    }

    if (state.view === 'tours') {
        if (state.destination !== 'all') count += 1;
        if (state.region !== 'all') count += 1;
        if (state.style !== 'all') count += 1;
        if (state.difficulty !== 'all') count += 1;
        if (state.duration !== 'all') count += 1;
    }

    if (state.view === 'destinations' && state.region !== 'all') {
        count += 1;
    }

    return count;
}
