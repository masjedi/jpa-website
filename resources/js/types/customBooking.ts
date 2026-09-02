export type CustomBookingStatus =
    | 'draft'
    | 'submitted'
    | 'under_review'
    | 'quotation_sent'
    | 'customer_accepted'
    | 'deposit_pending'
    | 'confirmed';

export const CUSTOM_BOOKING_STATUS_ORDER = [
    'draft',
    'submitted',
    'under_review',
    'quotation_sent',
    'customer_accepted',
    'deposit_pending',
    'confirmed',
] as const satisfies readonly CustomBookingStatus[];

export const CUSTOM_BOOKING_STATUS_LABELS: Record<CustomBookingStatus, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    under_review: 'Under Review',
    quotation_sent: 'Quotation Sent',
    customer_accepted: 'Customer Accepted',
    deposit_pending: 'Deposit Pending',
    confirmed: 'Confirmed',
};

export type DateFlexibility =
    | 'exact'
    | 'plus_minus_3'
    | 'plus_minus_week'
    | 'within_month'
    | 'unsure';

export type RoutePreference = 'know' | 'recommend' | 'mix';

export type TravelInterest =
    | 'culture'
    | 'nature'
    | 'adventure'
    | 'photography'
    | 'communities'
    | 'food';

export type GroupType = 'solo' | 'couple' | 'family' | 'friends' | 'private_group';

export type GuideLanguage = 'english' | 'dari' | 'pashto' | 'german' | 'other';

export type GuideGender = 'male' | 'female';

export type VehiclePreference =
    | 'standard'
    | 'suv'
    | 'minivan'
    | 'larger'
    | 'recommend';

export type TransportCoverage = 'entire' | 'selected' | 'airport_only';

export type AccommodationLevel = 'standard' | 'comfortable' | 'premium' | 'recommend';

export type RoomPreference = 'single' | 'double' | 'twin' | 'family';

export type FlightAssistance = 'yes' | 'no' | 'not_yet';

export type DomesticTravelPreference = 'road' | 'flight' | 'recommend';

export type VisaStatus = 'obtained' | 'applying' | 'guidance' | 'not_started';

export type InsuranceStatus = 'arranged' | 'will_arrange' | 'guidance';

export type DietaryRequirement =
    | 'none'
    | 'vegetarian'
    | 'vegan'
    | 'halal'
    | 'gluten_free'
    | 'allergy'
    | 'other';

export type MedicalNeed = 'no' | 'yes';

export type PreferredContactMethod = 'email' | 'whatsapp' | 'phone';

export interface CompanionTraveler {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
}

export interface PrimaryTraveler extends CompanionTraveler {
    email: string;
    phone: string;
    countryOfResidence: string;
}

export interface TravelerDocument {
    issuingCountry: string;
    expiryDate: string;
}

export interface TripPreferences {
    startDate: string;
    flexibility: DateFlexibility | '';
    season: string;
    durationDays: number;
    destinations: string[];
    otherDestination: string;
    recommendDestinations: boolean;
    interests: TravelInterest[];
    routePreference: RoutePreference | '';
}

export interface TravelersState {
    adults: number;
    children: number;
    primary: PrimaryTraveler;
    companions: CompanionTraveler[];
    groupType: GroupType | '';
}

export interface ServicesState {
    complete: boolean;
    guide: boolean;
    transportation: boolean;
    accommodation: boolean;
    airport: boolean;
    domestic: boolean;
    guideGender: GuideGender | '';
    guideLanguage: GuideLanguage | '';
    guideLanguageOther: string;
    guideRequest: string;
    vehicle: VehiclePreference | '';
    transportCoverage: TransportCoverage | '';
    transportNotes: string;
    accommodationLevel: AccommodationLevel | '';
    roomPreference: RoomPreference | '';
    roomCount: number;
    roomsManual: boolean;
    accommodationNotes: string;
    arrivalAssistance: FlightAssistance | '';
    arrivalDetailsLater: boolean;
    arrivalAirport: string;
    arrivalDate: string;
    arrivalTime: string;
    arrivalFlight: string;
    departureAssistance: FlightAssistance | '';
    departureDetailsLater: boolean;
    departureAirport: string;
    departureDate: string;
    departureTime: string;
    departureFlight: string;
    domesticPreference: DomesticTravelPreference | '';
}

export interface DocumentsState {
    passports: TravelerDocument[];
    visaStatus: VisaStatus | '';
    insuranceStatus: InsuranceStatus | '';
}

export interface RequirementsState {
    emergencyName: string;
    emergencyRelationship: string;
    emergencyPhone: string;
    dietary: DietaryRequirement | '';
    dietaryDetails: string;
    medical: MedicalNeed | '';
    medicalDetails: string;
    contactMethod: PreferredContactMethod | '';
    specialRequests: string;
}

export interface AgreementsState {
    accuracy: boolean;
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
}

export interface CustomBookingState {
    trip: TripPreferences;
    travelers: TravelersState;
    services: ServicesState;
    documents: DocumentsState;
    requirements: RequirementsState;
    agreements: AgreementsState;
}

export interface CustomBookingSuccess {
    reference: string;
    status: CustomBookingStatus;
    firstName: string;
    preferredDate: string;
    travelerCount: number;
    email: string;
}

export interface BookingPageProps {
    destinations: string[];
    seasons: string[];
}

export type BookingErrors = Record<string, string>;

export const CUSTOM_BOOKING_STEPS = [
    { id: 'trip', title: 'Trip Preferences', shortTitle: 'Trip' },
    { id: 'travelers', title: 'Travelers', shortTitle: 'Travelers' },
    { id: 'services', title: 'Services', shortTitle: 'Services' },
    { id: 'documents', title: 'Travel Documents', shortTitle: 'Documents' },
    { id: 'requirements', title: 'Requirements & Contact', shortTitle: 'Requirements' },
    { id: 'review', title: 'Review & Request', shortTitle: 'Review' },
] as const;

export const CUSTOM_BOOKING_STEP_COUNT = CUSTOM_BOOKING_STEPS.length;
