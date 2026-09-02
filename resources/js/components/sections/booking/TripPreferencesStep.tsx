import {
    MAX_DURATION_DAYS,
    MIN_DURATION_DAYS,
    OTHER_DESTINATION_VALUE,
    destinationChoices,
    seasonChoices,
} from '@/components/sections/booking/bookingOptions';
import { useBookingTranslationContext } from '@/components/sections/booking/BookingTranslationContext';
import {
    BookingTextField,
    CheckboxCard,
    OptionCards,
    StepSection,
    bookingChoiceErrorClass,
    bookingErrorClass,
} from '@/components/sections/booking/bookingFields';
import { maxStartIsoDate, resolvedSeason, todayIsoDate } from '@/components/sections/booking/bookingModel';
import { cn } from '@/lib/utils';
import type { BookingErrors, CustomBookingState, TravelInterest } from '@/types/customBooking';

interface TripPreferencesStepProps {
    state: CustomBookingState;
    errors: BookingErrors;
    destinations: readonly string[];
    seasons: readonly string[];
    onChange: (next: CustomBookingState) => void;
}

export function TripPreferencesStep({
    state,
    errors,
    destinations,
    seasons,
    onChange,
}: TripPreferencesStepProps) {
    const {
        dateFlexibilityOptions,
        travelInterestOptions,
        routePreferenceOptions,
        seasonRecommendLabel,
    } = useBookingTranslationContext();
    const { trip } = state;
    const destinationOptions = destinationChoices(destinations);
    const seasonOptions = seasonChoices(seasons, seasonRecommendLabel);
    const showSeason = trip.flexibility === 'unsure';
    const showStartDate = trip.flexibility !== '';
    const derivedSeason =
        trip.flexibility !== 'unsure' && trip.startDate !== ''
            ? resolvedSeason(trip.flexibility, trip.startDate, trip.season, seasons)
            : '';
    const destinationsOptional = trip.recommendDestinations || trip.routePreference === 'recommend';

    const patchTrip = (patch: Partial<CustomBookingState['trip']>) => {
        onChange({
            ...state,
            trip: {
                ...state.trip,
                ...patch,
            },
        });
    };

    return (
        <div className="space-y-8">
            <StepSection
                title="Travel timing"
                description="Tell us when you would like to travel. We will turn this into a proposed itinerary, not an instant confirmation."
            >
                <OptionCards
                    legend="Date flexibility"
                    name="trip-flexibility"
                    options={dateFlexibilityOptions}
                    value={trip.flexibility}
                    error={errors['trip-flexibility']}
                    onChange={(value) => {
                        patchTrip({
                            flexibility: value,
                            season: value === 'unsure' ? trip.season : '',
                        });
                    }}
                />

                {showStartDate ? (
                    <div className="mt-4">
                        <BookingTextField
                            id="trip-startDate"
                            label={trip.flexibility === 'unsure' ? 'Preferred start date (optional)' : 'Preferred start date'}
                            type="date"
                            min={todayIsoDate()}
                            max={maxStartIsoDate()}
                            value={trip.startDate}
                            required={trip.flexibility !== 'unsure'}
                            error={errors['trip-startDate']}
                            hint={
                                trip.flexibility === 'exact'
                                    ? 'If you choose an exact date, we will use it to determine the season.'
                                    : undefined
                            }
                            onChange={(value) => patchTrip({ startDate: value })}
                        />
                        {derivedSeason ? (
                            <p className="mt-2 text-xs text-muted-foreground">
                                Season from this date: <span className="font-medium text-foreground">{derivedSeason}</span>
                            </p>
                        ) : null}
                    </div>
                ) : null}

                {showSeason ? (
                    <div className="mt-4">
                        <OptionCards
                            legend="Preferred season"
                            name="trip-season"
                            options={seasonOptions}
                            value={trip.season}
                            error={errors['trip-season']}
                            onChange={(value) => patchTrip({ season: value })}
                        />
                    </div>
                ) : null}
            </StepSection>

            <StepSection title="Duration">
                <BookingTextField
                    id="trip-durationDays"
                    label="Number of days"
                    type="number"
                    inputMode="numeric"
                    step={1}
                    min={MIN_DURATION_DAYS}
                    max={MAX_DURATION_DAYS}
                    value={String(trip.durationDays)}
                    required
                    error={errors['trip-durationDays']}
                    hint={`Between ${MIN_DURATION_DAYS} and ${MAX_DURATION_DAYS} days.`}
                    onChange={(value) => {
                        const parsed = Number(value);
                        patchTrip({
                            durationDays: Number.isFinite(parsed) ? parsed : 0,
                        });
                    }}
                />
            </StepSection>

            <StepSection
                title="Regions / Destinations"
                description="Select the places you already have in mind, or ask us to recommend a route."
            >
                <div data-field="trip-destinations">
                    <CheckboxCard
                        checked={trip.recommendDestinations}
                        invalid={Boolean(errors['trip-destinations'])}
                        label="I am not sure — recommend destinations"
                        description="We will suggest a route that matches your dates and interests."
                        onChange={() => {
                            const next = !trip.recommendDestinations;
                            patchTrip({
                                recommendDestinations: next,
                                routePreference: next && trip.routePreference === 'know' ? 'recommend' : trip.routePreference,
                            });
                        }}
                    />

                    <fieldset className="mt-3" disabled={trip.recommendDestinations}>
                        <legend className="block text-sm font-medium text-foreground">
                            Destinations
                            {destinationsOptional ? (
                                <span className="ms-1 font-normal text-muted-foreground">(optional)</span>
                            ) : null}
                        </legend>
                        <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {destinationOptions.map((name) => {
                                const selected = trip.destinations.includes(name);

                                return (
                                    <button
                                        key={name}
                                        type="button"
                                        aria-pressed={selected}
                                        onClick={() => {
                                            const next = selected
                                                ? trip.destinations.filter((item) => item !== name)
                                                : [...trip.destinations, name];
                                            patchTrip({ destinations: next });
                                        }}
                                        className={cn(
                                            'rounded-xl border px-4 py-3 text-start text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-50',
                                            selected
                                                ? 'border-secondary bg-secondary/10 text-foreground'
                                                : errors['trip-destinations']
                                                  ? `bg-background hover:border-red-400 ${bookingChoiceErrorClass}`
                                                  : 'border-border bg-background hover:border-secondary/40',
                                        )}
                                    >
                                        {name}
                                    </button>
                                );
                            })}
                        </div>
                    </fieldset>
                    {errors['trip-destinations'] ? (
                        <p className={bookingErrorClass} role="alert">
                            {errors['trip-destinations']}
                        </p>
                    ) : null}
                </div>

                {trip.destinations.includes(OTHER_DESTINATION_VALUE) && !trip.recommendDestinations ? (
                    <div className="mt-4">
                        <BookingTextField
                            id="trip-otherDestination"
                            label="Other destination"
                            value={trip.otherDestination}
                            required
                            maxLength={120}
                            error={errors['trip-otherDestination']}
                            onChange={(value) => patchTrip({ otherDestination: value })}
                        />
                    </div>
                ) : null}
            </StepSection>

            <StepSection title="Travel interests">
                <OptionCards
                    legend="What are you most interested in?"
                    name="trip-interests"
                    options={travelInterestOptions}
                    value={trip.interests}
                    multiple
                    error={errors['trip-interests']}
                    onChange={(value) => {
                        const selected = trip.interests.includes(value)
                            ? trip.interests.filter((item) => item !== value)
                            : [...trip.interests, value as TravelInterest];
                        patchTrip({ interests: selected });
                    }}
                />
            </StepSection>

            <StepSection title="Route preference">
                <OptionCards
                    legend="How would you like your itinerary planned?"
                    name="trip-routePreference"
                    options={routePreferenceOptions}
                    value={trip.routePreference}
                    columns={1}
                    error={errors['trip-routePreference']}
                    onChange={(value) => patchTrip({ routePreference: value })}
                />
            </StepSection>
        </div>
    );
}
