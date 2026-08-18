import {
    destinationShowHref,
    packageShowHref,
    tourShowHref,
} from '@/components/public/navigation';
import {
    allTours,
    getRelatedTourPackages,
    getTourPackageBySlug,
} from '@/data/toursData';
import type { TravelOfferDetail, TravelOfferRelatedItem } from '@/types/travelOffer';
import type { Tour, TourPackage } from '@/types/tours';

export function getTourBySlug(slug: string): Tour | undefined {
    return allTours.find((tour) => tour.slug === slug);
}

export function getRelatedTours(
    slug: string,
    limit = 2,
): readonly Tour[] {
    const current = getTourBySlug(slug);

    if (!current) {
        return [];
    }

    const sameRegion = allTours.filter(
        (tour) => tour.slug !== slug && tour.region === current.region,
    );
    const others = allTours.filter(
        (tour) => tour.slug !== slug && tour.region !== current.region,
    );

    return [...sameRegion, ...others].slice(0, limit);
}

function mapTourToRelatedItem(tour: Tour): TravelOfferRelatedItem {
    return {
        slug: tour.slug,
        title: tour.title,
        tagline: tour.description,
        image: tour.image,
        durationDays: tour.durationDays,
        durationLabel: tour.duration,
        badge: tour.badge,
        priceLabel: tour.estimatedStartingPrice,
        href: tourShowHref(tour.slug),
    };
}

function mapPackageToRelatedItem(pkg: TourPackage): TravelOfferRelatedItem {
    return {
        slug: pkg.slug,
        title: pkg.title,
        tagline: pkg.tagline,
        image: pkg.image,
        durationDays: pkg.durationDays,
        durationLabel: pkg.duration,
        badge: pkg.badge,
        priceLabel: pkg.priceEstimate,
        href: packageShowHref(pkg.slug),
    };
}

export function tourToTravelOffer(tour: Tour): TravelOfferDetail {
    return {
        kind: 'tour',
        slug: tour.slug,
        title: tour.title,
        tagline: `${tour.travelStyle} · ${tour.destination}`,
        image: tour.image,
        durationDays: tour.durationDays,
        durationLabel: tour.duration,
        badge: tour.badge,
        priceLabel: tour.estimatedStartingPrice,
        description: tour.description,
        highlights: tour.highlights,
        journeyOutline: tour.itineraryOverview.map((day) => ({
            phase: day.day,
            title: day.title,
            summary: day.summary,
        })),
        destinations: [tour.destination],
        sidebarIdealFor: `${tour.groupSize} · ${tour.difficulty} · Best ${tour.bestMonths}`,
        inclusions: tour.inclusions,
        breadcrumbs: {
            listLabel: 'Tours',
            listHref: '/tours#tour-catalog',
        },
        labels: {
            request: 'Request this tour',
            back: 'All tours',
            about: 'About this tour',
            highlights: 'Route highlights',
            relatedEyebrow: 'More tours',
            relatedTitle: 'You may also like',
            relatedViewAll: 'View all tours',
        },
        relatedItems: getRelatedTours(tour.slug, 2).map(mapTourToRelatedItem),
        inquiryPreferredDate: tour.nextDeparture.date,
    };
}

export function packageToTravelOffer(pkg: TourPackage): TravelOfferDetail {
    return {
        kind: 'package',
        slug: pkg.slug,
        title: pkg.title,
        tagline: pkg.tagline,
        image: pkg.image,
        durationDays: pkg.durationDays,
        durationLabel: pkg.duration,
        badge: pkg.badge,
        priceLabel: pkg.priceEstimate,
        description: pkg.description,
        highlights: pkg.featuredPerks,
        journeyOutline: pkg.journeyOutline,
        destinations: pkg.keyDestinations,
        sidebarIdealFor: pkg.idealFor,
        inclusions: pkg.includedServices,
        breadcrumbs: {
            listLabel: 'Packages',
            listHref: '/tours#packages',
        },
        labels: {
            request: 'Request this package',
            back: 'All packages',
            about: 'About this package',
            highlights: 'Package highlights',
            relatedEyebrow: 'More packages',
            relatedTitle: 'You may also like',
            relatedViewAll: 'View all packages',
        },
        relatedItems: getRelatedTourPackages(pkg.slug, 2).map(mapPackageToRelatedItem),
    };
}

export function getTravelOfferByTourSlug(slug: string): TravelOfferDetail | undefined {
    const tour = getTourBySlug(slug);

    return tour ? tourToTravelOffer(tour) : undefined;
}

export function getTravelOfferByPackageSlug(
    slug: string,
): TravelOfferDetail | undefined {
    const pkg = getTourPackageBySlug(slug);

    return pkg ? packageToTravelOffer(pkg) : undefined;
}
