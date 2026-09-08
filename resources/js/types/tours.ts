import type { TranslatedString } from '@/types/locale';

export type TourDifficulty = string;

export type TourTravelStyle = string;

export type TourSeason = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Year-round';

export interface TourItineraryDay {
    day: string;
    title: string;
    summary: string;
}

export interface Tour {
    id: string;
    slug: string;
    title: string;
    destination: string;
    region: string;
    regionValue?: string;
    durationDays: number;
    duration: string;
    difficulty: TourDifficulty;
    difficultyValue?: string;
    travelStyle: TourTravelStyle;
    travelStyleValue?: string;
    season: TourSeason;
    bestMonths: string;
    groupSize: string;
    image: string;
    badge?: string;
    description: string;
    content?: string;
    highlights: readonly string[];
    itineraryOverview: readonly TourItineraryDay[];
    inclusions: readonly string[];
    priceLabel?: string | null;
    destinationSlugs?: readonly string[];
}

export interface TourPackage {
    id: string;
    slug: string;
    title: string;
    tagline: string;
    duration: string;
    durationDays: number;
    badge: string;
    image: string;
    description: string;
    featuredPerks: readonly string[];
    keyDestinations: readonly string[];
    priceEstimate: string;
    idealFor: string;
    includedServices: readonly string[];
    journeyOutline?: readonly PackageJourneyPhase[];
    isPopular?: boolean;
}

export interface AdminTourOffer {
    id: number;
    slug: string;
    listingType: 'tour' | 'package';
    status: 'Published' | 'Draft';
    title: TranslatedString;
    durationDays: number;
    duration: TranslatedString;
    badge: TranslatedString;
    image: string;
    description: TranslatedString;
    highlightsText: TranslatedString;
    highlights: readonly string[];
    inclusions: readonly string[];
    includedServicesText: TranslatedString;
    destination: TranslatedString;
    region: string;
    tagline?: TranslatedString;
    featuredPerks?: readonly string[];
    keyDestinations?: readonly string[];
    keyDestinationsText?: TranslatedString;
    priceEstimate?: TranslatedString;
    idealFor?: TranslatedString;
    includedServices?: readonly string[];
    journeyOutline?: Record<string, unknown>;
    isPopular?: boolean;
    difficulty?: TourDifficulty;
    travelStyle?: TourTravelStyle;
    season?: TranslatedString;
    bestMonths?: TranslatedString;
    groupSize?: TranslatedString;
    content?: TranslatedString;
    itineraryOverview?: Record<string, unknown>;
}

export interface PackageJourneyPhase {
    phase: string;
    title: string;
    summary: string;
}

export interface InquiryFormData {
    tourTitle?: string;
    preferredDate?: string;
    travelerCount?: string;
    durationPreference?: string;
    fullName?: string;
    email?: string;
    nationality?: string;
    whatsappOrPhone?: string;
    notes?: string;
}
