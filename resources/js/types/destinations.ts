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
    badge?: string;
    description: string;
    highlights: readonly string[];
    bestSeason: string;
    travelStyle: string;
    practicalNotes: readonly string[];
    tourMatchKeywords: readonly string[];
    isFeatured?: boolean;
}
