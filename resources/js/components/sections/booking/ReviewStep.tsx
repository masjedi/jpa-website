import { Link } from '@inertiajs/react';

import {
    ACCOMMODATION_LEVEL_OPTIONS,
    CONTACT_METHOD_OPTIONS,
    DATE_FLEXIBILITY_OPTIONS,
    DIETARY_OPTIONS,
    DOMESTIC_TRAVEL_OPTIONS,
    GROUP_TYPE_OPTIONS,
    GUIDE_GENDER_OPTIONS,
    GUIDE_LANGUAGE_OPTIONS,
    RECOMMEND_SEASON_VALUE,
    ROOM_PREFERENCE_OPTIONS,
    ROUTE_PREFERENCE_OPTIONS,
    TRANSPORT_COVERAGE_OPTIONS,
    TRAVEL_INTEREST_OPTIONS,
    VEHICLE_OPTIONS,
    optionLabel,
} from '@/components/sections/booking/bookingOptions';
import type { ReactNode } from 'react';

import { ConsentCheckbox } from '@/components/sections/booking/bookingFields';
import {
    displayDate,
    inferredGroupType,
    maskPhone,
    resolvedSeason,
    sensitiveProvided,
    travelerCount,
} from '@/components/sections/booking/bookingModel';
import type { BookingErrors, CustomBookingState } from '@/types/customBooking';

interface ReviewStepProps {
    state: CustomBookingState;
    errors: BookingErrors;
    seasons: readonly string[];
    onChange: (next: CustomBookingState) => void;
    onEdit: (step: number) => void;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    if (value.trim() === '') {
        return null;
    }

    return (
        <div className="grid gap-1 py-2 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
            <dd className="text-sm text-foreground">{value}</dd>
        </div>
    );
}

function SummaryCard({
    title,
    step,
    onEdit,
    children,
}: {
    title: string;
    step: number;
    onEdit: (step: number) => void;
    children: ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-border bg-background/70 p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
                <button
                    type="button"
                    onClick={() => onEdit(step)}
                    className="text-xs font-medium text-secondary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                    Edit
                </button>
            </div>
            <dl className="divide-y divide-border">{children}</dl>
        </section>
    );
}

function travelerName(firstName: string, lastName: string, fallback: string): string {
    const name = `${firstName} ${lastName}`.trim();
    return name === '' ? fallback : name;
}

function firstVisitSummary(value: string): string {
    if (value === 'yes') {
        return ' · First visit: Yes';
    }

    if (value === 'no') {
        return ' · First visit: No';
    }

    return '';
}

