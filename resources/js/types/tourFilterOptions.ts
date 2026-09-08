import type { TranslatedString } from '@/types/locale';

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
    value: string;
    name: TranslatedString;
    order: number;
    status: TourFilterOptionStatus;
    updated: string;
}

export interface PublicFilterChoice {
    value: string;
    label: string;
}

export interface TourFilterFieldOptions {
    regions: PublicFilterChoice[];
    travelStyles: PublicFilterChoice[];
    difficulties: PublicFilterChoice[];
}

export interface HomeFinderOptions {
    destinations: PublicFilterChoice[];
    travelStyles: PublicFilterChoice[];
    seasons: PublicFilterChoice[];
    groupTypes: PublicFilterChoice[];
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
