import type { LucideIcon } from 'lucide-react';

export type ServiceCategory = 'Journey' | 'On-ground' | 'Logistics';

export interface ServiceOffering {
    id: string;
    slug: string;
    title: string;
    tagline: string;
    description: string;
    category: ServiceCategory;
    icon: LucideIcon;
    features: readonly string[];
    isFeatured?: boolean;
}

export interface ServiceProcessStep {
    step: string;
    title: string;
    description: string;
}
