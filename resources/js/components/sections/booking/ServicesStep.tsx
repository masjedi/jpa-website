import { type PackageServiceKey } from '@/components/sections/booking/bookingOptions';
import { useBookingTranslationContext } from '@/components/sections/booking/BookingTranslationContext';
import {
    BookingRadioGroup,
    BookingTextField,
    BookingTextareaField,
    CheckboxCard,
    OptionCards,
    StepSection,
    bookingErrorClass,
} from '@/components/sections/booking/bookingFields';
import {
    suggestedRoomCount,
    toggleService,
    withRoomPreference,
} from '@/components/sections/booking/bookingModel';
import type { BookingErrors, CustomBookingState, RoomPreference } from '@/types/customBooking';

interface ServicesStepProps {
    state: CustomBookingState;
    errors: BookingErrors;
    onChange: (next: CustomBookingState) => void;
}

export function ServicesStep({ state, errors, onChange }: ServicesStepProps) {
    const {
        serviceOptions,
        guideGenderOptions,
        guideLanguageOptions,
        vehicleOptions,
        transportCoverageOptions,
        accommodationLevelOptions,
        roomPreferenceOptions,
        flightAssistanceOptions,
        domesticTravelOptions,
    } = useBookingTranslationContext();
    const { services, travelers } = state;
    const suggestedRooms = suggestedRoomCount(
        travelers.adults,
        travelers.children,
        services.roomPreference,
    );

    const patchServices = (patch: Partial<CustomBookingState['services']>) => {
        onChange({
            ...state,
            services: {
                ...state.services,
                ...patch,
            },
        });
    };

    const handleServiceToggle = (key: PackageServiceKey | 'complete') => {
        onChange({
            ...state,
            services: toggleService(state.services, key),
        });
    };

    return (
        <div className="space-y-8">
            <StepSection
                title="What would you like us to arrange?"
                description="Choose only the services you need. Details appear after you select them."
            >
                <div data-field="services-arrangement" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <CheckboxCard
                        emphasized
                        invalid={Boolean(errors['services-arrangement'])}
                        checked={services.complete}
                        label="Complete custom package"
                        description="Includes guide, transportation, accommodation, airport assistance, and domestic travel. You can still adjust any of these."
                        onChange={() => handleServiceToggle('complete')}
                    />
                    {serviceOptions.map((option) => (
                        <CheckboxCard
                            key={option.key}
                            invalid={Boolean(errors['services-arrangement'])}
                            checked={services[option.key]}
                            label={option.label}
                            description={option.description}
                            onChange={() => handleServiceToggle(option.key)}
                        />
                    ))}
                </div>
                {errors['services-arrangement'] ? (
                    <p className={bookingErrorClass} role="alert">
                        {errors['services-arrangement']}
                    </p>
                ) : null}
            </StepSection>

            {services.guide ? (
                <StepSection title="Tour guide">
                    <BookingRadioGroup
                        legend="Preferred guide"
                        name="services-guideGender"
                        options={guideGenderOptions}
                        value={services.guideGender}
                        error={errors['services-guideGender']}
                        onChange={(value) => patchServices({ guideGender: value })}
                    />
                    <div className="mt-4">
                        <OptionCards
                            legend="Preferred guide language"
                            name="services-guideLanguage"
                            options={guideLanguageOptions}
                            value={services.guideLanguage}
                            error={errors['services-guideLanguage']}
                            onChange={(value) => patchServices({ guideLanguage: value })}
                        />
                    </div>
                    {services.guideLanguage === 'other' ? (
                        <div className="mt-4">
                            <BookingTextField
                                id="services-guideLanguageOther"
                                label="Other language"
                                required
                                maxLength={80}
                                value={services.guideLanguageOther}
                                error={errors['services-guideLanguageOther']}
                                onChange={(value) => patchServices({ guideLanguageOther: value })}
                            />
                        </div>
                    ) : null}
                    <div className="mt-4">
                        <BookingTextareaField
                            id="services-guideRequest"
                            label="Guide-related request"
                            hint="Optional. Share only what helps us assign a suitable guide."
                            rows={3}
                            maxLength={500}
                            value={services.guideRequest}
                            onChange={(value) => patchServices({ guideRequest: value })}
                        />
                    </div>
                </StepSection>
            ) : null}

            {services.transportation ? (
                <StepSection title="Transportation">
                    <OptionCards
                        legend="Vehicle preference"
                        name="services-vehicle"
                        options={vehicleOptions}
                        value={services.vehicle}
                        error={errors['services-vehicle']}
                        onChange={(value) => patchServices({ vehicle: value })}
                    />
                    <div className="mt-4">
                        <OptionCards
                            legend="Transportation coverage"
                            name="services-transportCoverage"
                            options={transportCoverageOptions}
                            value={services.transportCoverage}
                            columns={1}
                            error={errors['services-transportCoverage']}
                            hint="Agency vehicles include a professional driver."
                            onChange={(value) => patchServices({ transportCoverage: value })}
                        />
                    </div>
                    {services.transportCoverage === 'selected' ? (
                        <div className="mt-4">
                            <BookingTextareaField
                                id="services-transportNotes"
                                label="Where is transport required?"
                                required
                                rows={3}
                                maxLength={500}
                                value={services.transportNotes}
                                error={errors['services-transportNotes']}
                                onChange={(value) => patchServices({ transportNotes: value })}
                            />
                        </div>
                    ) : null}
                </StepSection>
            ) : null}

            {services.accommodation ? (
                <StepSection title="Accommodation">
                    <OptionCards
                        legend="Accommodation level"
                        name="services-accommodationLevel"
                        options={accommodationLevelOptions}
                        value={services.accommodationLevel}
                        error={errors['services-accommodationLevel']}
                        onChange={(value) => patchServices({ accommodationLevel: value })}
                    />
                    <div className="mt-4">
                        <OptionCards
                            legend="Room preference"
                            name="services-roomPreference"
                            options={roomPreferenceOptions}
                            value={services.roomPreference}
                            error={errors['services-roomPreference']}
                            onChange={(value) => {
                                onChange(withRoomPreference(state, value as RoomPreference));
                            }}
                        />
                    </div>
                    <div className="mt-4">
                        <BookingTextField
                            id="services-roomCount"
                            label="Number of rooms"
                            type="number"
                            inputMode="numeric"
                            step={1}
                            min={1}
                            max={12}
                            required
                            value={String(services.roomCount)}
                            error={errors['services-roomCount']}
                            hint={`Suggested from travelers and room type: ${suggestedRooms}. Adjust if needed.`}
                            onChange={(value) => {
                                const parsed = Number(value);
                                patchServices({
                                    roomCount: Number.isFinite(parsed) ? parsed : 0,
                                    roomsManual: true,
                                });
                            }}
                        />
                        {services.roomsManual && services.roomCount !== suggestedRooms ? (
                            <button
                                type="button"
                                className="mt-2 text-xs font-medium text-secondary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                onClick={() => {
                                    patchServices({
                                        roomCount: suggestedRooms,
                                        roomsManual: false,
                                    });
                                }}
                            >
                                Use suggested ({suggestedRooms})
                            </button>
                        ) : null}
                    </div>
                    <div className="mt-4">
                        <BookingTextareaField
                            id="services-accommodationNotes"
                            label="Accommodation notes"
                            hint="Optional. One place for any stay preference that matters."
                            rows={3}
                            maxLength={500}
                            value={services.accommodationNotes}
                            onChange={(value) => patchServices({ accommodationNotes: value })}
                        />
                    </div>
                </StepSection>
            ) : null}

            {services.airport ? (
                <StepSection title="Airport pickup / drop-off">
                    <OptionCards
                        legend="Arrival assistance"
                        name="services-arrivalAssistance"
                        options={flightAssistanceOptions}
                        value={services.arrivalAssistance}
                        error={errors['services-arrivalAssistance']}
                        onChange={(value) => patchServices({ arrivalAssistance: value })}
                    />
                    {services.arrivalAssistance === 'yes' ? (
                        <div className="mt-4 space-y-4">
                            <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
                                <input
                                    type="checkbox"
                                    className="mt-0.5 size-4 rounded border-border text-secondary focus:outline-focus"
                                    checked={services.arrivalDetailsLater}
                                    onChange={(event) =>
                                        patchServices({ arrivalDetailsLater: event.target.checked })
                                    }
                                />
                                I will provide flight details later
                            </label>
                            {!services.arrivalDetailsLater ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <BookingTextField
                                        id="services-arrivalAirport"
                                        label="Arrival airport"
                                        required
                                        maxLength={80}
                                        value={services.arrivalAirport}
                                        error={errors['services-arrivalAirport']}
                                        onChange={(value) => patchServices({ arrivalAirport: value })}
                                    />
                                    <BookingTextField
                                        id="services-arrivalDate"
                                        label="Arrival date"
                                        type="date"
                                        value={services.arrivalDate}
                                        error={errors['services-arrivalDate']}
                                        onChange={(value) => patchServices({ arrivalDate: value })}
                                    />
                                    <BookingTextField
                                        id="services-arrivalTime"
                                        label="Arrival time"
                                        type="time"
                                        value={services.arrivalTime}
                                        error={errors['services-arrivalTime']}
                                        onChange={(value) => patchServices({ arrivalTime: value })}
                                    />
                                    <BookingTextField
                                        id="services-arrivalFlight"
                                        label="Flight number"
                                        maxLength={12}
                                        autoCapitalize="characters"
                                        placeholder="TK 712"
                                        value={services.arrivalFlight}
                                        error={errors['services-arrivalFlight']}
                                        onChange={(value) => patchServices({ arrivalFlight: value })}
                                    />
                                </div>
                            ) : null}
                        </div>
                    ) : null}

                    <div className="mt-6">
                        <OptionCards
                            legend="Departure assistance"
                            name="services-departureAssistance"
                            options={flightAssistanceOptions}
                            value={services.departureAssistance}
                            error={errors['services-departureAssistance']}
                            onChange={(value) => patchServices({ departureAssistance: value })}
                        />
                    </div>
                    {services.departureAssistance === 'yes' ? (
                        <div className="mt-4 space-y-4">
                            <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
                                <input
                                    type="checkbox"
                                    className="mt-0.5 size-4 rounded border-border text-secondary focus:outline-focus"
                                    checked={services.departureDetailsLater}
                                    onChange={(event) =>
                                        patchServices({ departureDetailsLater: event.target.checked })
                                    }
                                />
                                I will provide flight details later
                            </label>
                            {!services.departureDetailsLater ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <BookingTextField
                                        id="services-departureAirport"
                                        label="Departure airport"
                                        required
                                        maxLength={80}
                                        value={services.departureAirport}
                                        error={errors['services-departureAirport']}
                                        onChange={(value) => patchServices({ departureAirport: value })}
                                    />
                                    <BookingTextField
                                        id="services-departureDate"
                                        label="Departure date"
                                        type="date"
                                        value={services.departureDate}
                                        error={errors['services-departureDate']}
                                        onChange={(value) => patchServices({ departureDate: value })}
                                    />
                                    <BookingTextField
                                        id="services-departureTime"
                                        label="Departure time"
                                        type="time"
                                        value={services.departureTime}
                                        error={errors['services-departureTime']}
                                        onChange={(value) => patchServices({ departureTime: value })}
                                    />
                                    <BookingTextField
                                        id="services-departureFlight"
                                        label="Flight number"
                                        maxLength={12}
                                        autoCapitalize="characters"
                                        placeholder="TK 712"
                                        value={services.departureFlight}
                                        error={errors['services-departureFlight']}
                                        onChange={(value) => patchServices({ departureFlight: value })}
                                    />
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </StepSection>
            ) : null}

            {services.domestic ? (
                <StepSection title="Domestic travel arrangements">
                    <OptionCards
                        legend="Preferred domestic travel arrangement"
                        name="services-domesticPreference"
                        options={domesticTravelOptions}
                        value={services.domesticPreference}
                        columns={1}
                        error={errors['services-domesticPreference']}
                        onChange={(value) => patchServices({ domesticPreference: value })}
                    />
                </StepSection>
            ) : null}
        </div>
    );
}
