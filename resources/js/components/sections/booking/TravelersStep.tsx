import {
    MAX_ADULTS,
    MAX_CHILDREN,
    optionLabel,
} from '@/components/sections/booking/bookingOptions';
import { useBookingTranslationContext } from '@/components/sections/booking/BookingTranslationContext';
import {
    BookingTextField,
    OptionCards,
    StepSection,
} from '@/components/sections/booking/bookingFields';
import {
    inferredGroupType,
    minBirthIsoDate,
    syncTravelerLists,
    todayIsoDate,
} from '@/components/sections/booking/bookingModel';
import type {
    BookingErrors,
    CompanionTraveler,
    CustomBookingState,
    PrimaryTraveler,
} from '@/types/customBooking';

interface TravelersStepProps {
    state: CustomBookingState;
    errors: BookingErrors;
    onChange: (next: CustomBookingState) => void;
}

function companionHeading(index: number): string {
    return `Traveler ${index + 2}`;
}

export function TravelersStep({ state, errors, onChange }: TravelersStepProps) {
    const { groupTypeOptions } = useBookingTranslationContext();
    const { travelers } = state;
    const inferred = inferredGroupType(travelers.adults, travelers.children);
    const groupRequired = inferred === null;
    const today = todayIsoDate();

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
        <div className="space-y-8">
            <StepSection
                title="Traveler count"
                description="The total is calculated from adults and children. You do not need to enter it separately."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <BookingTextField
                        id="travelers-adults"
                        label="Adults"
                        type="number"
                        inputMode="numeric"
                        step={1}
                        min={1}
                        max={MAX_ADULTS}
                        required
                        value={String(travelers.adults)}
                        error={errors['travelers-adults']}
                        onChange={(value) => {
                            const parsed = Number(value);
                            onChange(syncTravelerLists(state, Number.isFinite(parsed) ? parsed : 0, travelers.children));
                        }}
                    />
                    <BookingTextField
                        id="travelers-children"
                        label="Children"
                        type="number"
                        inputMode="numeric"
                        step={1}
                        min={0}
                        max={MAX_CHILDREN}
                        value={String(travelers.children)}
                        error={errors['travelers-children']}
                        hint="Leave at 0 if no children are traveling."
                        onChange={(value) => {
                            const parsed = Number(value);
                            onChange(syncTravelerLists(state, travelers.adults, Number.isFinite(parsed) ? parsed : 0));
                        }}
                    />
                </div>
                <p className="text-sm text-muted-foreground">
                    Total travelers:{' '}
                    <span className="font-medium text-foreground">{travelers.adults + travelers.children}</span>
                </p>
            </StepSection>

            <StepSection
                title="Primary traveler"
                description="Enter your name exactly as shown on your travel document."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <BookingTextField
                        id="primary-firstName"
                        label="First name"
                        autoComplete="given-name"
                        required
                        maxLength={80}
                        value={travelers.primary.firstName}
                        error={errors['primary-firstName']}
                        onChange={(value) => patchPrimary({ firstName: value })}
                    />
                    <BookingTextField
                        id="primary-lastName"
                        label="Last name"
                        autoComplete="family-name"
                        required
                        maxLength={80}
                        value={travelers.primary.lastName}
                        error={errors['primary-lastName']}
                        onChange={(value) => patchPrimary({ lastName: value })}
                    />
                    <BookingTextField
                        id="primary-email"
                        label="Email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        required
                        maxLength={255}
                        placeholder="name@example.com"
                        value={travelers.primary.email}
                        error={errors['primary-email']}
                        onChange={(value) => patchPrimary({ email: value })}
                    />
                    <BookingTextField
                        id="primary-phone"
                        label="Phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        maxLength={60}
                        placeholder="+49 …"
                        hint="Include country code, for example +49 177 668 7088."
                        value={travelers.primary.phone}
                        error={errors['primary-phone']}
                        onChange={(value) => patchPrimary({ phone: value })}
                    />
                    <BookingTextField
                        id="primary-dateOfBirth"
                        label="Date of birth"
                        type="date"
                        autoComplete="bday"
                        required
                        min={minBirthIsoDate()}
                        max={today}
                        value={travelers.primary.dateOfBirth}
                        error={errors['primary-dateOfBirth']}
                        onChange={(value) => patchPrimary({ dateOfBirth: value })}
                    />
                    <BookingTextField
                        id="primary-nationality"
                        label="Nationality"
                        autoComplete="country-name"
                        required
                        maxLength={80}
                        value={travelers.primary.nationality}
                        error={errors['primary-nationality']}
                        onChange={(value) => patchPrimary({ nationality: value })}
                    />
                    <BookingTextField
                        id="primary-countryOfResidence"
                        label="Country of residence"
                        autoComplete="country-name"
                        required
                        maxLength={80}
                        value={travelers.primary.countryOfResidence}
                        error={errors['primary-countryOfResidence']}
                        onChange={(value) => patchPrimary({ countryOfResidence: value })}
                    />
                </div>
            </StepSection>

            {travelers.companions.length > 0 ? (
                <StepSection
                    title="Additional travelers"
                    description="Enter each name exactly as shown on the travel document. We only need contact details from the primary traveler."
                >
                    <div className="space-y-6">
                        {travelers.companions.map((companion, index) => (
                            <div
                                key={`companion-${index}`}
                                className="space-y-4 rounded-2xl border border-border bg-background/60 p-4 sm:p-5"
                            >
                                <h4 className="text-sm font-semibold text-foreground">{companionHeading(index)}</h4>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <BookingTextField
                                        id={`companion-${index}-firstName`}
                                        label="First name"
                                        autoComplete="off"
                                        required
                                        maxLength={80}
                                        value={companion.firstName}
                                        error={errors[`companion-${index}-firstName`]}
                                        onChange={(value) => patchCompanion(index, { firstName: value })}
                                    />
                                    <BookingTextField
                                        id={`companion-${index}-lastName`}
                                        label="Last name"
                                        autoComplete="off"
                                        required
                                        maxLength={80}
                                        value={companion.lastName}
                                        error={errors[`companion-${index}-lastName`]}
                                        onChange={(value) => patchCompanion(index, { lastName: value })}
                                    />
                                    <BookingTextField
                                        id={`companion-${index}-dateOfBirth`}
                                        label="Date of birth"
                                        type="date"
                                        required
                                        min={minBirthIsoDate()}
                                        max={today}
                                        value={companion.dateOfBirth}
                                        error={errors[`companion-${index}-dateOfBirth`]}
                                        onChange={(value) => patchCompanion(index, { dateOfBirth: value })}
                                    />
                                    <BookingTextField
                                        id={`companion-${index}-nationality`}
                                        label="Nationality"
                                        required
                                        maxLength={80}
                                        value={companion.nationality}
                                        error={errors[`companion-${index}-nationality`]}
                                        onChange={(value) => patchCompanion(index, { nationality: value })}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </StepSection>
            ) : null}

            <StepSection title="Group type">
                {inferred ? (
                    <p className="text-sm text-muted-foreground">
                        Based on the traveler count, we will treat this as a{' '}
                        <span className="font-medium text-foreground">{optionLabel(groupTypeOptions, inferred)}</span>{' '}
                        trip. You can choose a different type if needed.
                    </p>
                ) : (
                    <p className="text-sm text-muted-foreground">Choose the option that best describes this group.</p>
                )}
                <OptionCards
                    legend="Group type"
                    name="travelers-groupType"
                    options={groupTypeOptions}
                    value={travelers.groupType}
                    error={errors['travelers-groupType']}
                    hint={groupRequired ? undefined : 'Optional when we can infer this from the traveler count.'}
                    onChange={(value) => {
                        onChange({
                            ...state,
                            travelers: {
                                ...state.travelers,
                                groupType: travelers.groupType === value ? '' : value,
                            },
                        });
                    }}
                />
            </StepSection>
        </div>
    );
}
