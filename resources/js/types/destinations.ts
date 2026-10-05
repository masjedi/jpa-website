import type { TranslatedString } from '@/types/locale';

export type DestinationRegion =
    | 'Central Highlands'
    | 'Capital & East'
    | 'Western Silk Road'
    | 'Northern Region'
    | 'Pamir & Badakhshan'
    | 'Southern Plains';

export interface Destination {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    region: DestinationRegion | string;
    regionValue?: string;
    image: string;
    badge?: string | null;
    description: string;
    highlights: readonly string[];
    bestSeason: string;
    travelStyle: string;
    practicalNotes: readonly string[];
    tourMatchKeywords: readonly string[];
    isFeatured?: boolean;
    linkedToursCount?: number;
}

export interface AdminDestination {
    id: number;
    slug: string;
    status: 'Published' | 'Draft';
    name: TranslatedString;
    tagline: TranslatedString;
    region: DestinationRegion;
    badge: TranslatedString;
    image: string;
    description: TranslatedString;
    highlightsText: TranslatedString;
    highlights: readonly string[];
    bestSeason: TranslatedString;
    travelStyle: TranslatedString;
    practicalNotesText: TranslatedString;
    practicalNotes: readonly string[];
    tourMatchKeywords: readonly string[];
    isFeatured: boolean;
    linkedToursCount?: number;
}

export interface DestinationRelatedTour {
    id: string;
    slug: string;
    title: string;
    duration: string;
    travelStyle: string;
    href: string;
}

export interface DestinationRelatedItem {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    region: string;
    image: string;
}
