import { Plus } from 'lucide-react';

import { MAX_TRAVELERS } from '@/components/sections/booking/bookingOptions';
import { useBookingTranslationContext } from '@/components/sections/booking/BookingTranslationContext';
import {
    BookingAccordion,
    BookingTextField,
    bookingErrorClass,
    bookingLabelClass,
} from '@/components/sections/booking/bookingFields';
import { BookingChoiceDropdown } from '@/components/sections/booking/BookingChoiceDropdown';
import {
    addVisibleTourist,
    applyGroupType,
    minBirthIsoDate,
    setPlannedTouristCount,
    todayIsoDate,
} from '@/components/sections/booking/bookingModel';
import { cn } from '@/lib/utils';
import type {
    BookingErrors,
    CompanionTraveler,
    CustomBookingState,
    FirstVisit,
    GroupType,
    PrimaryTraveler,
} from '@/types/customBooking';

interface TravelersStepProps {
    state: CustomBookingState;
    errors: BookingErrors;
    onChange: (next: CustomBookingState) => void;
}

interface TouristFieldsProps {
    idPrefix: string;
    tourist: PrimaryTraveler | CompanionTraveler;
    errors: BookingErrors;
    today: string;
    autoComplete?: boolean;
    onChange: (patch: Partial<CompanionTraveler>) => void;
}

function hasAnyError(errors: BookingErrors, fields: readonly string[]): boolean {
    return fields.some((field) => Boolean(errors[field]));
}

function touristErrorFields(idPrefix: string): string[] {
    return [
        `${idPrefix}-firstName`,
        `${idPrefix}-lastName`,
        `${idPrefix}-email`,
        `${idPrefix}-phone`,
        `${idPrefix}-dateOfBirth`,
        `${idPrefix}-nationality`,
        `${idPrefix}-countryOfResidence`,
        `${idPrefix}-isFirstVisit`,
    ];
}

