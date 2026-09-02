export type ContentRecordStatus = 'Published' | 'Draft';

export interface ContentRecordViewSection {
    id: string;
    heading: string;
    paragraphs: readonly string[];
}

export interface ContentRecordViewMetaField {
    id: string;
    label: string;
    value: string;
    span?: 1 | 2;
}

export interface ContentRecordRelatedItem {
    id: string;
    title: string;
    meta?: string;
}

export interface ContentRecordViewModel {
    title: string;
    subtitle: string;
    imageUrl?: string;
    imageAlt?: string;
    badgeLabel?: string;
    status?: ContentRecordStatus;
    metaFields: readonly ContentRecordViewMetaField[];
    bodyHtml?: string;
    bodyPlain?: string;
    sections?: readonly ContentRecordViewSection[];
    highlights?: readonly string[];
    relatedItems?: readonly ContentRecordRelatedItem[];
    relatedItemsTitle?: string;
    cardEyebrow?: string;
    cardCtaLabel?: string;
    showCardPreview?: boolean;
    showContentSection?: boolean;
    layout?: 'preview' | 'compact';
}

export const contentRecordStatusStyles: Record<ContentRecordStatus, string> = {
    Published: 'bg-secondary/10 text-secondary',
    Draft: 'bg-accent/15 text-accent',
};
