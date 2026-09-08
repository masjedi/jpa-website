import { MAX_GUIDES } from '@/components/sections/booking/bookingOptions';
import { useBookingTranslationContext } from '@/components/sections/booking/BookingTranslationContext';
import {
    BookingAccordion,
    BookingTextField,
    bookingErrorClass,
    bookingLabelClass,
} from '@/components/sections/booking/bookingFields';
import { BookingChoiceDropdown } from '@/components/sections/booking/BookingChoiceDropdown';
import { cn } from '@/lib/utils';
import type {
    BookingErrors,
    CustomBookingState,
    FirstVisit,
    GuideGender,
    GuideLanguage,
} from '@/types/customBooking';

interface ServicesStepProps {
    state: CustomBookingState;
    errors: BookingErrors;
    onChange: (next: CustomBookingState) => void;
}

function ExclusiveCheckboxes({
    id,
    label,
    value,
    options,
    error,
    hideLabel = false,
    onChange,
}: {
    id: string;
    label: string;
    value: string;
    options: readonly { value: string; label: string }[];
    error?: string;
    hideLabel?: boolean;
    onChange: (value: string) => void;
}) {
    const errorId = error ? `${id}-error` : undefined;

    return (
        <fieldset
            data-field={id}
            aria-invalid={error ? true : undefined}
            aria-required
            aria-describedby={errorId}
        >
            <legend className={cn(bookingLabelClass, hideLabel && 'sr-only')}>{label}</legend>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-6 gap-y-2">
                {options.map((option) => {
                    const optionId = `${id}-${option.value}`;

                    return (
                        <label
                            key={option.value}
                            htmlFor={optionId}
                            className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                        >
                            <input
                                id={optionId}
                                type="checkbox"
                                checked={value === option.value}
                                aria-invalid={error ? true : undefined}
                                onChange={() => onChange(option.value)}
                                className={cn(
                                    'size-4 shrink-0 rounded border-border text-secondary focus:outline-focus',
                                    error && 'border-red-500 dark:border-red-400',
                                )}
                            />
                            <span>{option.label}</span>
                        </label>
                    );
                })}
            </div>
            {error ? (
                <p id={errorId} className={bookingErrorClass} role="alert">
                    {error}
                </p>
            ) : null}
        </fieldset>
    );
}

