import type { Testimonial, TestimonialStatus } from '@/types/testimonials';
import type { TranslatedString } from '@/types/locale';
import {
    appendTranslatedStringToFormData,
    createEmptyTranslatedString,
    normalizeTranslatedString,
} from '@/lib/translations';
import { buildTranslatableFieldMap, mapTranslatableServerErrors, validateEnglishRequired } from '@/lib/translatableForm';

export interface TestimonialFormValues {
    name: TranslatedString;
    journey: TranslatedString;
    text: TranslatedString;
    image: string;
    rating: number;
    status: TestimonialStatus;
}

export function createEmptyTestimonialFormValues(): TestimonialFormValues {
    return {
        name: createEmptyTranslatedString(),
        journey: createEmptyTranslatedString(),
        text: createEmptyTranslatedString(),
        image: '',
        rating: 5,
        status: 'Draft',
    };
}

export function testimonialToFormValues(
    testimonial: Testimonial,
    status: TestimonialStatus = testimonial.status,
): TestimonialFormValues {
    return {
        name: normalizeTranslatedString(testimonial.name),
        journey: normalizeTranslatedString(testimonial.journey),
        text: normalizeTranslatedString(testimonial.text),
        image: testimonial.image,
        rating: testimonial.rating,
        status,
    };
}

export type TestimonialFormField = 'name' | 'journey' | 'text' | 'rating' | 'image';

export type TestimonialFormErrors = Partial<Record<TestimonialFormField, string>>;

export interface TestimonialFormSubmitPayload {
    values: TestimonialFormValues;
    avatarImage: File | null;
}

const serverFieldMap = {
    ...buildTranslatableFieldMap('', ['name', 'journey', 'text']),
    avatar_image: 'image',
};

export function mapServerTestimonialFormErrors(
    errors: Record<string, string | string[] | undefined>,
): TestimonialFormErrors {
    return mapTranslatableServerErrors(errors, serverFieldMap);
}

export function validateTestimonialFormValues(
    values: TestimonialFormValues,
    hasImage: boolean,
): TestimonialFormErrors {
    const errors: TestimonialFormErrors = {};

    const nameError = validateEnglishRequired(values.name, 'Name');
    if (nameError) {
        errors.name = nameError;
    }

    const journeyError = validateEnglishRequired(values.journey, 'Journey');
    if (journeyError) {
        errors.journey = journeyError;
    }

    const textError = validateEnglishRequired(values.text, 'Quote');
    if (textError) {
        errors.text = textError;
    }

    if (!Number.isInteger(values.rating) || values.rating < 1 || values.rating > 5) {
        errors.rating = 'Choose a rating between 1 and 5';
    }

    if (!hasImage) {
        errors.image = 'Portrait image is required';
    }

    return errors;
}

export function buildTestimonialFormData(payload: TestimonialFormSubmitPayload): FormData {
    const formData = new FormData();

    appendTranslatedStringToFormData(formData, 'name', payload.values.name);
    appendTranslatedStringToFormData(formData, 'journey', payload.values.journey);
    appendTranslatedStringToFormData(formData, 'text', payload.values.text);
    formData.append('rating', String(payload.values.rating));
    formData.append('status', payload.values.status);

    if (payload.avatarImage) {
        formData.append('avatar_image', payload.avatarImage);
    }

    return formData;
}
