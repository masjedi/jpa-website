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

export function formatFaqUpdatedLabel(): string {
    return 'Just now';
}

export function nextFaqItemId(items: readonly FaqItem[]): number {
    return items.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
}

export function nextFaqItemOrder(items: readonly FaqItem[]): number {
    return items.reduce((maxOrder, item) => Math.max(maxOrder, item.order), 0) + 1;
}
