import { useBookingTranslationContext } from '@/components/sections/booking/BookingTranslationContext';
import { BookingTextField } from '@/components/sections/booking/bookingFields';
import { BookingChoiceDropdown } from '@/components/sections/booking/BookingChoiceDropdown';
import { todayIsoDate, travelerCount } from '@/components/sections/booking/bookingModel';
import type { BookingErrors, CustomBookingState, TravelerDocument, VisaStatus } from '@/types/customBooking';

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
    const { visaStatusOptions } = useBookingTranslationContext();
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
        <div className="space-y-6">
            {passports.map((passport, index) => (
                <div
                    key={`doc-${index}`}
                    className={index > 0 ? 'space-y-4 border-t border-border pt-6' : 'space-y-4'}
                >
                    {total > 1 ? (
                        <h4 className="text-sm font-semibold text-foreground">{travelerLabel(state, index)}</h4>
                    ) : null}
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

            <BookingChoiceDropdown
                id="documents-visaStatus"
                label="Visa status"
                options={visaStatusOptions}
                values={state.documents.visaStatus === '' ? [] : [state.documents.visaStatus]}
                required
                placeholder="Select visa status"
                error={errors['documents-visaStatus']}
                onChange={(next) => {
                    onChange({
                        ...state,
                        documents: {
                            ...state.documents,
                            visaStatus: (next[0] ?? '') as VisaStatus | '',
                        },
                    });
                }}
            />
        </div>
    );
}