function FirstVisitCheckboxes({
    idPrefix,
    value,
    error,
    onChange,
}: {
    idPrefix: string;
    value: FirstVisit | '';
    error?: string;
    onChange: (value: FirstVisit) => void;
}) {
    const fieldId = `${idPrefix}-isFirstVisit`;
    const errorId = error ? `${fieldId}-error` : undefined;

    return (
        <fieldset
            data-field={fieldId}
            className="min-w-0"
            aria-invalid={error ? true : undefined}
            aria-required
            aria-describedby={errorId}
        >
            <legend className={bookingLabelClass}>Is it first your visit?</legend>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-6 gap-y-2">
                {(['yes', 'no'] as const).map((option) => {
                    const optionId = `${fieldId}-${option}`;

                    return (
                        <label
                            key={option}
                            htmlFor={optionId}
                            className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                        >
                            <input
                                id={optionId}
                                type="checkbox"
                                checked={value === option}
                                aria-invalid={error ? true : undefined}
                                onChange={() => onChange(option)}
                                className={cn(
                                    'size-4 shrink-0 rounded border-border text-secondary focus:outline-focus',
                                    error && 'border-red-500 dark:border-red-400',
                                )}
                            />
                            <span>{option === 'yes' ? 'YES' : 'NO'}</span>
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

function TouristFields({
    idPrefix,
    tourist,
    errors,
    today,
    autoComplete = false,
    onChange,
}: TouristFieldsProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <BookingTextField
                id={`${idPrefix}-firstName`}
                label="First name"
                autoComplete={autoComplete ? 'given-name' : 'off'}
                required
                maxLength={80}
                value={tourist.firstName}
                error={errors[`${idPrefix}-firstName`]}
                onChange={(value) => onChange({ firstName: value })}
            />
            <BookingTextField
                id={`${idPrefix}-lastName`}
                label="Last name"
                autoComplete={autoComplete ? 'family-name' : 'off'}
                required
                maxLength={80}
                value={tourist.lastName}
                error={errors[`${idPrefix}-lastName`]}
                onChange={(value) => onChange({ lastName: value })}
            />
            <BookingTextField
                id={`${idPrefix}-email`}
                label="Email"
                type="email"
                inputMode="email"
                autoComplete={autoComplete ? 'email' : 'off'}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                required
                maxLength={255}
                placeholder="name@example.com"
                value={tourist.email}
                error={errors[`${idPrefix}-email`]}
                onChange={(value) => onChange({ email: value })}
            />
            <BookingTextField
                id={`${idPrefix}-phone`}
                label="Phone"
                type="tel"
                inputMode="tel"
                autoComplete={autoComplete ? 'tel' : 'off'}
                required
                maxLength={60}
                placeholder="+49 …"
                hint="Include country code, for example +49 177 668 7088."
                value={tourist.phone}
                error={errors[`${idPrefix}-phone`]}
                onChange={(value) => onChange({ phone: value })}
            />
            <BookingTextField
                id={`${idPrefix}-dateOfBirth`}
                label="Date of birth"
                type="date"
                autoComplete={autoComplete ? 'bday' : 'off'}
                required
                min={minBirthIsoDate()}
                max={today}
                value={tourist.dateOfBirth}
                error={errors[`${idPrefix}-dateOfBirth`]}
                onChange={(value) => onChange({ dateOfBirth: value })}
            />
            <BookingTextField
                id={`${idPrefix}-nationality`}
                label="Nationality"
                autoComplete={autoComplete ? 'country-name' : 'off'}
                required
                maxLength={80}
                value={tourist.nationality}
                error={errors[`${idPrefix}-nationality`]}
                onChange={(value) => onChange({ nationality: value })}
            />
            <div className="col-span-full grid grid-cols-1 gap-4 sm:grid-cols-2">
                <BookingTextField
                    id={`${idPrefix}-countryOfResidence`}
                    label="Country of residence"
                    autoComplete={autoComplete ? 'country-name' : 'off'}
                    required
                    maxLength={80}
                    value={tourist.countryOfResidence}
                    error={errors[`${idPrefix}-countryOfResidence`]}
                    onChange={(value) => onChange({ countryOfResidence: value })}
                />
                <FirstVisitCheckboxes
                    idPrefix={idPrefix}
                    value={tourist.isFirstVisit}
                    error={errors[`${idPrefix}-isFirstVisit`]}
                    onChange={(value) => onChange({ isFirstVisit: value })}
                />
            </div>
        </div>
    );
}

export function TravelersStep({ state, errors, onChange }: TravelersStepProps) {
    const { groupTypeOptions } = useBookingTranslationContext();
    const { travelers } = state;
    const isGroup = travelers.groupType === 'group';
    const plannedTourists = travelers.adults;
    const hasTouristCount = isGroup && plannedTourists >= 2;
    const revealedTourists = 1 + travelers.companions.length;
    const canAddTourist = hasTouristCount && revealedTourists < plannedTourists;
    const today = todayIsoDate();
    const detailsErrorFields = [
        ...touristErrorFields('primary'),
        ...travelers.companions.flatMap((_, index) => touristErrorFields(`companion-${index}`)),
        'travelers-adults',
    ];
    const showDetails = !isGroup || hasTouristCount;

    const patchPrimary = (patch: Partial<PrimaryTraveler>) => {
        onChange({
            ...state,
            travelers: {
                ...state.travelers,
                primary: {
                    ...state.travelers.primary,
                    ...patch,
                },
            },
        });
    };

    const patchCompanion = (index: number, patch: Partial<CompanionTraveler>) => {
        onChange({
            ...state,
            travelers: {
                ...state.travelers,
                companions: state.travelers.companions.map((companion, companionIndex) =>
                    companionIndex === index ? { ...companion, ...patch } : companion,
                ),
            },
        });
    };

    return (
        <div className="space-y-3">
            <BookingAccordion
                title="Group type"
                forceOpen={hasAnyError(errors, ['travelers-groupType'])}
            >
                <BookingChoiceDropdown
                    id="travelers-groupType"
                    label="Group type"
                    options={groupTypeOptions}
                    values={travelers.groupType === '' ? [] : [travelers.groupType]}
                    required
                    hideLabel
                    placeholder="Select group type"
                    error={errors['travelers-groupType']}
                    onChange={(next) => onChange(applyGroupType(state, (next[0] ?? '') as GroupType | ''))}
                />
            </BookingAccordion>

            {isGroup ? (
                <BookingAccordion
                    title="Tourists"
                    forceOpen={isGroup || hasAnyError(errors, ['travelers-adults'])}
                >
                    <BookingTextField
                        id="travelers-adults"
                        label="Number of Tourists"
                        type="number"
                        inputMode="numeric"
                        step={1}
                        min={2}
                        max={MAX_TRAVELERS}
                        required
                        value={plannedTourists > 0 ? String(plannedTourists) : ''}
                        error={errors['travelers-adults']}
                        hint={`Enter a whole number between 2 and ${MAX_TRAVELERS}.`}
                        onChange={(value) => {
                            const parsed = Number(value);
                            onChange(setPlannedTouristCount(state, Number.isFinite(parsed) ? parsed : 0));
                        }}
                    />
                </BookingAccordion>
            ) : null}

            {showDetails ? (
                <BookingAccordion
                    title="Tourists Details"
                    forceOpen={hasTouristCount || hasAnyError(errors, detailsErrorFields)}
                >
                    <div className="space-y-6">
                        <TouristFields
                            idPrefix="primary"
                            tourist={travelers.primary}
                            errors={errors}
                            today={today}
                            autoComplete
                            onChange={patchPrimary}
                        />

                        {travelers.companions.map((companion, index) => (
                            <div key={`companion-${index}`} className="border-t border-border pt-6">
                                <TouristFields
                                    idPrefix={`companion-${index}`}
                                    tourist={companion}
                                    errors={errors}
                                    today={today}
                                    onChange={(patch) => patchCompanion(index, patch)}
                                />
                            </div>
                        ))}

                        {canAddTourist ? (
                            <button
                                type="button"
                                onClick={() => onChange(addVisibleTourist(state))}
                                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                                <Plus className="size-4" aria-hidden />
                                Add tourist
                            </button>
                        ) : null}
                    </div>
                </BookingAccordion>
            ) : null}
        </div>
    );
}
