import { normalizeRichHtml, stripHtml } from '@/lib/richText';
import {
    appendTranslatedStringToFormData,
    createEmptyTranslatedString,
    normalizeTranslatedString,
} from '@/lib/translations';
import { buildTranslatableFieldMap, mapTranslatableServerErrors, validateEnglishRequired } from '@/lib/translatableForm';
import type { AdminDestination, DestinationRegion } from '@/types/destinations';
import type { TranslatedString } from '@/types/locale';

export type DestinationFormStatus = 'Published' | 'Draft';

export interface DestinationFormValues {
    name: TranslatedString;
    tagline: TranslatedString;
    region: DestinationRegion;
    badge: TranslatedString;
    image: string;
    description: TranslatedString;
    highlightsText: TranslatedString;
    bestSeason: TranslatedString;
    travelStyle: TranslatedString;
    practicalNotesText: TranslatedString;
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

export function destinationToFormValues(
    destination: AdminDestination,
    status: DestinationFormStatus = destination.status,
): DestinationFormValues {
    return {
        name: normalizeTranslatedString(destination.name),
        tagline: normalizeTranslatedString(destination.tagline),
        region: destination.region,
        badge: normalizeTranslatedString(destination.badge),
        image: destination.image,
        description: normalizeTranslatedString(destination.description),
        highlightsText: normalizeTranslatedString(destination.highlightsText),
        bestSeason: normalizeTranslatedString(destination.bestSeason),
        travelStyle: normalizeTranslatedString(destination.travelStyle),
        practicalNotesText: normalizeTranslatedString(destination.practicalNotesText),
        tourMatchKeywordsText: (destination.tourMatchKeywords ?? []).join('\n'),
        isFeatured: destination.isFeatured ?? false,
        status,
    };
}

export function createEmptyDestinationFormValues(): DestinationFormValues {
    return {
        name: createEmptyTranslatedString(),
        tagline: createEmptyTranslatedString(),
        region: 'Central Highlands',
        badge: createEmptyTranslatedString(),
        image: '',
        description: createEmptyTranslatedString(),
        highlightsText: createEmptyTranslatedString(),
        bestSeason: createEmptyTranslatedString(),
        travelStyle: createEmptyTranslatedString(),
        practicalNotesText: createEmptyTranslatedString(),
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

const serverFieldMap = {
    ...buildTranslatableFieldMap('', [
        'name',
        'tagline',
        'description',
        'highlights_text',
        'best_season',
        'travel_style',
        'practical_notes_text',
    ]),
    cover_image: 'image',
    highlights_text: 'highlightsText',
    best_season: 'bestSeason',
    travel_style: 'travelStyle',
    practical_notes_text: 'practicalNotesText',
};

export function mapServerDestinationFormErrors(
    errors: Record<string, string | string[] | undefined>,
): DestinationFormErrors {
    return mapTranslatableServerErrors(errors, serverFieldMap);
}

export function buildDestinationFormData({
    values,
    coverImage,
}: DestinationFormSubmitPayload): FormData {
    const formData = new FormData();

    appendTranslatedStringToFormData(formData, 'name', values.name);
    appendTranslatedStringToFormData(formData, 'tagline', values.tagline);
    appendTranslatedStringToFormData(formData, 'badge', values.badge);
    appendTranslatedStringToFormData(formData, 'description', values.description);
    appendTranslatedStringToFormData(formData, 'highlights_text', values.highlightsText);
    appendTranslatedStringToFormData(formData, 'best_season', values.bestSeason);
    appendTranslatedStringToFormData(formData, 'travel_style', values.travelStyle);
    appendTranslatedStringToFormData(formData, 'practical_notes_text', values.practicalNotesText);
    formData.append('region', values.region);
    formData.append('tour_match_keywords_text', values.tourMatchKeywordsText);
    formData.append('is_featured', values.isFeatured ? '1' : '0');
    formData.append('status', values.status);

    if (coverImage) {
        formData.append('cover_image', coverImage);
    }

    return formData;
}

export function isDestinationDescriptionEmpty(value: TranslatedString): boolean {
    return stripHtml(value.en ?? '').length === 0;
}

export function validateDestinationFormValues(
    values: DestinationFormValues,
    hasImage: boolean,
): DestinationFormErrors {
    const errors: DestinationFormErrors = {};

    const nameError = validateEnglishRequired(values.name, 'Name');
    if (nameError) {
        errors.name = nameError;
    }

    const taglineError = validateEnglishRequired(values.tagline, 'Tagline');
    if (taglineError) {
        errors.tagline = taglineError;
    }

    if (!hasImage) {
        errors.image = 'Required';
    }

    if (isDestinationDescriptionEmpty(values.description)) {
        errors.description = 'English description is required';
    }

    return errors;
}
