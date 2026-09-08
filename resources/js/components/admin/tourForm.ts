import { normalizeRichHtml, stripHtml } from '@/lib/richText';
import {
    appendTranslatedStringToFormData,
    createEmptyTranslatedString,
    normalizeTranslatedString,
} from '@/lib/translations';
import { buildTranslatableFieldMap, mapTranslatableServerErrors, validateEnglishRequired } from '@/lib/translatableForm';
import type { TourFilterFieldOptions } from '@/types/tourFilterOptions';
import type { AdminTourOffer } from '@/types/tours';
import { LOCALE_CODES, type LocaleCode, type TranslatedString } from '@/types/locale';

export type TourFormStatus = 'Published' | 'Draft';
export type TourListingType = 'tour' | 'package';

export type TourRegion = string;

export interface TourFormValues {
    listingType: TourListingType;
    title: TranslatedString;
    tagline: TranslatedString;
    summary: TranslatedString;
    destination: TranslatedString;
    region: TourRegion;
    durationDays: number;
    travelStyle: string;
    difficulty: string;
    badge: TranslatedString;
    image: string;
    content: TranslatedString;
    highlightsText: TranslatedString;
    keyDestinationsText: TranslatedString;
    includedServicesText: TranslatedString;
    priceEstimate: TranslatedString;
    idealFor: TranslatedString;
    isPopular: boolean;
    status: TourFormStatus;
}

export const emptyTourFilterOptions: TourFilterFieldOptions = {
    regions: [],
    travelStyles: [],
    difficulties: [],
};

export function firstTourFilterOption(
    options: readonly string[],
    preferred?: string,
): string {
    if (preferred && options.includes(preferred)) {
        return preferred;
    }

    return options[0] ?? preferred ?? '';
}

export function withCurrentTourFilterOption(
    options: readonly string[],
    current: string,
): string[] {
    if (current && !options.includes(current)) {
        return [current, ...options];
    }

    return [...options];
}

function createEmptyTranslatedStringWithDefault(defaults: Partial<TranslatedString> = {}): TranslatedString {
    return {
        ...createEmptyTranslatedString(),
        ...defaults,
    };
}

export function createEmptyTourFormValues(
    options: TourFilterFieldOptions = emptyTourFilterOptions,
): TourFormValues {
    return {
        listingType: 'tour',
        title: createEmptyTranslatedString(),
        tagline: createEmptyTranslatedString(),
        summary: createEmptyTranslatedString(),
        destination: createEmptyTranslatedString(),
        region: firstTourFilterOption(options.regions, 'Central Highlands'),
        durationDays: 7,
        travelStyle: firstTourFilterOption(options.travelStyles, 'Cultural & Heritage'),
        difficulty: firstTourFilterOption(options.difficulties, 'Moderate'),
        badge: createEmptyTranslatedString(),
        image: '',
        content: createEmptyTranslatedString(),
        highlightsText: createEmptyTranslatedString(),
        keyDestinationsText: createEmptyTranslatedString(),
        includedServicesText: createEmptyTranslatedString(),
        priceEstimate: createEmptyTranslatedStringWithDefault({ en: 'Custom quotation' }),
        idealFor: createEmptyTranslatedString(),
        isPopular: false,
        status: 'Draft',
    };
}

export const tourListingTypeOptions: readonly { value: TourListingType; label: string }[] = [
    { value: 'tour', label: 'Tour itinerary' },
    { value: 'package', label: 'Travel package' },
] as const;

