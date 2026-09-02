import type {
    AccommodationLevel,
    DateFlexibility,
    DietaryRequirement,
    DomesticTravelPreference,
    FlightAssistance,
    GroupType,
    GuideGender,
    GuideLanguage,
    InsuranceStatus,
    PreferredContactMethod,
    RoomPreference,
    RoutePreference,
    TransportCoverage,
    TravelInterest,
    VehiclePreference,
    VisaStatus,
} from '@/types/customBooking';

export interface ChoiceOption<T extends string = string> {
    value: T;
    label: string;
    description?: string;
}

export const FALLBACK_DESTINATIONS = [
    'Kabul',
    'Bamyan',
    'Herat',
    'Balkh / Mazar-e-Sharif',
    'Panjshir',
    'Badakhshan',
    'Nuristan',
    'Kandahar',
    'Ghazni',
    'Other',
] as const;

export const FALLBACK_SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'] as const;

export const OTHER_DESTINATION_VALUE = 'Other';
export const RECOMMEND_SEASON_VALUE = 'recommend';

export const DATE_FLEXIBILITY_OPTIONS: readonly ChoiceOption<DateFlexibility>[] = [
    { value: 'exact', label: 'Exact date' },
    { value: 'plus_minus_3', label: 'Flexible ±3 days' },
    { value: 'plus_minus_week', label: 'Flexible ±1 week' },
    { value: 'within_month', label: 'Flexible within the month' },
    { value: 'unsure', label: 'I am not sure yet' },
];

export const TRAVEL_INTEREST_OPTIONS: readonly ChoiceOption<TravelInterest>[] = [
    { value: 'culture', label: 'Culture & History' },
    { value: 'nature', label: 'Nature & Landscapes' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'photography', label: 'Photography' },
    { value: 'communities', label: 'Local Communities' },
    { value: 'food', label: 'Food & Traditions' },
];

export const ROUTE_PREFERENCE_OPTIONS: readonly ChoiceOption<RoutePreference>[] = [
    {
        value: 'know',
        label: 'I know the destinations I want',
        description: 'We will plan around the places you select.',
    },
    {
        value: 'recommend',
        label: 'Recommend the best route',
        description: 'Our team will suggest destinations and a sequence.',
    },
    {
        value: 'mix',
        label: 'Mix my selected destinations with your recommendations',
        description: 'We will keep your picks and fill the gaps.',
    },
];

export const GROUP_TYPE_OPTIONS: readonly ChoiceOption<GroupType>[] = [
    { value: 'solo', label: 'Solo' },
    { value: 'couple', label: 'Couple' },
    { value: 'family', label: 'Family' },
    { value: 'friends', label: 'Friends' },
    { value: 'private_group', label: 'Private group' },
];

export const SERVICE_OPTIONS = [
    {
        key: 'guide',
        label: 'Tour guide',
        description: 'A local guide for your itinerary.',
    },
    {
        key: 'transportation',
        label: 'Transportation',
        description: 'Vehicle with a professional driver.',
    },
    {
        key: 'accommodation',
        label: 'Accommodation',
        description: 'Stays arranged along the route.',
    },
    {
        key: 'airport',
        label: 'Airport pickup/drop-off',
        description: 'Arrival and departure assistance.',
    },
    {
        key: 'domestic',
        label: 'Domestic travel arrangements',
        description: 'Road or domestic flights between regions.',
    },
] as const;

export type PackageServiceKey = (typeof SERVICE_OPTIONS)[number]['key'];

export const PACKAGE_SERVICE_KEYS: readonly PackageServiceKey[] = SERVICE_OPTIONS.map(
    (option) => option.key,
);

export const GUIDE_GENDER_OPTIONS: readonly ChoiceOption<GuideGender>[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
];

export const GUIDE_LANGUAGE_OPTIONS: readonly ChoiceOption<GuideLanguage>[] = [
    { value: 'english', label: 'English' },
    { value: 'dari', label: 'Dari' },
    { value: 'pashto', label: 'Pashto' },
    { value: 'german', label: 'German' },
    { value: 'other', label: 'Other' },
];

