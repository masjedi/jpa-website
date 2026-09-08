import type { TranslatedString } from '@/types/locale';

export type FaqStatus = 'Published' | 'Draft';

export interface FaqItem {
    id: number;
    question: TranslatedString;
    answer: TranslatedString;
    order: number;
    status: FaqStatus;
    updated: string;
}

export interface PublicFaqItem {
    id: number;
    question: string;
    answer: string;
}
