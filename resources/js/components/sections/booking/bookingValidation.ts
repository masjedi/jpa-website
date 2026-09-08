import {
    AFGHANISTAN_PROVINCE_NAMES,
    MAX_DURATION_DAYS,
    MAX_GUIDES,
    MAX_TRAVELERS,
    MIN_DURATION_DAYS,
} from '@/components/sections/booking/bookingOptions';
import {
    destinationsNeeded,
    durationDaysFromRange,
    todayIsoDate,
    travelerCount,
} from '@/components/sections/booking/bookingModel';
import type { BookingErrors, CustomBookingState } from '@/types/customBooking';

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PHONE_PATTERN = /^\+[1-9]\d{6,14}$/;
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function compactPhone(value: string): string {
    return value.replace(/[\s()-]/g, '');
}

function required(errors: BookingErrors, key: string, value: string, message: string): void {
    if (value.trim() === '') {
        errors[key] = message;
    }
}

function requireName(errors: BookingErrors, key: string, value: string, message: string): void {
    const trimmed = value.trim();

    if (trimmed.length < 2) {
        errors[key] = message;
        return;
    }

    if (trimmed.length > 80) {
        errors[key] = 'Use a shorter name, as shown on the travel document.';
        return;
    }

    if (!NAME_PATTERN.test(trimmed)) {
        errors[key] = 'Use letters only, as shown on the travel document.';
    }
}

function isValidEmail(value: string): boolean {
    const email = value.trim();

    if (email.length < 5 || email.length > 254 || /\s/.test(email) || email.includes('..')) {
        return false;
    }

    const at = email.indexOf('@');
    if (at < 1 || email.includes('@@') || at !== email.lastIndexOf('@')) {
        return false;
    }

    const domain = email.slice(at + 1);
    if (domain.startsWith('.') || domain.startsWith('-') || domain.endsWith('.') || domain.endsWith('-')) {
        return false;
    }

    return EMAIL_PATTERN.test(email);
}

