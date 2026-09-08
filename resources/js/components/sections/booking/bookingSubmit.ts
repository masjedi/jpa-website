import type { BookingErrors, CustomBookingState } from '@/types/customBooking';

const SERVER_FIELD_MAP: Record<string, string> = {
    'services.complete': 'services-arrangement',
    'trip.destinations': 'trip-destinations',
    'trip.destinations.0': 'trip-destinations',
    'services.guideLanguages': 'services-guideLanguages',
    'services.guideLanguages.0': 'services-guideLanguages',
    'requirements.dietary': 'requirements-dietary',
    'requirements.dietary.0': 'requirements-dietary',
    'travelers.children': 'travelers-children',
    'travelers.groupType': 'travelers-groupType',
};

export function buildBookingPayload(state: CustomBookingState): CustomBookingState {
    return {
        trip: {
            ...state.trip,
            otherDestination: state.trip.otherDestination.trim(),
        },
        travelers: {
            ...state.travelers,
            primary: {
                ...state.travelers.primary,
                firstName: state.travelers.primary.firstName.trim(),
                lastName: state.travelers.primary.lastName.trim(),
                email: state.travelers.primary.email.trim(),
                phone: state.travelers.primary.phone.trim(),
                nationality: state.travelers.primary.nationality.trim(),
                countryOfResidence: state.travelers.primary.countryOfResidence.trim(),
            },
            companions: state.travelers.companions.map((companion) => ({
                ...companion,
                firstName: companion.firstName.trim(),
                lastName: companion.lastName.trim(),
                email: companion.email.trim(),
                phone: companion.phone.trim(),
                nationality: companion.nationality.trim(),
                countryOfResidence: companion.countryOfResidence.trim(),
            })),
        },
        services: {
            ...state.services,
            complete: false,
            guide: true,
            transportation: true,
            accommodation: true,
            domestic: true,
            airport: state.services.airportPickup === 'yes',
            guideLanguage: state.services.guideLanguages[0] ?? '',
        },
        documents: {
            ...state.documents,
            insuranceStatus: state.documents.insuranceStatus === '' ? 'will_arrange' : state.documents.insuranceStatus,
        },
        requirements: {
            ...state.requirements,
            emergencyName: state.requirements.emergencyName.trim(),
            emergencyRelationship: state.requirements.emergencyRelationship.trim(),
            emergencyPhone: state.requirements.emergencyPhone.trim(),
            dietaryDetails: state.requirements.dietaryDetails.trim(),
            medicalDetails: '',
            specialRequests: '',
        },
        agreements: state.agreements,
    };
}

export function mapServerBookingErrors(errors: Record<string, string | string[]>): BookingErrors {
    const mapped: BookingErrors = {};

    Object.entries(errors).forEach(([key, value]) => {
        const message = Array.isArray(value) ? value[0] : value;
        if (message === undefined || message === '') {
            return;
        }

        mapped[mapServerField(key)] = message;
    });

    return mapped;
}

function mapServerField(key: string): string {
    if (SERVER_FIELD_MAP[key]) {
        return SERVER_FIELD_MAP[key];
    }

    const companion = key.match(/^travelers\.companions\.(\d+)\.(.+)$/);
    if (companion) {
        return `companion-${companion[1]}-${companion[2]}`;
    }

    const passport = key.match(/^documents\.passports\.(\d+)\.(.+)$/);
    if (passport) {
        return `doc-${passport[1]}-${passport[2]}`;
    }

    const primary = key.match(/^travelers\.primary\.(.+)$/);
    if (primary) {
        return `primary-${primary[1]}`;
    }

    const grouped = key.match(/^(trip|travelers|services|documents|requirements|agreements)\.(.+)$/);
    if (grouped) {
        return `${grouped[1]}-${grouped[2]}`;
    }

    return key;
}
