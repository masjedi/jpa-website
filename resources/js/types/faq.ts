export type FaqStatus = 'Published' | 'Draft';

export interface FaqItem {
    id: number;
    question: string;
    answer: string;
    order: number;
    status: FaqStatus;
    updated: string;
}
