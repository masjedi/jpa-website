import { useBookingTranslationContext } from '@/components/sections/booking/BookingTranslationContext';
import {
    BookingTextField,
    OptionCards,
    StepSection,
} from '@/components/sections/booking/bookingFields';
import { todayIsoDate, travelerCount } from '@/components/sections/booking/bookingModel';
import type { BookingErrors, CustomBookingState, TravelerDocument } from '@/types/customBooking';

interface TravelDocumentsStepProps {
    state: CustomBookingState;
    errors: BookingErrors;
    onChange: (next: CustomBookingState) => void;
}

function travelerLabel(state: CustomBookingState, index: number): string {
    if (index === 0) {
        const name = `${state.travelers.primary.firstName} ${state.travelers.primary.lastName}`.trim();
        return name === '' ? 'Primary traveler' : name;
    }

    const companion = state.travelers.companions[index - 1];
    const name = `${companion?.firstName ?? ''} ${companion?.lastName ?? ''}`.trim();

    return name === '' ? `Traveler ${index + 1}` : name;
}

export function TravelDocumentsStep({ state, errors, onChange }: TravelDocumentsStepProps) {
    const { visaStatusOptions, insuranceStatusOptions } = useBookingTranslationContext();
    const total = travelerCount(state.travelers.adults, state.travelers.children);
    const passports = state.documents.passports.slice(0, total);
    const minExpiry = todayIsoDate();

    const patchPassport = (index: number, patch: Partial<TravelerDocument>) => {
        onChange({
            ...state,
            documents: {
                ...state.documents,
                passports: state.documents.passports.map((passport, passportIndex) =>
                    passportIndex === index ? { ...passport, ...patch } : passport,
                ),
            },
        });
    };

    return (
        <div className="space-y-8">
            <StepSection
                title="Passport / Travel document"
                description="We only need issuing country and expiry at this stage. Passport numbers and scans are not required for the initial request."
            >
                <p className="rounded-xl border border-border bg-surface-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                    A passport scan may be requested securely after we review this booking request. Do not send document images by unsecured email unless our team asks you to.
                </p>
                <div className="space-y-6">
                    {passports.map((passport, index) => (
                        <div
                            key={`doc-${index}`}
                            className="space-y-4 rounded-2xl border border-border bg-background/60 p-4 sm:p-5"
                        >
                            <h4 className="text-sm font-semibold text-foreground">{travelerLabel(state, index)}</h4>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <BookingTextField
                                    id={`doc-${index}-issuingCountry`}
                                    label="Passport issuing country"
                                    required
                                    maxLength={80}
                                    value={passport.issuingCountry}
                                    error={errors[`doc-${index}-issuingCountry`]}
                                    onChange={(value) => patchPassport(index, { issuingCountry: value })}
                                />
                                <BookingTextField
                                    id={`doc-${index}-expiryDate`}
                                    label="Passport expiry date"
                                    type="date"
                                    required
                                    min={minExpiry}
                                    value={passport.expiryDate}
                                    error={errors[`doc-${index}-expiryDate`]}
                                    onChange={(value) => patchPassport(index, { expiryDate: value })}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </StepSection>

            <StepSection title="Visa status">
                <OptionCards
                    legend="Afghanistan visa status"
                    name="documents-visaStatus"
                    options={visaStatusOptions}
                    value={state.documents.visaStatus}
                    error={errors['documents-visaStatus']}
                    hint="Choose Need guidance if you would like visa and permit advice from our team."
                    onChange={(value) => {
                        onChange({
                            ...state,
                            documents: {
                                ...state.documents,
                                visaStatus: value,
                            },
                        });
                    }}
                />
            </StepSection>

            <StepSection title="Travel insurance">
                <OptionCards
                    legend="Travel insurance status"
                    name="documents-insuranceStatus"
                    options={insuranceStatusOptions}
                    value={state.documents.insuranceStatus}
                    error={errors['documents-insuranceStatus']}
                    onChange={(value) => {
                        onChange({
                            ...state,
                            documents: {
                                ...state.documents,
                                insuranceStatus: value,
                            },
                        });
                    }}
                />
            </StepSection>
        </div>
    );
}
