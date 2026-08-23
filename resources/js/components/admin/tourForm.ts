import { normalizeRichHtml, stripHtml } from '@/lib/richText';
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

function asFormText(value: string | null | undefined): string {
    return value ?? '';
}

function linesToFormText(values: readonly string[] | null | undefined): string {
    return (values ?? []).join('\n');
}

export function tourToFormValues(tour: Tour, status: TourFormStatus): TourFormValues {
    return {
        listingType: 'tour',
        title: asFormText(tour.title),
        tagline: '',
        summary: asFormText(tour.description),
        destination: asFormText(tour.destination),
        region: tour.region as TourRegion,
        durationDays: tour.durationDays,
        travelStyle: tour.travelStyle,
        difficulty: tour.difficulty,
        badge: asFormText(tour.badge),
        image: asFormText(tour.image),
        content: normalizeRichHtml(resolveTourContent(tour)),
        highlightsText: linesToFormText(tour.highlights),
        keyDestinationsText: '',
        includedServicesText: linesToFormText(tour.inclusions),
        nextDepartureDate: asFormText(tour.nextDeparture?.date) || 'On request',
        nextDepartureStatus: tour.nextDeparture?.status ?? 'Open for Inquiries',
        estimatedStartingPrice: asFormText(tour.estimatedStartingPrice) || 'Custom inquiry basis',
        priceEstimate: asFormText(tour.estimatedStartingPrice) || 'Custom inquiry basis',
        idealFor: `${asFormText(tour.groupSize)} · ${asFormText(tour.difficulty)}`.trim(),
        isPopular: false,
        status,
    };
}

export function packageToFormValues(
    pkg: TourPackage & { destination?: string; region?: TourRegion },
    status: TourFormStatus,
): TourFormValues {
    return {
        listingType: 'package',
        title: asFormText(pkg.title),
        tagline: asFormText(pkg.tagline),
        summary: asFormText(pkg.description),
        destination: asFormText(pkg.destination) || asFormText(pkg.keyDestinations?.[0]),
        region: (pkg.region as TourRegion | undefined) ?? 'Multiple Regions',
        durationDays: pkg.durationDays,
        travelStyle: 'Cultural & Heritage',
        difficulty: 'Moderate',
        badge: asFormText(pkg.badge),
        image: asFormText(pkg.image),
        content: '',
        highlightsText: linesToFormText(pkg.featuredPerks),
        keyDestinationsText: linesToFormText(pkg.keyDestinations),
        includedServicesText: linesToFormText(pkg.includedServices),
        nextDepartureDate: 'On request',
        nextDepartureStatus: 'Open for Inquiries',
        estimatedStartingPrice: asFormText(pkg.priceEstimate),
        priceEstimate: asFormText(pkg.priceEstimate),
        idealFor: asFormText(pkg.idealFor),
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

export interface TourFormSubmitPayload {
    values: TourFormValues;
    coverImage: File | null;
}

const serverFieldMap: Record<string, TourFormField> = {
    title: 'title',
    tagline: 'tagline',
    summary: 'summary',
    destination: 'destination',
    duration_days: 'durationDays',
    content: 'content',
    cover_image: 'image',
    highlights_text: 'highlightsText',
    key_destinations_text: 'keyDestinationsText',
    included_services_text: 'includedServicesText',
    ideal_for: 'idealFor',
    price_estimate: 'priceEstimate',
};

export function mapServerTourFormErrors(
    errors: Record<string, string | string[] | undefined>,
): TourFormErrors {
    const mapped: TourFormErrors = {};

    for (const [key, message] of Object.entries(errors)) {
        const field = serverFieldMap[key];

        if (!field || message === undefined) {
            continue;
        }

        mapped[field] = Array.isArray(message) ? message[0] : message;
    }

    return mapped;
}

export function buildTourFormData({ values, coverImage }: TourFormSubmitPayload): FormData {
    const formData = new FormData();

    formData.append('listing_type', values.listingType);
    formData.append('title', values.title);
    formData.append('tagline', values.tagline);
    formData.append('summary', values.summary);
    formData.append('destination', values.destination);
    formData.append('region', values.region);
    formData.append('duration_days', String(values.durationDays));
    formData.append('travel_style', values.travelStyle);
    formData.append('difficulty', values.difficulty);
    formData.append('badge', values.badge);
    formData.append('content', values.content);
    formData.append('highlights_text', values.highlightsText);
    formData.append('key_destinations_text', values.keyDestinationsText);
    formData.append('included_services_text', values.includedServicesText);
    formData.append('next_departure_date', values.nextDepartureDate);
    formData.append('next_departure_status', values.nextDepartureStatus);
    formData.append('estimated_starting_price', values.estimatedStartingPrice);
    formData.append('price_estimate', values.priceEstimate);
    formData.append('ideal_for', values.idealFor);
    formData.append('is_popular', values.isPopular ? '1' : '0');
    formData.append('status', values.status);

    if (coverImage) {
        formData.append('cover_image', coverImage);
    }

    return formData;
}

export function isTourContentEmpty(html: string): boolean {
    return stripHtml(html).length === 0;
}

export function validateTourFormValues(
    values: TourFormValues,
    hasImage: boolean,
): TourFormErrors {
    const errors: TourFormErrors = {};
    const text = (value: string | null | undefined): string => (value ?? '').trim();

    if (!text(values.title)) {
        errors.title = 'Required';
    }

    if (values.listingType === 'package' && !text(values.tagline)) {
        errors.tagline = 'Required for packages';
    }

    if (!text(values.summary)) {
        errors.summary = 'Required';
    }

    if (!text(values.destination)) {
        errors.destination = 'Required for search and filters';
    }

    if (values.listingType === 'tour' && values.durationDays < 1) {
        errors.durationDays = 'Enter at least 1 day';
    }

    if (values.listingType === 'package' && !text(values.idealFor)) {
        errors.idealFor = 'Required for packages';
    }

    if (values.listingType === 'package' && !text(values.priceEstimate)) {
        errors.priceEstimate = 'Required for packages';
    }

    if (!hasImage) {
        errors.image = 'Required';
    }

    if (values.listingType === 'tour' && isTourContentEmpty(values.content ?? '')) {
        errors.content = 'Required';
    }

    if (!text(values.highlightsText)) {
        errors.highlightsText = 'Add at least one highlight';
    }

    if (values.listingType === 'package' && !text(values.keyDestinationsText)) {
        errors.keyDestinationsText = 'Add at least one destination';
    }

    if (values.listingType === 'package' && !text(values.includedServicesText)) {
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
