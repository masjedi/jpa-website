export type TourDifficulty = 'Easy' | 'Moderate' | 'Demanding' | 'Expedition';

export type TourTravelStyle =
    | 'Cultural & Heritage'
    | 'Adventure & Trekking'
    | 'Photography Focus'
    | 'Silk Road History'
    | 'Small Group Expedition';

export type TourSeason = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Year-round';

export type DepartureStatus =
    | 'Guaranteed'
    | 'Limited Availability'
    | 'Open for Inquiries'
    | 'Almost Full'
    | 'On Request';

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
    highlights: readonly string[];
    itineraryOverview: readonly TourItineraryDay[];
    inclusions: readonly string[];
    estimatedStartingPrice: string;
    nextDeparture: {
        date: string;
        status: DepartureStatus;
    };
}

export interface TourPackage {
    id: string;
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
    isPopular?: boolean;
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
