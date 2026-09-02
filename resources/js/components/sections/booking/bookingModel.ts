import {
    MAX_TRAVELERS,
    PACKAGE_SERVICE_KEYS,
    type PackageServiceKey,
} from '@/components/sections/booking/bookingOptions';
import type {
    CompanionTraveler,
    CustomBookingState,
    CustomBookingSuccess,
    GroupType,
    RoomPreference,
    ServicesState,
    TravelerDocument,
} from '@/types/customBooking';

export function emptyCompanion(): CompanionTraveler {
    return {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nationality: '',
    };
}

export function emptyPassport(): TravelerDocument {
    return {
        issuingCountry: '',
        expiryDate: '',
    };
}

export function createInitialBookingState(): CustomBookingState {
    return {
        trip: {
            startDate: '',
            flexibility: '',
            season: '',
            durationDays: 7,
            destinations: [],
            otherDestination: '',
            recommendDestinations: false,
            interests: [],
            routePreference: '',
        },
        travelers: {
            adults: 2,
            children: 0,
            primary: {
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                nationality: '',
                email: '',
                phone: '',
                countryOfResidence: '',
            },
            companions: [emptyCompanion()],
            groupType: '',
        },
        services: {
            complete: false,
            guide: false,
            transportation: false,
            accommodation: false,
            airport: false,
            domestic: false,
            guideGender: '',
            guideLanguage: '',
            guideLanguageOther: '',
            guideRequest: '',
            vehicle: '',
            transportCoverage: '',
            transportNotes: '',
            accommodationLevel: '',
            roomPreference: '',
            roomCount: 1,
            roomsManual: false,
            accommodationNotes: '',
            arrivalAssistance: '',
            arrivalDetailsLater: false,
            arrivalAirport: '',
            arrivalDate: '',
            arrivalTime: '',
            arrivalFlight: '',
            departureAssistance: '',
            departureDetailsLater: false,
            departureAirport: '',
            departureDate: '',
            departureTime: '',
            departureFlight: '',
            domesticPreference: '',
        },
        documents: {
            passports: [emptyPassport(), emptyPassport()],
            visaStatus: '',
            insuranceStatus: '',
        },
        requirements: {
            emergencyName: '',
            emergencyRelationship: '',
            emergencyPhone: '',
            dietary: '',
            dietaryDetails: '',
            medical: '',
            medicalDetails: '',
            contactMethod: '',
            specialRequests: '',
        },
        agreements: {
            accuracy: false,
            terms: false,
            privacy: false,
            marketing: false,
        },
    };
}

export function travelerCount(adults: number, children: number): number {
    return Math.max(1, adults + children);
}

export function companionCount(adults: number, children: number): number {
    return Math.max(0, travelerCount(adults, children) - 1);
}

export function inferredGroupType(adults: number, children: number): GroupType | null {
    if (children > 0) {
        return 'family';
    }

    if (adults === 1) {
        return 'solo';
    }

    if (adults === 2) {
        return 'couple';
    }

    return null;
}

export function suggestedRoomCount(
    adults: number,
    children: number,
    roomPreference: RoomPreference | '',
): number {
    const people = travelerCount(adults, children);

    if (roomPreference === 'single') {
        return Math.max(1, adults);
    }

    if (roomPreference === 'family') {
        return Math.max(1, Math.ceil(people / 4));
    }

    return Math.max(1, Math.ceil(people / 2));
}

export function seasonFromDate(isoDate: string): string {
    const month = Number(isoDate.slice(5, 7));

    if (!Number.isFinite(month) || month < 1) {
        return '';
    }

    if (month >= 3 && month <= 5) {
        return 'Spring';
    }

    if (month >= 6 && month <= 8) {
        return 'Summer';
    }

    if (month >= 9 && month <= 11) {
        return 'Autumn';
    }

    return 'Winter';
}

export function matchSeasonLabel(season: string, options: readonly string[]): string {
    if (season === '' || options.length === 0) {
        return season;
    }

    const lower = season.toLowerCase();
    return options.find((option) => option.toLowerCase().includes(lower)) ?? season;
}

export function resolvedSeason(
    flexibility: CustomBookingState['trip']['flexibility'],
    startDate: string,
    selectedSeason: string,
    seasonOptions: readonly string[],
): string {
    if (flexibility !== 'unsure' && startDate !== '') {
        return matchSeasonLabel(seasonFromDate(startDate), seasonOptions);
    }

    return selectedSeason;
}

