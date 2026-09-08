import { useBookingTranslationContext } from '@/components/sections/booking/BookingTranslationContext';
import {
    BookingExclusiveCheckboxes,
    BookingTextField,
} from '@/components/sections/booking/bookingFields';
import { BookingChoiceDropdown } from '@/components/sections/booking/BookingChoiceDropdown';
import type {
    BookingErrors,
    CustomBookingState,
    DietaryRequirement,
    MedicalNeed,
    PreferredContactMethod,
} from '@/types/customBooking';

interface RequirementsStepProps {
    state: CustomBookingState;
    errors: BookingErrors;
    onChange: (next: CustomBookingState) => void;
}

function nextDietary(current: readonly DietaryRequirement[], selected: DietaryRequirement[]): DietaryRequirement[] {
    if (selected.includes('none') && selected.length > 1) {
        const addedNone = !current.includes('none');

        return addedNone ? ['none'] : selected.filter((item) => item !== 'none');
    }

    return selected;
}

export function RequirementsStep({ state, errors, onChange }: RequirementsStepProps) {
    const { dietaryOptions, contactMethodOptions } = useBookingTranslationContext();
    const { requirements } = state;
    const showDietaryDetails =
        requirements.dietary.includes('allergy') || requirements.dietary.includes('other');

    const patch = (next: Partial<CustomBookingState['requirements']>) => {
        onChange({
            ...state,
            requirements: {
                ...state.requirements,
                ...next,
            },
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <BookingTextField
                    id="requirements-emergencyName"
                    label="Full name"
                    required
                    maxLength={120}
                    value={requirements.emergencyName}
                    error={errors['requirements-emergencyName']}
                    onChange={(value) => patch({ emergencyName: value })}
                />
                <BookingTextField
                    id="requirements-emergencyRelationship"
                    label="Relationship"
                    required
                    maxLength={80}
                    value={requirements.emergencyRelationship}
                    error={errors['requirements-emergencyRelationship']}
                    onChange={(value) => patch({ emergencyRelationship: value })}
                />
                <div className="sm:col-span-2">
                    <BookingTextField
                        id="requirements-emergencyPhone"
                        label="Phone"
                        type="tel"
                        inputMode="tel"
                        required
                        maxLength={60}
                        placeholder="+49 …"
                        value={requirements.emergencyPhone}
                        error={errors['requirements-emergencyPhone']}
                        onChange={(value) => patch({ emergencyPhone: value })}
                    />
                </div>
            </div>

            <BookingChoiceDropdown
                id="requirements-dietary"
                label="Dietary requirement"
                options={dietaryOptions}
                values={requirements.dietary}
                multiple
                required
                placeholder="Select dietary requirement"
                error={errors['requirements-dietary']}
                onChange={(next) => {
                    const dietary = nextDietary(requirements.dietary, next as DietaryRequirement[]);
                    patch({
                        dietary,
                        dietaryDetails:
                            dietary.includes('allergy') || dietary.includes('other')
                                ? requirements.dietaryDetails
                                : '',
                    });
                }}
            />
            {showDietaryDetails ? (
                <BookingTextField
                    id="requirements-dietaryDetails"
                    label={requirements.dietary.includes('allergy') ? 'Allergy details' : 'Please specify'}
                    required
                    maxLength={240}
                    value={requirements.dietaryDetails}
                    error={errors['requirements-dietaryDetails']}
                    onChange={(value) => patch({ dietaryDetails: value })}
                />
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
                <BookingExclusiveCheckboxes
                    id="requirements-medical"
                    label="Do you have any medical accessibility requirement?"
                    value={requirements.medical}
                    options={[
                        { value: 'yes', label: 'YES' },
                        { value: 'no', label: 'NO' },
                    ]}
                    error={errors['requirements-medical']}
                    onChange={(value) => patch({ medical: value as MedicalNeed })}
                />
                <BookingChoiceDropdown
                    id="requirements-contactMethod"
                    label="Preferred contact method"
                    options={contactMethodOptions}
                    values={requirements.contactMethod === '' ? [] : [requirements.contactMethod]}
                    required
                    placeholder="Select contact method"
                    error={errors['requirements-contactMethod']}
                    onChange={(next) => patch({ contactMethod: (next[0] ?? '') as PreferredContactMethod | '' })}
                />
            </div>
        </div>
    );
}
