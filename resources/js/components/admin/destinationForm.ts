import type { Destination, DestinationRegion } from '@/types/destinations';

export type DestinationFormStatus = 'Published' | 'Draft';

export interface DestinationFormValues {
    name: string;
    tagline: string;
    region: DestinationRegion;
    image: string;
    description: string;
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
    destination: Destination,
    status: DestinationFormStatus,
): DestinationFormValues {
    return {
        name: destination.name,
        tagline: destination.tagline,
        region: destination.region,
        image: destination.image,
        description: destination.description,
        status,
    };
}

export function createEmptyDestinationFormValues(): DestinationFormValues {
    return {
        name: '',
        tagline: '',
        region: 'Central Highlands',
        image: '',
        description: '',
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

export type DestinationFormField = 'name' | 'tagline' | 'image' | 'description';

export type DestinationFormErrors = Partial<Record<DestinationFormField, string>>;

export function isDestinationDescriptionEmpty(html: string): boolean {
    const text = html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return text.length === 0;
}

export function validateDestinationFormValues(
    values: DestinationFormValues,
    hasImage: boolean,
): DestinationFormErrors {
    const errors: DestinationFormErrors = {};

    if (!values.name.trim()) {
        errors.name = 'Required';
    }

    if (!values.tagline.trim()) {
        errors.tagline = 'Required';
    }

    if (!hasImage) {
        errors.image = 'Required';
    }

    if (isDestinationDescriptionEmpty(values.description)) {
        errors.description = 'Required';
    }

    return errors;
}