export function destinationsNeeded(
    recommendDestinations: boolean,
    routePreference: CustomBookingState['trip']['routePreference'],
): boolean {
    if (recommendDestinations || routePreference === 'recommend') {
        return false;
    }

    return routePreference === 'know' || routePreference === 'mix';
}

function resizeList<T>(items: T[], length: number, createItem: () => T): T[] {
    const nextLength = Math.max(0, length);

    if (items.length === nextLength) {
        return items;
    }

    if (items.length > nextLength) {
        return items.slice(0, nextLength);
    }

    return [...items, ...Array.from({ length: nextLength - items.length }, createItem)];
}

export function syncTravelerLists(
    state: CustomBookingState,
    adults: number,
    children: number,
): CustomBookingState {
    const total = Math.min(MAX_TRAVELERS, travelerCount(adults, children));
    const nextCompanions = resizeList(state.travelers.companions, Math.max(0, total - 1), emptyCompanion);
    const nextPassports = resizeList(state.documents.passports, total, emptyPassport);
    const nextRoomCount = state.services.roomsManual
        ? state.services.roomCount
        : suggestedRoomCount(adults, children, state.services.roomPreference);

    return {
        ...state,
        travelers: {
            ...state.travelers,
            adults,
            children,
            companions: nextCompanions,
        },
        documents: {
            ...state.documents,
            passports: nextPassports,
        },
        services: {
            ...state.services,
            roomCount: nextRoomCount,
        },
    };
}

export function withRoomPreference(
    state: CustomBookingState,
    roomPreference: RoomPreference | '',
): CustomBookingState {
    const roomCount = state.services.roomsManual
        ? state.services.roomCount
        : suggestedRoomCount(state.travelers.adults, state.travelers.children, roomPreference);

    return {
        ...state,
        services: {
            ...state.services,
            roomPreference,
            roomCount,
        },
    };
}

export function toggleService(
    services: ServicesState,
    key: PackageServiceKey | 'complete',
): ServicesState {
    if (key === 'complete') {
        const complete = !services.complete;

        if (!complete) {
            return { ...services, complete: false };
        }

        return {
            ...services,
            complete: true,
            guide: true,
            transportation: true,
            accommodation: true,
            airport: true,
            domestic: true,
        };
    }

    const nextValue = !services[key];
    const next: ServicesState = {
        ...services,
        [key]: nextValue,
        complete: false,
    };

    const allSelected = PACKAGE_SERVICE_KEYS.every((serviceKey) => next[serviceKey]);

    return {
        ...next,
        complete: allSelected,
    };
}

export function createRequestReference(now = new Date()): string {
    const year = now.getFullYear();
    const serial = String(Math.floor(10000 + Math.random() * 90000));

    return `JTP-${year}-${serial}`;
}

export function buildSuccessSummary(state: CustomBookingState): CustomBookingSuccess {
    return {
        reference: createRequestReference(),
        status: 'under_review',
        firstName: state.travelers.primary.firstName.trim(),
        preferredDate: state.trip.startDate,
        travelerCount: travelerCount(state.travelers.adults, state.travelers.children),
        email: state.travelers.primary.email.trim(),
    };
}

export function todayIsoDate(): string {
    return new Date().toISOString().slice(0, 10);
}

export function maxStartIsoDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 3);

    return date.toISOString().slice(0, 10);
}

export function minBirthIsoDate(): string {
    return '1900-01-01';
}

export function displayDate(isoDate: string): string {
    if (isoDate === '') {
        return '';
    }

    const parsed = new Date(`${isoDate}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
        return isoDate;
    }

    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(parsed);
}

export function maskPhone(value: string): string {
    const compact = value.replace(/\s+/g, '');

    if (compact.length < 6) {
        return compact === '' ? '' : 'Provided';
    }

    return `${compact.slice(0, 4)} ··· ${compact.slice(-2)}`;
}

export function maskFlight(value: string): string {
    const compact = value.replace(/\s+/g, '').toUpperCase();

    if (compact === '') {
        return '';
    }

    if (compact.length < 4) {
        return 'Provided';
    }

    return `${compact.slice(0, 2)}··${compact.slice(-1)}`;
}

export function sensitiveProvided(value: string): string {
    return value.trim() === '' ? 'Not provided' : 'Provided';
}
