import {
    MAX_DURATION_DAYS,
    MIN_DURATION_DAYS,
} from '@/components/sections/booking/bookingOptions';
import { useBookingTranslationContext } from '@/components/sections/booking/BookingTranslationContext';
import {
    BookingAccordion,
    BookingTextField,
    ConsentCheckbox,
} from '@/components/sections/booking/bookingFields';
import { BookingChoiceDropdown } from '@/components/sections/booking/BookingChoiceDropdown';
import { ProvinceZoneMultiSelect } from '@/components/sections/booking/ProvinceZoneMultiSelect';
import {
    durationDaysFromRange,
    maxStartIsoDate,
    todayIsoDate,
} from '@/components/sections/booking/bookingModel';
import type { BookingErrors, CustomBookingState, RoutePreference, TravelInterest } from '@/types/customBooking';

interface TripPreferencesStepProps {
    state: CustomBookingState;
    errors: BookingErrors;
    destinations: readonly string[];
    seasons: readonly string[];
    onChange: (next: CustomBookingState) => void;
}

function hasAnyError(errors: BookingErrors, fields: readonly string[]): boolean {
    return fields.some((field) => Boolean(errors[field]));
}

export function TripPreferencesStep({
    state,
    errors,
    destinations: _destinations,
    seasons: _seasons,
    onChange,
}: TripPreferencesStepProps) {
    const { travelInterestOptions, routePreferenceOptions } = useBookingTranslationContext();
    const { trip } = state;
    const datesUnknown = trip.flexibility === 'unsure';
    const hasDateRange = trip.startDate !== '' && trip.endDate !== '';
    const calculatedDuration = durationDaysFromRange(trip.startDate, trip.endDate);
    const durationFromDates = !datesUnknown && calculatedDuration !== null && calculatedDuration > 0;
    const destinationsOptional = trip.recommendDestinations || trip.routePreference === 'recommend';
    const hasSelectedProvinces = trip.destinations.length > 0;

    const patchTrip = (patch: Partial<CustomBookingState['trip']>) => {
        const nextTrip = {
            ...state.trip,
            ...patch,
        };
        const nextDuration = durationDaysFromRange(nextTrip.startDate, nextTrip.endDate);

        onChange({
            ...state,
            trip: {
                ...nextTrip,
                durationDays:
                    nextDuration !== null && nextDuration > 0 ? nextDuration : nextTrip.durationDays,
            },
        });
    };

    return (
        <div className="space-y-3">
            <BookingAccordion
                title="Tour Date"
                forceOpen={hasAnyError(errors, [
                    'trip-flexibility',
                    'trip-startDate',
                    'trip-endDate',
                    'trip-durationDays',
                ])}
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <BookingTextField
                        id="trip-startDate"
                        label="Starting date"
                        type="date"
                        min={todayIsoDate()}
                        max={trip.endDate || maxStartIsoDate()}
                        value={trip.startDate}
                        required={!datesUnknown}
                        disabled={datesUnknown}
                        error={errors['trip-startDate']}
                        onChange={(value) => patchTrip({ startDate: value })}
                    />
                    <BookingTextField
                        id="trip-endDate"
                        label="Ending date"
                        type="date"
                        min={trip.startDate || todayIsoDate()}
                        max={maxStartIsoDate()}
                        value={trip.endDate}
                        required={!datesUnknown}
                        disabled={datesUnknown}
                        error={errors['trip-endDate']}
                        onChange={(value) => patchTrip({ endDate: value })}
                    />
                </div>

                <div className="mt-4 grid grid-cols-1 items-end gap-4 sm:grid-cols-2">
                    <BookingTextField
                        id="trip-durationDays"
                        label="Duration"
                        type="number"
                        inputMode="numeric"
                        step={1}
                        min={MIN_DURATION_DAYS}
                        max={MAX_DURATION_DAYS}
                        value={trip.durationDays > 0 ? String(trip.durationDays) : ''}
                        required={!datesUnknown}
                        disabled={datesUnknown}
                        readOnly={durationFromDates}
                        error={errors['trip-durationDays']}
                        onChange={(value) => {
                            if (durationFromDates || datesUnknown) {
                                return;
                            }

                            const parsed = Number(value);
                            patchTrip({
                                durationDays: Number.isFinite(parsed) ? parsed : 0,
                            });
                        }}
                    />
                    <div className="pb-2.5">
                        <ConsentCheckbox
                            id="trip-flexibility"
                            checked={datesUnknown}
                            disabled={hasDateRange}
                            error={errors['trip-flexibility']}
                            onChange={(checked) => {
                                if (hasDateRange) {
                                    return;
                                }

                                patchTrip({
                                    flexibility: checked ? 'unsure' : 'known',
                                    startDate: checked ? '' : trip.startDate,
                                    endDate: checked ? '' : trip.endDate,
                                    durationDays: checked ? 0 : trip.durationDays,
                                    season: '',
                                });
                            }}
                        >
                            I am not sure yet
                        </ConsentCheckbox>
                    </div>
                </div>
            </BookingAccordion>

            <BookingAccordion
                title="Regions / Destinations"
                forceOpen={hasAnyError(errors, ['trip-destinations'])}
            >
                <ProvinceZoneMultiSelect
                    value={trip.destinations}
                    disabled={trip.recommendDestinations}
                    optional={destinationsOptional}
                    error={errors['trip-destinations']}
                    onChange={(next) => patchTrip({ destinations: next, otherDestination: '' })}
                />

                <div className="mt-4">
                    <ConsentCheckbox
                        id="trip-recommendDestinations"
                        checked={trip.recommendDestinations}
                        disabled={hasSelectedProvinces}
                        error={errors['trip-recommendDestinations']}
                        onChange={(checked) => {
                            if (hasSelectedProvinces) {
                                return;
                            }

                            patchTrip({
                                recommendDestinations: checked,
                                destinations: checked ? [] : trip.destinations,
                                otherDestination: '',
                            });
                        }}
                    >
                        I am not sure — recommend destinations
                    </ConsentCheckbox>
                </div>
            </BookingAccordion>

            <BookingAccordion title="Tour interests" forceOpen={hasAnyError(errors, ['trip-interests'])}>
                <BookingChoiceDropdown
                    id="trip-interests"
                    label="Tour interests"
                    options={travelInterestOptions}
                    values={trip.interests}
                    multiple
                    required
                    hideLabel
                    placeholder="Select tour interests"
                    error={errors['trip-interests']}
                    onChange={(next) => patchTrip({ interests: next as TravelInterest[] })}
                />
            </BookingAccordion>

            <BookingAccordion title="Route preference" forceOpen={hasAnyError(errors, ['trip-routePreference'])}>
                <BookingChoiceDropdown
                    id="trip-routePreference"
                    label="Route preference"
                    options={routePreferenceOptions}
                    values={trip.routePreference === '' ? [] : [trip.routePreference]}
                    required
                    hideLabel
                    placeholder="Select route preference"
                    error={errors['trip-routePreference']}
                    onChange={(next) =>
                        patchTrip({ routePreference: (next[0] ?? '') as RoutePreference | '' })
                    }
                />
            </BookingAccordion>
        </div>
    );
}
