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
    region: DestinationRegion;
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
