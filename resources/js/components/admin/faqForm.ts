import type { FaqItem, FaqStatus } from '@/types/faq';
import type { TranslatedString } from '@/types/locale';
import {
    appendTranslatedStringToFormData,
    createEmptyTranslatedString,
    normalizeTranslatedString,
} from '@/lib/translations';
import { buildTranslatableFieldMap, mapTranslatableServerErrors, validateEnglishRequired, type AdminJsonPayload } from '@/lib/translatableForm';

export interface FaqFormValues {
    question: TranslatedString;
    answer: TranslatedString;
    status: FaqStatus;
}

export function createEmptyFaqFormValues(): FaqFormValues {
    return {
        question: createEmptyTranslatedString(),
        answer: createEmptyTranslatedString(),
        status: 'Draft',
    };
}

export function faqToFormValues(item: FaqItem, status: FaqStatus = item.status): FaqFormValues {
    return {
        question: normalizeTranslatedString(item.question),
        answer: normalizeTranslatedString(item.answer),
        status,
    };
}

export type FaqFormField = 'question' | 'answer';

export type FaqFormErrors = Partial<Record<FaqFormField, string>>;

const serverFieldMap = buildTranslatableFieldMap('', ['question', 'answer']);

export function mapServerFaqFormErrors(
    errors: Record<string, string | string[] | undefined>,
): FaqFormErrors {
    return mapTranslatableServerErrors(errors, serverFieldMap);
}

export function validateFaqFormValues(values: FaqFormValues): FaqFormErrors {
    const errors: FaqFormErrors = {};

    const questionError = validateEnglishRequired(values.question, 'Question');
    if (questionError) {
        errors.question = questionError;
    }

    const answerError = validateEnglishRequired(values.answer, 'Answer');
    if (answerError) {
        errors.answer = answerError;
    }

    return errors;
}

export function buildFaqPayload(values: FaqFormValues): AdminJsonPayload {
    return {
        question: values.question,
        answer: values.answer,
        status: values.status,
    };
}

export function buildFaqFormData(values: FaqFormValues): FormData {
    const formData = new FormData();

    appendTranslatedStringToFormData(formData, 'question', values.question);
    appendTranslatedStringToFormData(formData, 'answer', values.answer);
    formData.append('status', values.status);

    return formData;
}