function isIsoDate(value: string): boolean {
    return ISO_DATE_PATTERN.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

function requireEmail(errors: BookingErrors, key: string, value: string): void {
    const trimmed = value.trim();

    if (trimmed === '') {
        errors[key] = 'Enter an email address.';
        return;
    }

    if (!isValidEmail(trimmed)) {
        errors[key] = 'Enter a valid email address, for example name@example.com.';
    }
}

function requirePhone(errors: BookingErrors, key: string, value: string): void {
    const compact = compactPhone(value);

    if (value.trim() === '') {
        errors[key] = 'Enter a phone number with country code, for example +49 177 668 7088.';
        return;
    }

    if (!PHONE_PATTERN.test(compact)) {
        errors[key] = 'Enter a valid phone number with country code, for example +49 177 668 7088.';
    }
}

export function hasRequiredAgreements(state: CustomBookingState): boolean {
    return state.agreements.accuracy && state.agreements.terms && state.agreements.privacy;
}

export function firstErrorField(errors: BookingErrors): string | null {
    return Object.keys(errors)[0] ?? null;
}

export function stepForErrorField(fieldId: string): number {
    if (fieldId.startsWith('trip-')) {
        return 0;
    }

    if (
        fieldId.startsWith('primary-') ||
        fieldId.startsWith('travelers-') ||
        fieldId.startsWith('companion-')
    ) {
        return 1;
    }

    if (fieldId.startsWith('services-')) {
        return 2;
    }

    if (fieldId.startsWith('doc-') || fieldId.startsWith('documents-')) {
        return 3;
    }

    if (fieldId.startsWith('requirements-')) {
        return 4;
    }

    return 5;
}

export function validateTripPreferences(
    state: CustomBookingState,
    today = todayIsoDate(),
): BookingErrors {
    const errors: BookingErrors = {};
    const { trip } = state;

    if (trip.flexibility !== 'known' && trip.flexibility !== 'unsure') {
        errors['trip-flexibility'] = 'Choose whether you are sure about your travel dates.';
    }

    const datesUnknown = trip.flexibility === 'unsure';

    if (!datesUnknown) {
        required(errors, 'trip-startDate', trip.startDate, 'Choose a starting date.');
        required(errors, 'trip-endDate', trip.endDate, 'Choose an ending date.');

        if (trip.startDate !== '') {
            if (!isIsoDate(trip.startDate) || trip.startDate < today) {
                errors['trip-startDate'] = 'Choose a start date today or in the future.';
            }
        }

        if (trip.endDate !== '') {
            if (!isIsoDate(trip.endDate) || trip.endDate < today) {
                errors['trip-endDate'] = 'Choose an end date today or in the future.';
            } else if (trip.startDate !== '' && trip.endDate < trip.startDate) {
                errors['trip-endDate'] = 'The ending date must be on or after the starting date.';
            }
        }

        const calculatedDuration = durationDaysFromRange(trip.startDate, trip.endDate);

        if (calculatedDuration !== null) {
            if (calculatedDuration < MIN_DURATION_DAYS) {
                errors['trip-endDate'] = 'The ending date must be on or after the starting date.';
            } else if (calculatedDuration > MAX_DURATION_DAYS) {
                errors['trip-endDate'] =
                    `Choose dates within ${MAX_DURATION_DAYS} days, or ask us for a longer itinerary.`;
            }
        } else if (
            !Number.isInteger(trip.durationDays) ||
            trip.durationDays < MIN_DURATION_DAYS ||
            trip.durationDays > MAX_DURATION_DAYS
        ) {
            errors['trip-durationDays'] =
                `Enter a whole number of days between ${MIN_DURATION_DAYS} and ${MAX_DURATION_DAYS}.`;
        }
    }

    if (destinationsNeeded(trip.recommendDestinations, trip.routePreference) && trip.destinations.length === 0) {
        errors['trip-destinations'] = 'Select at least one destination, or ask us to recommend them.';
    }

    if (trip.destinations.some((name) => !AFGHANISTAN_PROVINCE_NAMES.includes(name))) {
        errors['trip-destinations'] = 'Choose provinces from the list.';
    }

    if (trip.interests.length === 0) {
        errors['trip-interests'] = 'Select at least one tour interest.';
    }

    if (trip.routePreference === '') {
        errors['trip-routePreference'] = 'Choose how you would like the itinerary planned.';
    }

    return errors;
}

export function validateTravelers(state: CustomBookingState, today = todayIsoDate()): BookingErrors {
    const errors: BookingErrors = {};
    const { travelers } = state;
    const { primary } = travelers;
    const isGroup = travelers.groupType === 'group';
    const total = isGroup ? travelers.adults : 1;
    const revealed = 1 + travelers.companions.length;

    if (travelers.groupType === '') {
        errors['travelers-groupType'] = 'Choose a group type.';
    }

    if (isGroup) {
        if (!Number.isInteger(travelers.adults) || travelers.adults < 2 || travelers.adults > MAX_TRAVELERS) {
            errors['travelers-adults'] = `Enter the number of tourists, between 2 and ${MAX_TRAVELERS}.`;
        } else if (revealed !== total) {
            errors['travelers-adults'] =
                `Add a tourist form for each person. You have ${revealed} of ${total} open.`;
        }
    }

    requireName(errors, 'primary-firstName', primary.firstName, 'Enter the first name from the travel document.');
    requireName(errors, 'primary-lastName', primary.lastName, 'Enter the last name from the travel document.');

    requireEmail(errors, 'primary-email', primary.email);
    requirePhone(errors, 'primary-phone', primary.phone);

    required(errors, 'primary-dateOfBirth', primary.dateOfBirth, 'Enter a date of birth.');
    if (primary.dateOfBirth !== '' && (!isIsoDate(primary.dateOfBirth) || primary.dateOfBirth > today)) {
        errors['primary-dateOfBirth'] = 'Enter a valid date of birth in the past.';
    }

    requireName(errors, 'primary-nationality', primary.nationality, 'Enter a nationality.');
    requireName(errors, 'primary-countryOfResidence', primary.countryOfResidence, 'Enter a country of residence.');
    if (primary.isFirstVisit !== 'yes' && primary.isFirstVisit !== 'no') {
        errors['primary-isFirstVisit'] = 'Choose YES or NO.';
    }

    travelers.companions.forEach((companion, index) => {
        requireName(
            errors,
            `companion-${index}-firstName`,
            companion.firstName,
            'Enter the first name from the travel document.',
        );
        requireName(
            errors,
            `companion-${index}-lastName`,
            companion.lastName,
            'Enter the last name from the travel document.',
        );
        requireEmail(errors, `companion-${index}-email`, companion.email);
        requirePhone(errors, `companion-${index}-phone`, companion.phone);
        required(errors, `companion-${index}-dateOfBirth`, companion.dateOfBirth, 'Enter a date of birth.');
        if (
            companion.dateOfBirth !== '' &&
            (!isIsoDate(companion.dateOfBirth) || companion.dateOfBirth > today)
        ) {
            errors[`companion-${index}-dateOfBirth`] = 'Enter a valid date of birth in the past.';
        }
        requireName(errors, `companion-${index}-nationality`, companion.nationality, 'Enter a nationality.');
        requireName(
            errors,
            `companion-${index}-countryOfResidence`,
            companion.countryOfResidence,
            'Enter a country of residence.',
        );
        if (companion.isFirstVisit !== 'yes' && companion.isFirstVisit !== 'no') {
            errors[`companion-${index}-isFirstVisit`] = 'Choose YES or NO.';
        }
    });

    return errors;
}

export function validateServices(state: CustomBookingState): BookingErrors {
    const errors: BookingErrors = {};
    const { services } = state;

    if (!Number.isInteger(services.guideCount) || services.guideCount < 1 || services.guideCount > MAX_GUIDES) {
        errors['services-guideCount'] = `Enter the number of guides, between 1 and ${MAX_GUIDES}.`;
    }

    if (services.guideLanguages.length === 0) {
        errors['services-guideLanguages'] = 'Choose at least one language.';
    }

    if (services.guideGender === '') {
        errors['services-guideGender'] = 'Choose male or female.';
    }

    if (services.vehicle === '') {
        errors['services-vehicle'] = 'Choose a type of vehicle.';
    }

    if (services.transportCoverage === '') {
        errors['services-transportCoverage'] = 'Choose transportation coverage.';
    }

    if (services.airportPickup !== 'yes' && services.airportPickup !== 'no') {
        errors['services-airportPickup'] = 'Choose YES or NO.';
    }

    if (services.domesticPreference === '') {
        errors['services-domesticPreference'] = 'Choose domestic transportation.';
    }

    if (services.accommodationLevel === '') {
        errors['services-accommodationLevel'] = 'Choose an accommodation level.';
    }

    if (services.roomPreference === '') {
        errors['services-roomPreference'] = 'Choose a room type.';
    }

    if (!Number.isInteger(services.roomCount) || services.roomCount < 1 || services.roomCount > 12) {
        errors['services-roomCount'] = 'Enter a whole number between 1 and 12 rooms.';
    }

    return errors;
}

export function validateDocuments(state: CustomBookingState, today = todayIsoDate()): BookingErrors {
    const errors: BookingErrors = {};
    const total = travelerCount(state.travelers.adults, state.travelers.children);

    state.documents.passports.slice(0, total).forEach((passport, index) => {
        required(
            errors,
            `doc-${index}-issuingCountry`,
            passport.issuingCountry,
            'Enter the passport issuing country.',
        );
        if (passport.issuingCountry.trim() !== '' && !NAME_PATTERN.test(passport.issuingCountry.trim())) {
            errors[`doc-${index}-issuingCountry`] = 'Enter a valid issuing country using letters only.';
        }
        required(errors, `doc-${index}-expiryDate`, passport.expiryDate, 'Enter the passport expiry date.');

        if (passport.expiryDate !== '' && (!isIsoDate(passport.expiryDate) || passport.expiryDate <= today)) {
            errors[`doc-${index}-expiryDate`] = 'Passport expiry should be a future date.';
        }
    });

    if (state.documents.visaStatus === '') {
        errors['documents-visaStatus'] = 'Choose your visa status.';
    }

    return errors;
}

export function validateRequirements(state: CustomBookingState): BookingErrors {
    const errors: BookingErrors = {};
    const { requirements } = state;

    requireName(errors, 'requirements-emergencyName', requirements.emergencyName, 'Enter an emergency contact name.');
    required(
        errors,
        'requirements-emergencyRelationship',
        requirements.emergencyRelationship,
        'Enter the relationship.',
    );

    requirePhone(errors, 'requirements-emergencyPhone', requirements.emergencyPhone);

    if (requirements.dietary.length === 0) {
        errors['requirements-dietary'] = 'Choose a dietary requirement.';
    }

    if (
        (requirements.dietary.includes('allergy') || requirements.dietary.includes('other')) &&
        requirements.dietaryDetails.trim() === ''
    ) {
        errors['requirements-dietaryDetails'] = 'Please add a short detail for this dietary requirement.';
    }

    if (requirements.medical === '') {
        errors['requirements-medical'] = 'Choose YES or NO.';
    }

    if (requirements.contactMethod === '') {
        errors['requirements-contactMethod'] = 'Choose a preferred contact method.';
    }

    return errors;
}

export function validateAgreements(state: CustomBookingState): BookingErrors {
    const errors: BookingErrors = {};

    if (!hasRequiredAgreements(state)) {
        if (!state.agreements.accuracy) {
            errors['agreements-accuracy'] = 'Please confirm that the information is accurate.';
        }

        if (!state.agreements.terms) {
            errors['agreements-terms'] = 'Please agree to the booking terms and cancellation policy.';
        }

        if (!state.agreements.privacy) {
            errors['agreements-privacy'] = 'Please acknowledge the privacy policy.';
        }
    }

    return errors;
}

export function validateBookingStep(step: number, state: CustomBookingState): BookingErrors {
    switch (step) {
        case 0:
            return validateTripPreferences(state);
        case 1:
            return validateTravelers(state);
        case 2:
            return validateServices(state);
        case 3:
            return validateDocuments(state);
        case 4:
            return validateRequirements(state);
        case 5:
            return validateAgreements(state);
        default:
            return {};
    }
}

export function validateAllBookingSteps(
    state: CustomBookingState,
): { step: number; errors: BookingErrors } | null {
    for (let step = 0; step < 6; step += 1) {
        const errors = validateBookingStep(step, state);

        if (Object.keys(errors).length > 0) {
            return { step, errors };
        }
    }

    return null;
}
