import { stripHtml } from '@/lib/richText';
import type {
    DepartureStatus,
    Tour,
    TourDifficulty,
    TourPackage,
    TourTravelStyle,
} from '@/types/tours';

export type TourFormStatus = 'Published' | 'Draft';
export type TourListingType = 'tour' | 'package';

export type TourRegion =
    | 'Central Highlands'
    | 'Eastern & Capital'
    | 'Western Silk Road'
    | 'Northern Region'
    | 'Pamir & Badakhshan'
    | 'Multiple Regions'
    | 'Southern Plains';

export interface TourFormValues {
    listingType: TourListingType;
    title: string;
    tagline: string;
    summary: string;
    destination: string;
    region: TourRegion;
    durationDays: number;
    travelStyle: TourTravelStyle;
    difficulty: TourDifficulty;
    badge: string;
    image: string;
    content: string;
    highlightsText: string;
    keyDestinationsText: string;
    includedServicesText: string;
    nextDepartureDate: string;
    nextDepartureStatus: DepartureStatus;
    estimatedStartingPrice: string;
    priceEstimate: string;
    idealFor: string;
    isPopular: boolean;
    status: TourFormStatus;
}

export const tourRegionOptions: readonly TourRegion[] = [
    'Central Highlands',
    'Eastern & Capital',
    'Western Silk Road',
    'Northern Region',
    'Pamir & Badakhshan',
    'Multiple Regions',
    'Southern Plains',
] as const;

export const tourTravelStyleOptions: readonly TourTravelStyle[] = [
    'Cultural & Heritage',
    'Adventure & Trekking',
    'Photography Focus',
    'Silk Road History',
    'Small Group Expedition',
] as const;

export const tourDifficultyOptions: readonly TourDifficulty[] = [
    'Easy',
    'Moderate',
    'Demanding',
    'Expedition',
] as const;

export const departureStatusOptions: readonly DepartureStatus[] = [
    'Guaranteed',
    'Limited Availability',
    'Open for Inquiries',
    'Almost Full',
    'On Request',
] as const;

export const tourListingTypeOptions: readonly { value: TourListingType; label: string }[] = [
    { value: 'tour', label: 'Tour itinerary' },
    { value: 'package', label: 'Travel package' },
] as const;

export function createEmptyTourFormValues(): TourFormValues {
    return {
        listingType: 'tour',
        title: '',
        tagline: '',
        summary: '',
        destination: '',
        region: 'Central Highlands',
        durationDays: 7,
        travelStyle: 'Cultural & Heritage',
        difficulty: 'Moderate',
        badge: '',
        image: '',
        content: '',
        highlightsText: '',
        keyDestinationsText: '',
        includedServicesText: '',
        nextDepartureDate: 'On request',
        nextDepartureStatus: 'Open for Inquiries',
        estimatedStartingPrice: 'Custom inquiry basis',
        priceEstimate: 'Custom quotation',
        idealFor: '',
        isPopular: false,
        status: 'Draft',
    };
}

export function slugifyTourTitle(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function escapeHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}

export function splitMultilineText(value: string): string[] {
    return value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
}

export function tourLegacyToHtml(tour: Tour): string {
    const parts: string[] = [];

    if (tour.description.trim()) {
        parts.push(`<p>${escapeHtml(tour.description)}</p>`);
    }

    if (tour.highlights.length > 0) {
        parts.push('<h2>Route highlights</h2><ul>');
        tour.highlights.forEach((highlight) => {
            parts.push(`<li>${escapeHtml(highlight)}</li>`);
        });
        parts.push('</ul>');
    }

    if (tour.itineraryOverview.length > 0) {
        parts.push('<h2>Itinerary overview</h2>');
        tour.itineraryOverview.forEach((day) => {
            parts.push(`<h2>${escapeHtml(day.day)}: ${escapeHtml(day.title)}</h2>`);
            parts.push(`<p>${escapeHtml(day.summary)}</p>`);
        });
    }

    if (tour.inclusions.length > 0) {
        parts.push('<h2>What is included</h2><ul>');
        tour.inclusions.forEach((inclusion) => {
            parts.push(`<li>${escapeHtml(inclusion)}</li>`);
        });
        parts.push('</ul>');
    }

    return parts.join('');
}

export function resolveTourContent(tour: Tour): string {
    if (tour.content?.trim()) {
        return tour.content;
    }

    return tourLegacyToHtml(tour);
}

