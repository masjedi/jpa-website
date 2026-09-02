export type TourFilterOptionType =
    | 'region'
    | 'travelStyle'
    | 'difficulty'
    | 'destination'
    | 'season'
    | 'groupType';

export type TourFilterOptionStatus = 'Published' | 'Draft';

export interface TourFilterOption {
    id: number;
    type: TourFilterOptionType;
    name: string;
    order: number;
    status: TourFilterOptionStatus;
    updated: string;
}

export interface TourFilterFieldOptions {
    regions: string[];
    travelStyles: string[];
    difficulties: string[];
}

export interface HomeFinderOptions {
    destinations: string[];
    travelStyles: string[];
    seasons: string[];
    groupTypes: string[];
}

export const tourFilterOptionTypeLabels: Record<TourFilterOptionType, string> = {
    region: 'Region',
    travelStyle: 'Travel style',
    difficulty: 'Difficulty',
    destination: 'Destination',
    season: 'Season',
    groupType: 'Group type',
};

export const tourFilterOptionPlaceholders: Record<TourFilterOptionType, string> = {
    region: 'Central Highlands',
    travelStyle: 'Cultural & Heritage',
    difficulty: 'Moderate',
    destination: 'Bamiyan Valley',
    season: 'Spring',
    groupType: 'Private tour',
};
