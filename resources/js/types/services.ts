import type { TranslatedString } from '@/types/locale';

export type ServiceCategory = 'Journey' | 'On-ground' | 'Logistics';

export type ServiceOfferingStatus = 'Published' | 'Draft';

export const serviceCategoryLabels: readonly ServiceCategory[] = [
    'Journey',
    'On-ground',
    'Logistics',
];

export interface ServiceIconOption {
    value: string;
    label: string;
}

export interface ServiceOffering {
    id: number;
    title: TranslatedString;
    slug: string;
    tagline: TranslatedString;
    description: TranslatedString;
    category: ServiceCategory;
    iconKey: string;
    featuresText: TranslatedString;
    features: string[];
    isFeatured: boolean;
    showOnHome: boolean;
    order: number;
    status: ServiceOfferingStatus;
    updated: string;
}

export interface PublicServiceOffering {
    id: number;
    slug: string;
    title: string;
    tagline: string;
    description: string;
    category: ServiceCategory;
    iconKey: string;
    features: string[];
    isFeatured: boolean;
}

export interface HomeServicePreview {
    id: number;
    slug: string;
    title: string;
    description: string;
    iconKey: string;
}

export interface ServiceProcessStep {
    step: string;
    title: string;
    description: string;
}