export const VEHICLE_OPTIONS: readonly ChoiceOption<VehiclePreference>[] = [
    { value: 'standard', label: 'Standard car' },
    { value: 'suv', label: 'SUV / 4×4' },
    { value: 'minivan', label: 'Minivan' },
    { value: 'larger', label: 'Larger group vehicle' },
    { value: 'recommend', label: 'Recommend the most suitable vehicle' },
];

export const TRANSPORT_COVERAGE_OPTIONS: readonly ChoiceOption<TransportCoverage>[] = [
    { value: 'entire', label: 'Entire trip' },
    { value: 'selected', label: 'Selected destinations/days' },
    { value: 'airport_only', label: 'Airport transfers only' },
];

export const ACCOMMODATION_LEVEL_OPTIONS: readonly ChoiceOption<AccommodationLevel>[] = [
    { value: 'standard', label: 'Standard' },
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'premium', label: 'Premium / best available' },
    { value: 'recommend', label: 'Recommend based on destination' },
];

export const ROOM_PREFERENCE_OPTIONS: readonly ChoiceOption<RoomPreference>[] = [
    { value: 'single', label: 'Single' },
    { value: 'double', label: 'Double' },
    { value: 'twin', label: 'Twin' },
    { value: 'family', label: 'Family / multiple rooms' },
];

export const FLIGHT_ASSISTANCE_OPTIONS: readonly ChoiceOption<FlightAssistance>[] = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'not_yet', label: 'Flight details not available yet' },
];

export const DOMESTIC_TRAVEL_OPTIONS: readonly ChoiceOption<DomesticTravelPreference>[] = [
    { value: 'road', label: 'Road transportation' },
    { value: 'flight', label: 'Domestic flight where available' },
    { value: 'recommend', label: 'Recommend the best option' },
];

export const VISA_STATUS_OPTIONS: readonly ChoiceOption<VisaStatus>[] = [
    { value: 'obtained', label: 'Already obtained' },
    { value: 'applying', label: 'Applying independently' },
    { value: 'guidance', label: 'Need guidance' },
    { value: 'not_started', label: 'Not started yet' },
];

export const INSURANCE_STATUS_OPTIONS: readonly ChoiceOption<InsuranceStatus>[] = [
    { value: 'arranged', label: 'Already arranged' },
    { value: 'will_arrange', label: 'Will arrange before travel' },
    { value: 'guidance', label: 'Need general guidance' },
];

export const DIETARY_OPTIONS: readonly ChoiceOption<DietaryRequirement>[] = [
    { value: 'none', label: 'None' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'halal', label: 'Halal' },
    { value: 'gluten_free', label: 'Gluten-free' },
    { value: 'allergy', label: 'Food allergy' },
    { value: 'other', label: 'Other' },
];

export const CONTACT_METHOD_OPTIONS: readonly ChoiceOption<PreferredContactMethod>[] = [
    { value: 'email', label: 'Email' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'phone', label: 'Phone' },
];

export const MIN_DURATION_DAYS = 1;
export const MAX_DURATION_DAYS = 45;
export const MAX_ADULTS = 12;
export const MAX_CHILDREN = 8;
export const MAX_TRAVELERS = 16;

export function destinationChoices(fromServer: readonly string[]): string[] {
    const source = fromServer.length > 0 ? fromServer : FALLBACK_DESTINATIONS;
    const names = source.map((name) => name.trim()).filter(Boolean);
    const hasOther = names.some((name) => name.toLowerCase() === OTHER_DESTINATION_VALUE.toLowerCase());

    return hasOther ? names : [...names, OTHER_DESTINATION_VALUE];
}

export function seasonChoices(fromServer: readonly string[], recommendLabel = 'Recommend the best time'): ChoiceOption[] {
    const source = fromServer.length > 0 ? fromServer : FALLBACK_SEASONS;
    const options = source
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name) => ({ value: name, label: name }));

    const hasRecommend = options.some((option) => option.value.toLowerCase().includes('recommend'));

    if (!hasRecommend) {
        options.push({
            value: RECOMMEND_SEASON_VALUE,
            label: recommendLabel,
        });
    }

    return options;
}

export function optionLabel<T extends string>(
    options: readonly ChoiceOption<T>[],
    value: T | '',
): string {
    if (value === '') {
        return '';
    }

    return options.find((option) => option.value === value)?.label ?? value;
}
