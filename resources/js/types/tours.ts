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
    durationDays: number;
    duration: string;
    difficulty: TourDifficulty;
    travelStyle: TourTravelStyle;
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
