import { Link, router } from '@inertiajs/react';
import { RotateCcw, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

import { CatalogSearchSortBar } from '@/components/public/CatalogSearchSortBar';
import {
    openCustomTourRequest,
    openSeasonalPackageRequest,
} from '@/components/public/CustomTourRequestHost';
import { FadeIn, RevealItem, RevealStagger } from '@/components/motion/FadeIn';
import { DestinationDiscoveryCard } from '@/components/sections/tours/discovery/DestinationDiscoveryCard';
import { DiscoveryHero } from '@/components/sections/tours/discovery/DiscoveryHero';
import { DiscoveryViewNav } from '@/components/sections/tours/discovery/DiscoveryViewNav';
import {
    filterDestinations,
    filterPackages,
    filterTours,
} from '@/components/sections/tours/discovery/discoveryFilters';
import {
    type DestinationFilterOption,
    type DiscoveryQueryState,
    type DiscoverySort,
    DISCOVERY_PAGE_SIZE,
    buildDiscoverySearch,
    parseDiscoveryQuery,
} from '@/components/sections/tours/discovery/discoveryQuery';
import { PackageDiscoveryCard } from '@/components/sections/tours/discovery/PackageDiscoveryCard';
import { TourDiscoveryCard } from '@/components/sections/tours/discovery/TourDiscoveryCard';
import { TourInquiryModal } from '@/components/sections/tours/TourInquiryModal';
import { useTranslations } from '@/hooks/use-translations';
import type { Destination } from '@/types/destinations';
import type { TourFilterFieldOptions } from '@/types/tourFilterOptions';
import type { InquiryFormData, Tour, TourPackage } from '@/types/tours';

interface ToursDiscoveryLandingProps {
    view: 'tours' | 'packages' | 'destinations';
    tours?: Tour[];
    packages?: TourPackage[];
    destinations?: Destination[];
    filterOptions?: TourFilterFieldOptions;
    destinationFilters?: DestinationFilterOption[];
    heroImage?: string | null;
}

export function ToursDiscoveryLanding({
    view,
    tours = [],
    packages = [],
    destinations = [],
    heroImage = null,
}: ToursDiscoveryLandingProps) {
    const { t } = useTranslations();
    const [, startTransition] = useTransition();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [inquiryOpen, setInquiryOpen] = useState(false);
    const [inquiryInitialData, setInquiryInitialData] = useState<InquiryFormData>({
        tourTitle: '',
        preferredDate: '',
        travelerCount: '2',
    });

    const [state, setState] = useState<DiscoveryQueryState>(() => {
        if (typeof window === 'undefined') {
            return {
                view,
                q: '',
                destination: 'all',
                region: 'all',
                style: 'all',
                difficulty: 'all',
                duration: 'all',
                sort: 'newest',
                page: 1,
            };
        }

        return { ...parseDiscoveryQuery(window.location.search), view };
    });

    const [draftQ, setDraftQ] = useState(state.q);

    useEffect(() => {
        const next = parseDiscoveryQuery(window.location.search);
        setState({ ...next, view });
        setDraftQ(next.q);
    }, [view]);

    useEffect(() => {
        if (window.location.hash !== '#packages') {
            return;
        }

        if (view !== 'packages') {
            router.visit('/tours?view=packages', { replace: true });
        }
    }, [view]);

    useEffect(() => {
        const handlePopState = () => {
            const next = parseDiscoveryQuery(window.location.search);
            setState(next);
            setDraftQ(next.q);
        };

        window.addEventListener('popstate', handlePopState);

        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        const handle = window.setTimeout(() => {
            if (draftQ === state.q) {
                return;
            }

            commitState({ ...state, q: draftQ, page: 1 }, { replace: true });
        }, 300);

        return () => window.clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally sync draft search only
    }, [draftQ]);

    const commitState = (
        next: DiscoveryQueryState,
        options?: { replace?: boolean },
    ) => {
        startTransition(() => {
            setState(next);
            setDraftQ(next.q);
        });

        const href = buildDiscoverySearch(next);
        const method = options?.replace ? 'replaceState' : 'pushState';
        window.history[method](null, '', href);
    };

    const clearSearch = () => {
        commitState({ ...state, q: '', page: 1 }, { replace: true });
    };

    const filteredTours = useMemo(() => filterTours(tours, state), [tours, state]);
    const filteredPackages = useMemo(() => filterPackages(packages, state), [packages, state]);
    const filteredDestinations = useMemo(
        () => filterDestinations(destinations, state),
        [destinations, state],
    );

    const results =
        view === 'packages'
            ? filteredPackages
            : view === 'destinations'
              ? filteredDestinations
              : filteredTours;

    const visibleResults = results.slice(0, state.page * DISCOVERY_PAGE_SIZE);
    const hasMore = visibleResults.length < results.length;
    const hasActiveSearch = state.q.trim() !== '';

    const sortOptions = useMemo(() => {
        const options = [
            { value: 'newest', label: t('toursPage.filters.sortNewest') },
            { value: 'title', label: t('toursPage.filters.sortTitle') },
        ];

        if (view !== 'destinations') {
            options.push(
                { value: 'duration-asc', label: t('toursPage.filters.sortDurationAsc') },
                { value: 'duration-desc', label: t('toursPage.filters.sortDurationDesc') },
            );
        }

        return options;
    }, [t, view]);

    const searchPlaceholder =
        view === 'destinations'
            ? t('destinationsPage.grid.searchPlaceholder')
            : view === 'packages'
              ? t('toursPage.packages.searchPlaceholder')
              : t('toursPage.catalog.searchPlaceholder');

    const searchAriaLabel =
        view === 'destinations'
            ? t('destinationsPage.grid.searchAria')
            : t('toursPage.catalog.searchAria');

    const openInquiryForTour = (tour: Tour) => {
        setInquiryInitialData({
            tourTitle: tour.title,
            preferredDate: '',
            travelerCount: '2',
        });
        setInquiryOpen(true);
    };

    const openInquiryForPackage = (pkg: TourPackage) => {
        openSeasonalPackageRequest(pkg.title, pkg.priceEstimate);
    };

    return (
        <div className="w-full">
            <DiscoveryHero imageUrl={heroImage} />
            <DiscoveryViewNav view={view} />

            <section
                id={view === 'packages' ? 'packages' : 'tour-catalog'}
                className="scroll-mt-28 bg-background py-8 sm:py-10"
            >
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <FadeIn>
                        <CatalogSearchSortBar
                            searchInputRef={searchInputRef}
                            searchValue={draftQ}
                            onSearchChange={setDraftQ}
                            searchPlaceholder={searchPlaceholder}
                            searchAriaLabel={searchAriaLabel}
                            sortValue={state.sort}
                            onSortChange={(value) =>
                                commitState(
                                    {
                                        ...state,
                                        sort: value as DiscoverySort,
                                        page: 1,
                                    },
                                    { replace: true },
                                )
                            }
                            sortOptions={sortOptions}
                            resultsLabel={t('toursPage.catalog.resultsCount', {
                                count: results.length,
                            })}
                        />

                        {visibleResults.length > 0 ? (
                            <RevealStagger className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {view === 'tours'
                                    ? (visibleResults as Tour[]).map((tour, index) => (
                                          <RevealItem key={tour.id} className="h-full">
                                              <TourDiscoveryCard
                                                  tour={tour}
                                                  onRequest={openInquiryForTour}
                                                  priority={index < 3}
                                              />
                                          </RevealItem>
                                      ))
                                    : null}

                                {view === 'packages'
                                    ? (visibleResults as TourPackage[]).map((pkg, index) => (
                                          <RevealItem key={pkg.id} className="h-full">
                                              <PackageDiscoveryCard
                                                  pkg={pkg}
                                                  onRequest={openInquiryForPackage}
                                                  priority={index < 3}
                                              />
                                          </RevealItem>
                                      ))
                                    : null}

                                {view === 'destinations'
                                    ? (visibleResults as Destination[]).map((destination, index) => (
                                          <RevealItem key={destination.id} className="h-full">
                                              <DestinationDiscoveryCard
                                                  destination={destination}
                                                  priority={index < 3}
                                              />
                                          </RevealItem>
                                      ))
                                    : null}
                            </RevealStagger>
                        ) : (
                            <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
                                <Search className="mx-auto size-8 text-muted-foreground" aria-hidden />
                                <h2 className="font-heading mt-3 text-lg font-semibold text-foreground">
                                    {view === 'destinations'
                                        ? t('destinationsPage.grid.noResultsTitle')
                                        : view === 'packages'
                                          ? t('toursPage.packages.noResultsTitle')
                                          : t('toursPage.catalog.noResultsTitle')}
                                </h2>
                                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                                    {t('toursPage.catalog.noResultsDescription')}
                                </p>
                                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                                    {hasActiveSearch ? (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                        >
                                            <RotateCcw className="size-4" aria-hidden />
                                            {t('common.resetFilters')}
                                        </button>
                                    ) : null}
                                    <button
                                        type="button"
                                        onClick={() => openCustomTourRequest()}
                                        className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                    >
                                        {t('buttons.sendTripInquiry')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {hasMore ? (
                            <div className="mt-8 flex justify-center">
                                <button
                                    type="button"
                                    onClick={() =>
                                        commitState({ ...state, page: state.page + 1 }, { replace: true })
                                    }
                                    className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                >
                                    {t('toursPage.catalog.loadMore')}
                                </button>
                            </div>
                        ) : null}
                    </FadeIn>
                </div>
            </section>

            <TourInquiryModal
                isOpen={inquiryOpen}
                onClose={() => setInquiryOpen(false)}
                initialData={inquiryInitialData}
            />
        </div>
    );
}