export function ReviewStep({ state, errors, seasons, onChange, onEdit }: ReviewStepProps) {
    const { trip, travelers, services, documents, requirements, agreements } = state;
    const totalTravelers = travelerCount(travelers.adults, travelers.children);
    const group = travelers.groupType || inferredGroupType(travelers.adults, travelers.children);
    const season = resolvedSeason(trip.flexibility, trip.startDate, trip.season, seasons);
    const seasonLabel =
        season === RECOMMEND_SEASON_VALUE ? 'Recommend the best time' : season;
    const destinationList = trip.recommendDestinations
        ? 'Recommend destinations'
        : trip.destinations.join(', ');
    const guideLanguages = services.guideLanguages
        .map((language) => optionLabel(GUIDE_LANGUAGE_OPTIONS, language))
        .filter(Boolean)
        .join(', ');
    const dietaryValue = requirements.dietary
        .map((item) => optionLabel(DIETARY_OPTIONS, item))
        .filter(Boolean)
        .join(', ');

    return (
        <div className="space-y-6">
            <SummaryCard title="Trip summary" step={0} onEdit={onEdit}>
                <SummaryRow
                    label="Preferred dates"
                    value={
                        trip.startDate && trip.endDate
                            ? `${displayDate(trip.startDate)} – ${displayDate(trip.endDate)}`
                            : displayDate(trip.startDate) || 'To be decided'
                    }
                />
                <SummaryRow
                    label="I am not sure yet"
                    value={optionLabel(DATE_FLEXIBILITY_OPTIONS, trip.flexibility) || 'No'}
                />
                {seasonLabel ? <SummaryRow label="Season" value={seasonLabel} /> : null}
                <SummaryRow
                    label="Duration"
                    value={trip.durationDays > 0 ? `${trip.durationDays} days` : 'To be decided'}
                />
                <SummaryRow label="Destinations" value={destinationList || 'To be recommended'} />
                <SummaryRow
                    label="Tour interests"
                    value={trip.interests
                        .map((interest) => optionLabel(TRAVEL_INTEREST_OPTIONS, interest))
                        .join(', ')}
                />
                <SummaryRow label="Route" value={optionLabel(ROUTE_PREFERENCE_OPTIONS, trip.routePreference)} />
            </SummaryCard>

            <SummaryCard title="Tourists summary" step={1} onEdit={onEdit}>
                <SummaryRow label="Group type" value={optionLabel(GROUP_TYPE_OPTIONS, group)} />
                <SummaryRow
                    label="Number of tourists"
                    value={String(totalTravelers)}
                />
                <SummaryRow
                    label="Tourist 1"
                    value={`${travelerName(travelers.primary.firstName, travelers.primary.lastName, 'Tourist 1')}, ${travelers.primary.email}${firstVisitSummary(travelers.primary.isFirstVisit)}`}
                />
                {travelers.companions.map((companion, index) => (
                    <SummaryRow
                        key={`review-tourist-${index}`}
                        label={`Tourist ${index + 2}`}
                        value={`${travelerName(companion.firstName, companion.lastName, `Tourist ${index + 2}`)}${firstVisitSummary(companion.isFirstVisit)}`}
                    />
                ))}
                <SummaryRow
                    label="Nationalities"
                    value={[travelers.primary.nationality, ...travelers.companions.map((companion) => companion.nationality)]
                        .filter(Boolean)
                        .join(', ')}
                />
                <SummaryRow
                    label="Dates of birth"
                    value={[
                        displayDate(travelers.primary.dateOfBirth),
                        ...travelers.companions.map((companion) => displayDate(companion.dateOfBirth)),
                    ]
                        .filter(Boolean)
                        .join(', ')}
                />
            </SummaryCard>

            <SummaryCard title="Services summary" step={2} onEdit={onEdit}>
                <SummaryRow label="Number of guides" value={services.guideCount > 0 ? String(services.guideCount) : ''} />
                <SummaryRow label="Languages" value={guideLanguages} />
                <SummaryRow
                    label="Male and female"
                    value={optionLabel(GUIDE_GENDER_OPTIONS, services.guideGender)}
                />
                <SummaryRow label="Type of Vehicle" value={optionLabel(VEHICLE_OPTIONS, services.vehicle)} />
                <SummaryRow
                    label="Transportation Coverage"
                    value={optionLabel(TRANSPORT_COVERAGE_OPTIONS, services.transportCoverage)}
                />
                <SummaryRow
                    label="Airport Pickup / drop-off"
                    value={services.airportPickup === 'yes' ? 'Yes' : services.airportPickup === 'no' ? 'No' : ''}
                />
                <SummaryRow
                    label="Domestic Transportation"
                    value={optionLabel(DOMESTIC_TRAVEL_OPTIONS, services.domesticPreference)}
                />
                <SummaryRow
                    label="Accommodation Level"
                    value={optionLabel(ACCOMMODATION_LEVEL_OPTIONS, services.accommodationLevel)}
                />
                <SummaryRow
                    label="Room type"
                    value={optionLabel(ROOM_PREFERENCE_OPTIONS, services.roomPreference)}
                />
                <SummaryRow
                    label="Number of rooms"
                    value={services.roomCount > 0 ? String(services.roomCount) : ''}
                />
            </SummaryCard>

            <SummaryCard title="Travel documents" step={3} onEdit={onEdit}>
                {documents.passports.slice(0, totalTravelers).map((passport, index) => (
                    <SummaryRow
                        key={`passport-${index}`}
                        label={index === 0 ? 'Primary passport' : `Traveler ${index + 1} passport`}
                        value={`${passport.issuingCountry || 'Country not provided'} · expiry ${sensitiveProvided(passport.expiryDate)}`}
                    />
                ))}
                <SummaryRow
                    label="Visa status"
                    value={
                        documents.visaStatus === 'obtained'
                            ? 'Already obtained'
                            : documents.visaStatus === 'applying'
                              ? 'Applying independently'
                              : documents.visaStatus === 'guidance'
                                ? 'Need guidance'
                                : documents.visaStatus === 'not_started'
                                  ? 'Not started yet'
                                  : ''
                    }
                />
            </SummaryCard>

            <SummaryCard title="Emergency Contact" step={4} onEdit={onEdit}>
                <SummaryRow label="Dietary needs" value={dietaryValue} />
                <SummaryRow
                    label="Do you have any medical accessibility requirement?"
                    value={requirements.medical === 'yes' ? 'Yes' : requirements.medical === 'no' ? 'No' : ''}
                />
                <SummaryRow
                    label="Emergency contact"
                    value={`${requirements.emergencyName} (${requirements.emergencyRelationship}) · ${maskPhone(requirements.emergencyPhone)}`}
                />
                <SummaryRow
                    label="Preferred contact method"
                    value={optionLabel(CONTACT_METHOD_OPTIONS, requirements.contactMethod)}
                />
            </SummaryCard>

            <section className="rounded-2xl border border-border bg-background/70 p-4 sm:p-5">
                <h3 className="font-heading text-base font-semibold text-foreground">Pricing</h3>
                <p className="mt-2 text-sm font-medium text-foreground">Price to be confirmed</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Our travel team will review your selected destinations, dates, transportation,
                    accommodation, guide requirements, and other services and provide a detailed
                    quotation before the booking is confirmed.
                </p>
            </section>

            <section className="space-y-4 rounded-2xl border border-border bg-background/70 p-4 sm:p-5">
                <h3 className="font-heading text-base font-semibold text-foreground">Agreements</h3>
                <ConsentCheckbox
                    id="agreements-accuracy"
                    checked={agreements.accuracy}
                    required
                    error={errors['agreements-accuracy']}
                    onChange={(checked) =>
                        onChange({
                            ...state,
                            agreements: { ...agreements, accuracy: checked },
                        })
                    }
                >
                    I confirm that the information provided is accurate.
                </ConsentCheckbox>
                <ConsentCheckbox
                    id="agreements-terms"
                    checked={agreements.terms}
                    required
                    error={errors['agreements-terms']}
                    onChange={(checked) =>
                        onChange({
                            ...state,
                            agreements: { ...agreements, terms: checked },
                        })
                    }
                >
                    I agree to the{' '}
                    <Link
                        href="/terms"
                        className="font-medium text-secondary underline-offset-4 hover:underline"
                    >
                        Booking Terms &amp; Conditions
                    </Link>{' '}
                    and Cancellation Policy.
                </ConsentCheckbox>
                <ConsentCheckbox
                    id="agreements-privacy"
                    checked={agreements.privacy}
                    required
                    error={errors['agreements-privacy']}
                    onChange={(checked) =>
                        onChange({
                            ...state,
                            agreements: { ...agreements, privacy: checked },
                        })
                    }
                >
                    I acknowledge the{' '}
                    <Link
                        href="/privacy"
                        className="font-medium text-secondary underline-offset-4 hover:underline"
                    >
                        Privacy Policy
                    </Link>{' '}
                    and understand how my information will be used to arrange this trip.
                </ConsentCheckbox>
                <p className="text-xs leading-relaxed text-muted-foreground">
                    Request My Custom Tour stays inactive until the three required confirmations above are ticked.
                </p>
                <ConsentCheckbox
                    id="agreements-marketing"
                    checked={agreements.marketing}
                    onChange={(checked) =>
                        onChange({
                            ...state,
                            agreements: { ...agreements, marketing: checked },
                        })
                    }
                >
                    Optional: send me occasional travel notes by email.
                </ConsentCheckbox>
            </section>
        </div>
    );
}
