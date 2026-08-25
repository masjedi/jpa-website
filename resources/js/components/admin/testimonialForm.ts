import type { Testimonial, TestimonialStatus } from '@/types/testimonials';

export interface TestimonialFormValues {
    name: string;
    journey: string;
    text: string;
    rating: number;
    status: TestimonialStatus;
}

export function createEmptyTestimonialFormValues(): TestimonialFormValues {
    return {
        name: '',
        journey: '',
        text: '',
        rating: 5,
        status: 'Draft',
    };
}

export function testimonialToFormValues(
    testimonial: Testimonial,
    status: TestimonialStatus = testimonial.status,
): TestimonialFormValues {
    return {
        name: testimonial.name,
        journey: testimonial.journey,
        text: testimonial.text,
        rating: testimonial.rating,
        status,
    };
}

export type TestimonialFormField = 'name' | 'journey' | 'text' | 'rating';

export type TestimonialFormErrors = Partial<Record<TestimonialFormField, string>>;

export function validateTestimonialFormValues(values: TestimonialFormValues): TestimonialFormErrors {
    const errors: TestimonialFormErrors = {};

    if (!values.name.trim()) {
        errors.name = 'Required';
    }

    if (!values.journey.trim()) {
        errors.journey = 'Required';
    }

    if (!values.text.trim()) {
        errors.text = 'Required';
    }

    if (!Number.isInteger(values.rating) || values.rating < 1 || values.rating > 5) {
        errors.rating = 'Choose a rating between 1 and 5';
    }

    return errors;
}

export function buildTestimonialPayload(values: TestimonialFormValues): Record<string, string | number> {
    return {
        name: values.name.trim(),
        journey: values.journey.trim(),
        text: values.text.trim(),
        rating: values.rating,
        status: values.status,
    };
}
