import type { FaqItem, FaqStatus } from '@/types/faq';

export interface FaqFormValues {
    question: string;
    answer: string;
    status: FaqStatus;
}

export function createEmptyFaqFormValues(): FaqFormValues {
    return {
        question: '',
        answer: '',
        status: 'Draft',
    };
}

export function faqToFormValues(item: FaqItem, status: FaqStatus = item.status): FaqFormValues {
    return {
        question: item.question,
        answer: item.answer,
        status,
    };
}

export type FaqFormField = 'question' | 'answer';

export type FaqFormErrors = Partial<Record<FaqFormField, string>>;

export function validateFaqFormValues(values: FaqFormValues): FaqFormErrors {
    const errors: FaqFormErrors = {};

    if (!values.question.trim()) {
        errors.question = 'Required';
    }

    if (!values.answer.trim()) {
        errors.answer = 'Required';
    }

    return errors;
}

export function buildFaqPayload(values: FaqFormValues): Record<string, string> {
    return {
        question: values.question.trim(),
        answer: values.answer.trim(),
        status: values.status,
    };
}
