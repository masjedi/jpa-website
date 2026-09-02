import {
    MAX_ADULTS,
    MAX_CHILDREN,
    MAX_DURATION_DAYS,
    MAX_TRAVELERS,
    MIN_DURATION_DAYS,
    OTHER_DESTINATION_VALUE,
} from '@/components/sections/booking/bookingOptions';
import {
    companionCount,
    destinationsNeeded,
    inferredGroupType,
    todayIsoDate,
    travelerCount,
} from '@/components/sections/booking/bookingModel';
import type { BookingErrors, CustomBookingState } from '@/types/customBooking';

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PHONE_PATTERN = /^\+[1-9]\d{6,14}$/;
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;
const PLACE_PATTERN = /^[\p{L}\p{M}\d][\p{L}\p{M}\d\s.'()\-/]*$/u;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;
const FLIGHT_PATTERN = /^[A-Z]{1,3}\d{1,4}[A-Z]?$/i;

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

function isValidTime(value: string): boolean {
    return TIME_PATTERN.test(value.trim());
}

function isValidFlightNumber(value: string): boolean {
    return FLIGHT_PATTERN.test(value.replace(/\s+/g, ''));
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

function requireOptionalIsoDate(errors: BookingErrors, key: string, value: string, message: string): void {
    if (value.trim() === '') {
        return;
    }

    if (!isIsoDate(value)) {
        errors[key] = message;
    }
}

function requireOptionalTime(errors: BookingErrors, key: string, value: string): void {
    if (value.trim() === '') {
        return;
    }

    if (!isValidTime(value)) {
        errors[key] = 'Enter a valid time, for example 14:30.';
    }
}

function requireOptionalFlight(errors: BookingErrors, key: string, value: string): void {
    const trimmed = value.trim();

    if (trimmed === '') {
        return;
    }

    if (trimmed.length > 12 || !isValidFlightNumber(trimmed)) {
        errors[key] = 'Enter a valid flight number, for example TK 712.';
    }
}

function requirePlaceName(errors: BookingErrors, key: string, value: string, emptyMessage: string): void {
    const trimmed = value.trim();

    if (trimmed === '') {
        errors[key] = emptyMessage;
        return;
    }

    if (trimmed.length > 80 || !PLACE_PATTERN.test(trimmed)) {
        errors[key] = 'Enter a valid airport or city name.';
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

    if (trip.flexibility === '') {
        errors['trip-flexibility'] = 'Choose how flexible your start date is.';
    }

    const needsStartDate = trip.flexibility !== '' && trip.flexibility !== 'unsure';

    if (needsStartDate) {
        required(errors, 'trip-startDate', trip.startDate, 'Choose a preferred start date.');
    }

    if (trip.startDate !== '') {
        if (!isIsoDate(trip.startDate) || trip.startDate < today) {
            errors['trip-startDate'] = 'Choose a start date today or in the future.';
        }
    }

    if (trip.flexibility === 'unsure' && trip.season === '') {
        errors['trip-season'] = 'Choose a preferred season, or ask us to recommend one.';
    }

    if (
        !Number.isInteger(trip.durationDays) ||
        trip.durationDays < MIN_DURATION_DAYS ||
        trip.durationDays > MAX_DURATION_DAYS
    ) {
        errors['trip-durationDays'] =
            `Enter a whole number of days between ${MIN_DURATION_DAYS} and ${MAX_DURATION_DAYS}.`;
    }

    if (destinationsNeeded(trip.recommendDestinations, trip.routePreference) && trip.destinations.length === 0) {
        errors['trip-destinations'] = 'Select at least one destination, or ask us to recommend them.';
    }

    if (trip.destinations.includes(OTHER_DESTINATION_VALUE) && trip.otherDestination.trim() === '') {
        errors['trip-otherDestination'] = 'Tell us which other destination you have in mind.';
    }

    if (trip.interests.length === 0) {
        errors['trip-interests'] = 'Select at least one travel interest.';
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

    if (!Number.isInteger(travelers.adults) || travelers.adults < 1 || travelers.adults > MAX_ADULTS) {
        errors['travelers-adults'] = `Enter a whole number between 1 and ${MAX_ADULTS} adults.`;
    }

    if (
        !Number.isInteger(travelers.children) ||
        travelers.children < 0 ||
        travelers.children > MAX_CHILDREN
    ) {
        errors['travelers-children'] = `Enter a whole number between 0 and ${MAX_CHILDREN} children.`;
    }

    if (travelers.adults + travelers.children > MAX_TRAVELERS) {
        errors['travelers-adults'] = `The group cannot exceed ${MAX_TRAVELERS} travelers.`;
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

    if (travelers.companions.length !== companionCount(travelers.adults, travelers.children)) {
        errors['travelers-adults'] = 'Traveler details do not match the selected traveler count. Please adjust the numbers.';
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
        required(errors, `companion-${index}-dateOfBirth`, companion.dateOfBirth, 'Enter a date of birth.');
        if (
            companion.dateOfBirth !== '' &&
            (!isIsoDate(companion.dateOfBirth) || companion.dateOfBirth > today)
        ) {
            errors[`companion-${index}-dateOfBirth`] = 'Enter a valid date of birth in the past.';
        }
        requireName(errors, `companion-${index}-nationality`, companion.nationality, 'Enter a nationality.');
    });

    if (inferredGroupType(travelers.adults, travelers.children) === null && travelers.groupType === '') {
        errors['travelers-groupType'] = 'Choose a group type.';
    }

    return errors;
}

export function validateServices(state: CustomBookingState): BookingErrors {
    const errors: BookingErrors = {};
    const { services } = state;

    if (
        !services.complete &&
        !services.guide &&
        !services.transportation &&
        !services.accommodation &&
        !services.airport &&
        !services.domestic
    ) {
        errors['services-arrangement'] = 'Select at least one service, or choose a complete custom package.';
    }

    if (services.guide) {
        if (services.guideGender === '') {
            errors['services-guideGender'] = 'Choose a male or female guide.';
        }

        if (services.guideLanguage === '') {
            errors['services-guideLanguage'] = 'Choose a preferred guide language.';
        }

        if (services.guideLanguage === 'other' && services.guideLanguageOther.trim() === '') {
            errors['services-guideLanguageOther'] = 'Tell us which language you prefer.';
        }
    }

    if (services.transportation) {
        if (services.vehicle === '') {
            errors['services-vehicle'] = 'Choose a vehicle preference.';
        }

        if (services.transportCoverage === '') {
            errors['services-transportCoverage'] = 'Choose how much of the trip needs transport.';
        }

        if (services.transportCoverage === 'selected' && services.transportNotes.trim() === '') {
            errors['services-transportNotes'] = 'Describe where transport is needed.';
        }
    }

    if (services.accommodation) {
        if (services.accommodationLevel === '') {
            errors['services-accommodationLevel'] = 'Choose an accommodation level.';
        }

        if (services.roomPreference === '') {
            errors['services-roomPreference'] = 'Choose a room preference.';
        }

        if (!Number.isInteger(services.roomCount) || services.roomCount < 1 || services.roomCount > 12) {
            errors['services-roomCount'] = 'Enter a whole number between 1 and 12 rooms.';
        }
    }

    if (services.airport) {
        if (services.arrivalAssistance === '') {
            errors['services-arrivalAssistance'] = 'Tell us whether you need arrival assistance.';
        }

        if (services.arrivalAssistance === 'yes' && !services.arrivalDetailsLater) {
            requirePlaceName(
                errors,
                'services-arrivalAirport',
                services.arrivalAirport,
                'Enter the arrival airport.',
            );
            requireOptionalIsoDate(
                errors,
                'services-arrivalDate',
                services.arrivalDate,
                'Enter a valid arrival date.',
            );
            requireOptionalTime(errors, 'services-arrivalTime', services.arrivalTime);
            requireOptionalFlight(errors, 'services-arrivalFlight', services.arrivalFlight);
        }

        if (services.departureAssistance === '') {
            errors['services-departureAssistance'] = 'Tell us whether you need departure assistance.';
        }

        if (services.departureAssistance === 'yes' && !services.departureDetailsLater) {
            requirePlaceName(
                errors,
                'services-departureAirport',
                services.departureAirport,
                'Enter the departure airport.',
            );
            requireOptionalIsoDate(
                errors,
                'services-departureDate',
                services.departureDate,
                'Enter a valid departure date.',
            );
            requireOptionalTime(errors, 'services-departureTime', services.departureTime);
            requireOptionalFlight(errors, 'services-departureFlight', services.departureFlight);
        }
    }

    if (services.domestic && services.domesticPreference === '') {
        errors['services-domesticPreference'] = 'Choose a preferred domestic travel arrangement.';
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
        errors['documents-visaStatus'] = 'Choose your Afghanistan visa status.';
    }

    if (state.documents.insuranceStatus === '') {
        errors['documents-insuranceStatus'] = 'Choose your travel insurance status.';
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

    if (requirements.dietary === '') {
        errors['requirements-dietary'] = 'Choose a dietary option, including None if there are no requirements.';
    }

    if (
        (requirements.dietary === 'allergy' || requirements.dietary === 'other') &&
        requirements.dietaryDetails.trim() === ''
    ) {
        errors['requirements-dietaryDetails'] = 'Please add a short detail for this dietary requirement.';
    }

    if (requirements.medical === '') {
        errors['requirements-medical'] = 'Tell us whether there is a medical or accessibility requirement.';
    }

    if (requirements.medical === 'yes' && requirements.medicalDetails.trim() === '') {
        errors['requirements-medicalDetails'] =
            'Share only the information needed to plan the journey safely.';
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
