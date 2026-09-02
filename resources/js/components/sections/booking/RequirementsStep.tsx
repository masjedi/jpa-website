import { useBookingTranslationContext } from '@/components/sections/booking/BookingTranslationContext';
import {
    BookingTextField,
    BookingTextareaField,
    OptionCards,
    StepSection,
} from '@/components/sections/booking/bookingFields';
import type { BookingErrors, CustomBookingState } from '@/types/customBooking';

interface RequirementsStepProps {
    state: CustomBookingState;
    errors: BookingErrors;
    onChange: (next: CustomBookingState) => void;
}

export function RequirementsStep({ state, errors, onChange }: RequirementsStepProps) {
    const { dietaryOptions, contactMethodOptions } = useBookingTranslationContext();
    const { requirements } = state;
    const showDietaryDetails = requirements.dietary === 'allergy' || requirements.dietary === 'other';

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
        <div className="space-y-8">
            <StepSection
                title="Emergency contact"
                description="Someone we can reach if we cannot reach the primary traveler while planning."
            >
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
                            hint="Include country code."
                            value={requirements.emergencyPhone}
                            error={errors['requirements-emergencyPhone']}
                            onChange={(value) => patch({ emergencyPhone: value })}
                        />
                    </div>
                </div>
            </StepSection>

            <StepSection title="Dietary requirements">
                <OptionCards
                    legend="Dietary requirements"
                    name="requirements-dietary"
                    options={dietaryOptions}
                    value={requirements.dietary}
                    error={errors['requirements-dietary']}
                    onChange={(value) =>
                        patch({
                            dietary: value,
                            dietaryDetails:
                                value === 'allergy' || value === 'other' ? requirements.dietaryDetails : '',
                        })
                    }
                />
                {showDietaryDetails ? (
                    <div className="mt-4">
                        <BookingTextField
                            id="requirements-dietaryDetails"
                            label={requirements.dietary === 'allergy' ? 'Allergy details' : 'Please specify'}
                            required
                            maxLength={240}
                            value={requirements.dietaryDetails}
                            error={errors['requirements-dietaryDetails']}
                            onChange={(value) => patch({ dietaryDetails: value })}
                        />
                    </div>
                ) : null}
            </StepSection>

            <StepSection title="Medical / accessibility needs">
                <OptionCards
                    legend="Do you have any medical, mobility, or accessibility requirement our team should know about when planning the trip?"
                    name="requirements-medical"
                    options={[
                        { value: 'no', label: 'No' },
                        { value: 'yes', label: 'Yes' },
                    ]}
                    value={requirements.medical}
                    columns={2}
                    error={errors['requirements-medical']}
                    onChange={(value) =>
                        patch({
                            medical: value,
                            medicalDetails: value === 'yes' ? requirements.medicalDetails : '',
                        })
                    }
                />
                {requirements.medical === 'yes' ? (
                    <div className="mt-4">
                        <BookingTextareaField
                            id="requirements-medicalDetails"
                            label="Please provide only information relevant to planning your journey safely and appropriately."
                            required
                            rows={4}
                            maxLength={1000}
                            value={requirements.medicalDetails}
                            error={errors['requirements-medicalDetails']}
                            onChange={(value) => patch({ medicalDetails: value })}
                        />
                    </div>
                ) : null}
            </StepSection>

            <StepSection title="Preferred contact method">
                <OptionCards
                    legend="How should we reach you?"
                    name="requirements-contactMethod"
                    options={contactMethodOptions}
                    value={requirements.contactMethod}
                    error={errors['requirements-contactMethod']}
                    onChange={(value) => patch({ contactMethod: value })}
                />
            </StepSection>

            <StepSection title="Special requests">
                <BookingTextareaField
                    id="requirements-specialRequests"
                    label="Anything else we should know when planning your custom journey?"
                    hint="Optional."
                    rows={4}
                    maxLength={2000}
                    value={requirements.specialRequests}
                    onChange={(value) => patch({ specialRequests: value })}
                />
            </StepSection>
        </div>
    );
}