export function ServicesStep({ state, errors, onChange }: ServicesStepProps) {
    const {
        guideLanguageOptions,
        vehicleOptions,
        transportCoverageOptions,
        accommodationLevelOptions,
        roomPreferenceOptions,
        domesticTravelOptions,
    } = useBookingTranslationContext();
    const { services } = state;

    const patchServices = (patch: Partial<CustomBookingState['services']>) => {
        onChange({
            ...state,
            services: {
                ...state.services,
                ...patch,
            },
        });
    };

    return (
        <div className="space-y-3">
            <BookingAccordion
                title="Tour Guide"
                forceOpen={Boolean(
                    errors['services-guideCount'] ||
                        errors['services-guideLanguages'] ||
                        errors['services-guideGender'],
                )}
            >
                <div className="space-y-4">
                    <BookingTextField
                        id="services-guideCount"
                        label="Number of guides"
                        type="number"
                        inputMode="numeric"
                        step={1}
                        min={1}
                        max={MAX_GUIDES}
                        required
                        value={services.guideCount > 0 ? String(services.guideCount) : ''}
                        error={errors['services-guideCount']}
                        onChange={(value) => {
                            const parsed = Number(value);
                            patchServices({
                                guideCount: Number.isFinite(parsed) ? parsed : 0,
                            });
                        }}
                    />
                    <BookingChoiceDropdown
                        id="services-guideLanguages"
                        label="Languages"
                        options={guideLanguageOptions}
                        values={services.guideLanguages}
                        multiple
                        required
                        placeholder="Select languages"
                        error={errors['services-guideLanguages']}
                        onChange={(next) => patchServices({ guideLanguages: next as GuideLanguage[] })}
                    />
                    <ExclusiveCheckboxes
                        id="services-guideGender"
                        label="Male and female"
                        hideLabel
                        value={services.guideGender}
                        options={[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' },
                        ]}
                        error={errors['services-guideGender']}
                        onChange={(value) => patchServices({ guideGender: value as GuideGender })}
                    />
                </div>
            </BookingAccordion>

            <BookingAccordion
                title="Transportation"
                forceOpen={Boolean(
                    errors['services-vehicle'] ||
                        errors['services-transportCoverage'] ||
                        errors['services-airportPickup'] ||
                        errors['services-domesticPreference'],
                )}
            >
                <div className="space-y-4">
                    <BookingChoiceDropdown
                        id="services-vehicle"
                        label="Type of Vehicle"
                        options={vehicleOptions}
                        values={services.vehicle === '' ? [] : [services.vehicle]}
                        required
                        placeholder="Select vehicle"
                        error={errors['services-vehicle']}
                        onChange={(next) => patchServices({ vehicle: next[0] ?? '' })}
                    />
                    <BookingChoiceDropdown
                        id="services-transportCoverage"
                        label="Transportation Coverage"
                        options={transportCoverageOptions}
                        values={services.transportCoverage === '' ? [] : [services.transportCoverage]}
                        required
                        placeholder="Select coverage"
                        error={errors['services-transportCoverage']}
                        onChange={(next) => patchServices({ transportCoverage: next[0] ?? '' })}
                    />
                    <ExclusiveCheckboxes
                        id="services-airportPickup"
                        label="Airport Pickup / drop-off"
                        value={services.airportPickup}
                        options={[
                            { value: 'yes', label: 'YES' },
                            { value: 'no', label: 'NO' },
                        ]}
                        error={errors['services-airportPickup']}
                        onChange={(value) =>
                            patchServices({ airportPickup: value as FirstVisit })
                        }
                    />
                    <BookingChoiceDropdown
                        id="services-domesticPreference"
                        label="Domestic Transportation"
                        options={domesticTravelOptions}
                        values={services.domesticPreference === '' ? [] : [services.domesticPreference]}
                        required
                        placeholder="Select domestic transportation"
                        error={errors['services-domesticPreference']}
                        onChange={(next) => patchServices({ domesticPreference: next[0] ?? '' })}
                    />
                </div>
            </BookingAccordion>

            <BookingAccordion
                title="Accommodation"
                forceOpen={Boolean(
                    errors['services-accommodationLevel'] ||
                        errors['services-roomPreference'] ||
                        errors['services-roomCount'],
                )}
            >
                <div className="space-y-4">
                    <BookingChoiceDropdown
                        id="services-accommodationLevel"
                        label="Accommodation Level"
                        options={accommodationLevelOptions}
                        values={services.accommodationLevel === '' ? [] : [services.accommodationLevel]}
                        required
                        placeholder="Select accommodation level"
                        error={errors['services-accommodationLevel']}
                        onChange={(next) => patchServices({ accommodationLevel: next[0] ?? '' })}
                    />
                    <BookingChoiceDropdown
                        id="services-roomPreference"
                        label="Room type"
                        options={roomPreferenceOptions}
                        values={services.roomPreference === '' ? [] : [services.roomPreference]}
                        required
                        placeholder="Select room type"
                        error={errors['services-roomPreference']}
                        onChange={(next) => patchServices({ roomPreference: next[0] ?? '' })}
                    />
                    <BookingTextField
                        id="services-roomCount"
                        label="Number of rooms"
                        type="number"
                        inputMode="numeric"
                        step={1}
                        min={1}
                        max={12}
                        required
                        value={services.roomCount > 0 ? String(services.roomCount) : ''}
                        error={errors['services-roomCount']}
                        onChange={(value) => {
                            const parsed = Number(value);
                            patchServices({
                                roomCount: Number.isFinite(parsed) ? parsed : 0,
                                roomsManual: true,
                            });
                        }}
                    />
                </div>
            </BookingAccordion>
        </div>
    );
}