export function tourToFormValues(tour: Tour, status: TourFormStatus): TourFormValues {
    return {
        listingType: 'tour',
        title: tour.title,
        tagline: '',
        summary: tour.description,
        destination: tour.destination,
        region: tour.region as TourRegion,
        durationDays: tour.durationDays,
        travelStyle: tour.travelStyle,
        difficulty: tour.difficulty,
        badge: tour.badge ?? '',
        image: tour.image,
        content: resolveTourContent(tour),
        highlightsText: tour.highlights.join('\n'),
        keyDestinationsText: '',
        includedServicesText: tour.inclusions.join('\n'),
        nextDepartureDate: tour.nextDeparture.date,
        nextDepartureStatus: tour.nextDeparture.status,
        estimatedStartingPrice: tour.estimatedStartingPrice,
        priceEstimate: tour.estimatedStartingPrice,
        idealFor: `${tour.groupSize} · ${tour.difficulty}`,
        isPopular: false,
        status,
    };
}

export function packageToFormValues(
    pkg: TourPackage,
    status: TourFormStatus,
): TourFormValues {
    return {
        listingType: 'package',
        title: pkg.title,
        tagline: pkg.tagline,
        summary: pkg.description,
        destination: pkg.keyDestinations[0] ?? '',
        region: 'Multiple Regions',
        durationDays: pkg.durationDays,
        travelStyle: 'Cultural & Heritage',
        difficulty: 'Moderate',
        badge: pkg.badge,
        image: pkg.image,
        content: '',
        highlightsText: pkg.featuredPerks.join('\n'),
        keyDestinationsText: pkg.keyDestinations.join('\n'),
        includedServicesText: pkg.includedServices.join('\n'),
        nextDepartureDate: 'On request',
        nextDepartureStatus: 'Open for Inquiries',
        estimatedStartingPrice: pkg.priceEstimate,
        priceEstimate: pkg.priceEstimate,
        idealFor: pkg.idealFor,
        isPopular: pkg.isPopular ?? false,
        status,
    };
}

export type TourFormField =
    | 'title'
    | 'tagline'
    | 'summary'
    | 'destination'
    | 'durationDays'
    | 'image'
    | 'content'
    | 'highlightsText'
    | 'keyDestinationsText'
    | 'includedServicesText'
    | 'idealFor'
    | 'priceEstimate';

export type TourFormErrors = Partial<Record<TourFormField, string>>;

export function isTourContentEmpty(html: string): boolean {
    return stripHtml(html).length === 0;
}

export function validateTourFormValues(
    values: TourFormValues,
    hasImage: boolean,
): TourFormErrors {
    const errors: TourFormErrors = {};

    if (!values.title.trim()) {
        errors.title = 'Required';
    }

    if (values.listingType === 'package' && !values.tagline.trim()) {
        errors.tagline = 'Required for packages';
    }

    if (!values.summary.trim()) {
        errors.summary = 'Required';
    }

    if (!values.destination.trim()) {
        errors.destination = 'Required for search and filters';
    }

    if (values.listingType === 'tour' && values.durationDays < 1) {
        errors.durationDays = 'Enter at least 1 day';
    }

    if (values.listingType === 'package' && !values.idealFor.trim()) {
        errors.idealFor = 'Required for packages';
    }

    if (values.listingType === 'package' && !values.priceEstimate.trim()) {
        errors.priceEstimate = 'Required for packages';
    }

    if (!hasImage) {
        errors.image = 'Required';
    }

    if (values.listingType === 'tour' && isTourContentEmpty(values.content)) {
        errors.content = 'Required';
    }

    if (!values.highlightsText.trim()) {
        errors.highlightsText = 'Add at least one highlight';
    }

    if (values.listingType === 'package' && !values.keyDestinationsText.trim()) {
        errors.keyDestinationsText = 'Add at least one destination';
    }

    if (values.listingType === 'package' && !values.includedServicesText.trim()) {
        errors.includedServicesText = 'Add at least one included service';
    }

    return errors;
}

export function formatTourDuration(durationDays: number): string {
    if (durationDays < 1) {
        return 'Custom duration';
    }

    const nights = Math.max(durationDays - 1, 0);

    return `${durationDays} Day${durationDays === 1 ? '' : 's'} / ${nights} Night${nights === 1 ? '' : 's'}`;
}

export function listingTypeLabel(listingType: TourListingType): string {
    return listingType === 'package' ? 'Package' : 'Tour';
}