export function slugifyTourTitle(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function splitMultilineText(value: string): string[] {
    return value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
}

export function tourOfferToFormValues(offer: AdminTourOffer): TourFormValues {
    const base: TourFormValues = {
        listingType: offer.listingType,
        title: normalizeTranslatedString(offer.title),
        tagline: normalizeTranslatedString(offer.tagline ?? createEmptyTranslatedString()),
        summary: normalizeTranslatedString(offer.description),
        destination: normalizeTranslatedString(offer.destination),
        region: offer.region,
        durationDays: offer.durationDays,
        travelStyle: offer.travelStyle ?? 'Cultural & Heritage',
        difficulty: offer.difficulty ?? 'Moderate',
        badge: normalizeTranslatedString(offer.badge),
        image: offer.image,
        content: normalizeTranslatedString(offer.content ?? createEmptyTranslatedString()),
        highlightsText: normalizeTranslatedString(offer.highlightsText),
        keyDestinationsText: normalizeTranslatedString(offer.keyDestinationsText ?? createEmptyTranslatedString()),
        includedServicesText: normalizeTranslatedString(offer.includedServicesText),
        priceEstimate: normalizeTranslatedString(offer.priceEstimate ?? createEmptyTranslatedString()),
        idealFor: normalizeTranslatedString(offer.idealFor ?? createEmptyTranslatedString()),
        isPopular: offer.isPopular ?? false,
        status: offer.status,
    };

    return base;
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

const serverFieldMap = {
    ...buildTranslatableFieldMap('', [
        'title',
        'tagline',
        'summary',
        'destination',
        'content',
        'highlights_text',
        'key_destinations_text',
        'included_services_text',
        'ideal_for',
        'price_estimate',
    ]),
    duration_days: 'durationDays',
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
    return mapTranslatableServerErrors(errors, serverFieldMap);
}

export function buildTourFormData({ values, coverImage }: TourFormSubmitPayload): FormData {
    const formData = new FormData();

    formData.append('listing_type', values.listingType);
    appendTranslatedStringToFormData(formData, 'title', values.title);
    appendTranslatedStringToFormData(formData, 'tagline', values.tagline);
    appendTranslatedStringToFormData(formData, 'summary', values.summary);
    appendTranslatedStringToFormData(formData, 'destination', values.destination);
    formData.append('region', values.region);
    formData.append('duration_days', String(values.durationDays));
    formData.append('travel_style', values.travelStyle);
    formData.append('difficulty', values.difficulty);
    appendTranslatedStringToFormData(formData, 'badge', values.badge);
    appendTranslatedStringToFormData(formData, 'content', values.content);
    appendTranslatedStringToFormData(formData, 'highlights_text', values.highlightsText);
    appendTranslatedStringToFormData(formData, 'key_destinations_text', values.keyDestinationsText);
    appendTranslatedStringToFormData(formData, 'included_services_text', values.includedServicesText);
    appendTranslatedStringToFormData(formData, 'price_estimate', values.priceEstimate);
    appendTranslatedStringToFormData(formData, 'ideal_for', values.idealFor);
    formData.append('is_popular', values.isPopular ? '1' : '0');
    formData.append('status', values.status);

    if (coverImage) {
        formData.append('cover_image', coverImage);
    }

    return formData;
}

export function isTourContentEmpty(value: TranslatedString): boolean {
    return stripHtml(value.en).length === 0;
}

export function validateTourFormValues(
    values: TourFormValues,
    hasImage: boolean,
): TourFormErrors {
    const errors: TourFormErrors = {};

    const titleError = validateEnglishRequired(values.title, 'Title');
    if (titleError) {
        errors.title = titleError;
    }

    if (values.listingType === 'package') {
        const taglineError = validateEnglishRequired(values.tagline, 'Tagline');
        if (taglineError) {
            errors.tagline = taglineError;
        }
    }

    const summaryError = validateEnglishRequired(values.summary, 'Summary');
    if (summaryError) {
        errors.summary = summaryError;
    }

    const destinationError = validateEnglishRequired(values.destination, 'Destination');
    if (destinationError) {
        errors.destination = destinationError;
    }

    if (values.listingType === 'tour' && values.durationDays < 1) {
        errors.durationDays = 'Enter at least 1 day';
    }

    if (values.listingType === 'package') {
        const idealForError = validateEnglishRequired(values.idealFor, 'Ideal for');
        if (idealForError) {
            errors.idealFor = idealForError;
        }

        const priceError = validateEnglishRequired(values.priceEstimate, 'Price estimate');
        if (priceError) {
            errors.priceEstimate = priceError;
        }
    }

    if (!hasImage) {
        errors.image = 'Required';
    }

    if (values.listingType === 'tour' && isTourContentEmpty(values.content)) {
        errors.content = 'English content is required';
    }

    if (!values.highlightsText.en.trim()) {
        errors.highlightsText = 'English highlights are required';
    }

    if (values.listingType === 'package' && !values.keyDestinationsText.en.trim()) {
        errors.keyDestinationsText = 'English key destinations are required';
    }

    if (values.listingType === 'package' && !values.includedServicesText.en.trim()) {
        errors.includedServicesText = 'English included services are required';
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

export const tourTranslatableTextFields = [
    'title',
    'tagline',
    'summary',
    'destination',
    'badge',
    'content',
    'highlightsText',
    'keyDestinationsText',
    'includedServicesText',
    'priceEstimate',
    'idealFor',
] as const;

export type TourTranslatableTextField = (typeof tourTranslatableTextFields)[number];

export function tourTranslatableEmptyFields(): Record<TourTranslatableTextField, string> {
    return {
        title: '',
        tagline: '',
        summary: '',
        destination: '',
        badge: '',
        content: '',
        highlightsText: '',
        keyDestinationsText: '',
        includedServicesText: '',
        priceEstimate: '',
        idealFor: '',
    };
}

export function tourFormValuesToLocaleMap(
    values: TourFormValues,
): Record<LocaleCode, Record<TourTranslatableTextField, string>> {
    const map = {} as Record<LocaleCode, Record<TourTranslatableTextField, string>>;

    for (const locale of LOCALE_CODES) {
        map[locale] = tourTranslatableEmptyFields();
    }

    for (const field of tourTranslatableTextFields) {
        const translated = normalizeTranslatedString(values[field]);

        for (const locale of LOCALE_CODES) {
            map[locale][field] = translated[locale];
        }
    }

    return map;
}

export function localeMapToTourTranslatableValues(
    byLocale: Record<LocaleCode, Record<TourTranslatableTextField, string>>,
    shared: Pick<
        TourFormValues,
        'listingType' | 'region' | 'durationDays' | 'travelStyle' | 'difficulty' | 'image' | 'isPopular' | 'status'
    >,
): TourFormValues {
    const translatable = {} as Record<TourTranslatableTextField, TranslatedString>;

    for (const field of tourTranslatableTextFields) {
        const translated = createEmptyTranslatedString();

        for (const locale of LOCALE_CODES) {
            translated[locale] = byLocale[locale]?.[field]?.trim() ?? '';
        }

        translatable[field] = translated;
    }

    return {
        ...shared,
        ...translatable,
    };
}
