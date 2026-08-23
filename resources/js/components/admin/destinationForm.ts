import { normalizeRichHtml, stripHtml } from '@/lib/richText';
import type { Destination, DestinationRegion } from '@/types/destinations';

export type DestinationFormStatus = 'Published' | 'Draft';

export interface DestinationFormValues {
    name: string;
    tagline: string;
    region: DestinationRegion;
    badge: string;
    image: string;
    description: string;
    highlightsText: string;
    bestSeason: string;
    travelStyle: string;
    practicalNotesText: string;
    tourMatchKeywordsText: string;
    isFeatured: boolean;
    status: DestinationFormStatus;
}

export const destinationRegionOptions: readonly DestinationRegion[] = [
    'Central Highlands',
    'Capital & East',
    'Western Silk Road',
    'Northern Region',
    'Pamir & Badakhshan',
    'Southern Plains',
] as const;

function asFormText(value: string | null | undefined): string {
    return value ?? '';
}

function linesToFormText(values: readonly string[] | null | undefined): string {
    return (values ?? []).join('\n');
}

export function destinationToFormValues(
    destination: Destination & {
        status?: DestinationFormStatus;
        bestSeason?: string;
        travelStyle?: string;
        isFeatured?: boolean;
    },
    status: DestinationFormStatus,
): DestinationFormValues {
    return {
        name: asFormText(destination.name),
        tagline: asFormText(destination.tagline),
        region: destination.region,
        badge: asFormText(destination.badge),
        image: asFormText(destination.image),
        description: normalizeRichHtml(asFormText(destination.description)),
        highlightsText: linesToFormText(destination.highlights),
        bestSeason: asFormText(destination.bestSeason),
        travelStyle: asFormText(destination.travelStyle),
        practicalNotesText: linesToFormText(destination.practicalNotes),
        tourMatchKeywordsText: linesToFormText(destination.tourMatchKeywords),
        isFeatured: destination.isFeatured ?? false,
        status,
    };
}

export function createEmptyDestinationFormValues(): DestinationFormValues {
    return {
        name: '',
        tagline: '',
        region: 'Central Highlands',
        badge: '',
        image: '',
        description: '',
        highlightsText: '',
        bestSeason: '',
        travelStyle: '',
        practicalNotesText: '',
        tourMatchKeywordsText: '',
        isFeatured: false,
        status: 'Draft',
    };
}

export function slugifyDestinationName(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export type DestinationFormField =
    | 'name'
    | 'tagline'
    | 'image'
    | 'description'
    | 'highlightsText'
    | 'bestSeason'
    | 'travelStyle';

export type DestinationFormErrors = Partial<Record<DestinationFormField, string>>;

export interface DestinationFormSubmitPayload {
    values: DestinationFormValues;
    coverImage: File | null;
}

const serverFieldMap: Record<string, DestinationFormField> = {
    name: 'name',
    tagline: 'tagline',
    cover_image: 'image',
    description: 'description',
    highlights_text: 'highlightsText',
    best_season: 'bestSeason',
    travel_style: 'travelStyle',
};

export function mapServerDestinationFormErrors(
    errors: Record<string, string | string[] | undefined>,
): DestinationFormErrors {
    const mapped: DestinationFormErrors = {};

    for (const [key, message] of Object.entries(errors)) {
        const field = serverFieldMap[key];

        if (!field || message === undefined) {
            continue;
        }

        mapped[field] = Array.isArray(message) ? message[0] : message;
    }

    return mapped;
}

export function buildDestinationFormData({
    values,
    coverImage,
}: DestinationFormSubmitPayload): FormData {
    const formData = new FormData();

    formData.append('name', values.name);
    formData.append('tagline', values.tagline);
    formData.append('region', values.region);
    formData.append('badge', values.badge);
    formData.append('description', values.description);
    formData.append('highlights_text', values.highlightsText);
    formData.append('best_season', values.bestSeason);
    formData.append('travel_style', values.travelStyle);
    formData.append('practical_notes_text', values.practicalNotesText);
    formData.append('tour_match_keywords_text', values.tourMatchKeywordsText);
    formData.append('is_featured', values.isFeatured ? '1' : '0');
    formData.append('status', values.status);

    if (coverImage) {
        formData.append('cover_image', coverImage);
    }

    return formData;
}

export function isDestinationDescriptionEmpty(html: string): boolean {
    return stripHtml(html ?? '').length === 0;
}

export function validateDestinationFormValues(
    values: DestinationFormValues,
    hasImage: boolean,
): DestinationFormErrors {
    const errors: DestinationFormErrors = {};
    const text = (value: string | null | undefined): string => (value ?? '').trim();

    if (!text(values.name)) {
        errors.name = 'Required';
    }

    if (!text(values.tagline)) {
        errors.tagline = 'Required';
    }

    if (!hasImage) {
        errors.image = 'Required';
    }

    if (isDestinationDescriptionEmpty(values.description ?? '')) {
        errors.description = 'Required';
    }

    return errors;
}
