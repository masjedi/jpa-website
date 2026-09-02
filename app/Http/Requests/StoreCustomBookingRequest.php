<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ProhibitsMassAssignmentFields;
use App\Http\Requests\Concerns\TrimsStringInput;
use App\Support\Booking\CustomBookingAttributes;
use App\Support\Booking\CustomBookingCatalog;
use App\Support\Booking\CustomBookingOptions;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreCustomBookingRequest extends FormRequest
{
    use ProhibitsMassAssignmentFields;
    use TrimsStringInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $trip = is_array($this->input('trip')) ? $this->input('trip') : [];
        $travelers = is_array($this->input('travelers')) ? $this->input('travelers') : [];
        $services = is_array($this->input('services')) ? $this->input('services') : [];
        $documents = is_array($this->input('documents')) ? $this->input('documents') : [];
        $requirements = is_array($this->input('requirements')) ? $this->input('requirements') : [];
        $agreements = is_array($this->input('agreements')) ? $this->input('agreements') : [];
        $primary = is_array($travelers['primary'] ?? null) ? $travelers['primary'] : [];

        $trip['recommendDestinations'] = $this->boolean('trip.recommendDestinations');
        $trip['startDate'] = $this->filled('trip.startDate') ? trim((string) $this->input('trip.startDate')) : null;
        $trip['season'] = $this->filled('trip.season') ? trim((string) $this->input('trip.season')) : null;
        $trip['otherDestination'] = trim((string) ($trip['otherDestination'] ?? ''));
        $trip['durationDays'] = (int) ($trip['durationDays'] ?? 0);

        $travelers['adults'] = (int) ($travelers['adults'] ?? 0);
        $travelers['children'] = (int) ($travelers['children'] ?? 0);
        $primary['email'] = isset($primary['email']) ? trim((string) $primary['email']) : '';
        $primary['phone'] = isset($primary['phone']) ? trim((string) $primary['phone']) : '';
        $travelers['primary'] = $primary;

        foreach ([
            'complete', 'guide', 'transportation', 'accommodation', 'airport', 'domestic',
            'arrivalDetailsLater', 'departureDetailsLater',
        ] as $flag) {
            $services[$flag] = $this->boolean('services.'.$flag);
        }
        $services['roomCount'] = (int) ($services['roomCount'] ?? 0);

        foreach ([
            'arrivalAirport', 'arrivalDate', 'arrivalTime', 'arrivalFlight',
            'departureAirport', 'departureDate', 'departureTime', 'departureFlight',
        ] as $optional) {
            $services[$optional] = filled($services[$optional] ?? null)
                ? trim((string) $services[$optional])
                : null;
        }

        foreach (['accuracy', 'terms', 'privacy', 'marketing'] as $flag) {
            $agreements[$flag] = $this->boolean('agreements.'.$flag);
        }

        $this->merge([
            'trip' => $trip,
            'travelers' => $travelers,
            'services' => $services,
            'documents' => $documents,
            'requirements' => $requirements,
            'agreements' => $agreements,
        ]);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $name = ['required', 'string', 'min:2', 'max:80', 'regex:'.CustomBookingOptions::NAME_REGEX];
        $guide = $this->boolean('services.guide');
        $transportation = $this->boolean('services.transportation');
        $accommodation = $this->boolean('services.accommodation');
        $airport = $this->boolean('services.airport');
        $domestic = $this->boolean('services.domestic');
        $arrivalLater = $this->boolean('services.arrivalDetailsLater');
        $departureLater = $this->boolean('services.departureDetailsLater');
        $arrivalYes = $this->input('services.arrivalAssistance') === 'yes';
        $departureYes = $this->input('services.departureAssistance') === 'yes';

        return [
            ...$this->prohibitedMassAssignmentRules(),
            'reference' => ['prohibited'],
            'quoted_amount' => ['prohibited'],
            'amount' => ['prohibited'],
            'price' => ['prohibited'],
            'internal_notes' => ['prohibited'],
            'approved_by' => ['prohibited'],
            'created_by' => ['prohibited'],
            'trip.flexibility' => ['required', 'string', Rule::in(CustomBookingOptions::flexibilities())],
            'trip.startDate' => [
                Rule::requiredIf(fn (): bool => in_array($this->input('trip.flexibility'), ['exact', 'plus_minus_3', 'plus_minus_week', 'within_month'], true)),
                'nullable',
                'date',
                'after_or_equal:today',
            ],
            'trip.season' => [
                Rule::requiredIf(fn (): bool => $this->input('trip.flexibility') === 'unsure'),
                'nullable',
                'string',
                Rule::in(CustomBookingCatalog::allowedSeasonValues()),
            ],
            'trip.durationDays' => [
                'required',
                'integer',
                'min:'.CustomBookingOptions::MIN_DURATION_DAYS,
                'max:'.CustomBookingOptions::MAX_DURATION_DAYS,
            ],
            'trip.destinations' => ['nullable', 'array'],
            'trip.destinations.*' => ['string', 'max:120', Rule::in(CustomBookingCatalog::allowedDestinationNames())],
            'trip.otherDestination' => [
                'nullable',
                'string',
                'max:120',
                Rule::requiredIf(fn (): bool => in_array(CustomBookingOptions::OTHER_DESTINATION, $this->input('trip.destinations', []), true)),
            ],
            'trip.recommendDestinations' => ['boolean'],
            'trip.interests' => ['required', 'array', 'min:1'],
            'trip.interests.*' => ['string', Rule::in(CustomBookingOptions::interests())],
            'trip.routePreference' => ['required', 'string', Rule::in(CustomBookingOptions::routePreferences())],
            'travelers.adults' => ['required', 'integer', 'min:1', 'max:'.CustomBookingOptions::MAX_ADULTS],
            'travelers.children' => ['required', 'integer', 'min:0', 'max:'.CustomBookingOptions::MAX_CHILDREN],
            'travelers.primary.firstName' => $name,
            'travelers.primary.lastName' => $name,
            'travelers.primary.email' => ['required', 'string', 'email:filter', 'min:5', 'max:255'],
            'travelers.primary.phone' => ['required', 'string', 'min:8', 'max:60', 'regex:'.CustomBookingOptions::PHONE_REGEX],
            'travelers.primary.dateOfBirth' => ['required', 'date', 'before:today'],
            'travelers.primary.nationality' => $name,
            'travelers.primary.countryOfResidence' => $name,
            'travelers.companions' => ['nullable', 'array'],
            'travelers.companions.*.firstName' => $name,
            'travelers.companions.*.lastName' => $name,
            'travelers.companions.*.dateOfBirth' => ['required', 'date', 'before:today'],
            'travelers.companions.*.nationality' => $name,
            'travelers.groupType' => ['nullable', 'string', Rule::in(CustomBookingOptions::groupTypes())],
            'services.complete' => ['boolean'],
            'services.guide' => ['boolean'],
            'services.transportation' => ['boolean'],
            'services.accommodation' => ['boolean'],
            'services.airport' => ['boolean'],
            'services.domestic' => ['boolean'],
            'services.guideGender' => [
                Rule::excludeIf(! $guide),
                'required',
                'string',
                Rule::in(CustomBookingOptions::guideGenders()),
            ],
            'services.guideLanguage' => [
                Rule::excludeIf(! $guide),
                'required',
                'string',
                Rule::in(CustomBookingOptions::guideLanguages()),
            ],
            'services.guideLanguageOther' => [
                Rule::excludeIf(! $guide || $this->input('services.guideLanguage') !== 'other'),
                'required',
                'string',
                'max:80',
            ],
            'services.guideRequest' => [Rule::excludeIf(! $guide), 'nullable', 'string', 'max:2000'],
            'services.vehicle' => [
                Rule::excludeIf(! $transportation),
                'required',
                'string',
                Rule::in(CustomBookingOptions::vehicles()),
            ],
            'services.transportCoverage' => [
                Rule::excludeIf(! $transportation),
                'required',
                'string',
                Rule::in(CustomBookingOptions::transportCoverages()),
            ],
            'services.transportNotes' => [
                Rule::excludeIf(! $transportation || $this->input('services.transportCoverage') !== 'selected'),
                'required',
                'string',
                'max:2000',
            ],
            'services.accommodationLevel' => [
                Rule::excludeIf(! $accommodation),
                'required',
                'string',
                Rule::in(CustomBookingOptions::accommodationLevels()),
            ],
            'services.roomPreference' => [
                Rule::excludeIf(! $accommodation),
                'required',
                'string',
                Rule::in(CustomBookingOptions::roomPreferences()),
            ],
            'services.roomCount' => [Rule::excludeIf(! $accommodation), 'required', 'integer', 'min:1', 'max:12'],
            'services.accommodationNotes' => [Rule::excludeIf(! $accommodation), 'nullable', 'string', 'max:2000'],
            'services.arrivalAssistance' => [
                Rule::excludeIf(! $airport),
                'required',
                'string',
                Rule::in(CustomBookingOptions::flightAssistance()),
            ],
            'services.arrivalDetailsLater' => ['boolean'],
            'services.arrivalAirport' => [
                Rule::excludeIf(! $airport || ! $arrivalYes || $arrivalLater),
                'required',
                'string',
                'max:80',
            ],
            'services.arrivalDate' => [
                Rule::excludeIf(! $airport || ! $arrivalYes || $arrivalLater),
                'nullable',
                'date',
            ],
            'services.arrivalTime' => [
                Rule::excludeIf(! $airport || ! $arrivalYes || $arrivalLater),
                'nullable',
                'string',
                'max:20',
                'regex:'.CustomBookingOptions::TIME_REGEX,
            ],
            'services.arrivalFlight' => [
                Rule::excludeIf(! $airport || ! $arrivalYes || $arrivalLater),
                'nullable',
                'string',
                'max:12',
                'regex:'.CustomBookingOptions::FLIGHT_REGEX,
            ],
            'services.departureAssistance' => [
                Rule::excludeIf(! $airport),
                'required',
                'string',
                Rule::in(CustomBookingOptions::flightAssistance()),
            ],
            'services.departureDetailsLater' => ['boolean'],
            'services.departureAirport' => [
                Rule::excludeIf(! $airport || ! $departureYes || $departureLater),
                'required',
                'string',
                'max:80',
            ],
            'services.departureDate' => [
                Rule::excludeIf(! $airport || ! $departureYes || $departureLater),
                'nullable',
                'date',
            ],
            'services.departureTime' => [
                Rule::excludeIf(! $airport || ! $departureYes || $departureLater),
                'nullable',
                'string',
                'max:20',
                'regex:'.CustomBookingOptions::TIME_REGEX,
            ],
            'services.departureFlight' => [
                Rule::excludeIf(! $airport || ! $departureYes || $departureLater),
                'nullable',
                'string',
                'max:12',
                'regex:'.CustomBookingOptions::FLIGHT_REGEX,
            ],
            'services.domesticPreference' => [
                Rule::excludeIf(! $domestic),
                'required',
                'string',
                Rule::in(CustomBookingOptions::domesticPreferences()),
            ],
            'documents.passports' => ['required', 'array', 'min:1'],
            'documents.passports.*.issuingCountry' => $name,
            'documents.passports.*.expiryDate' => ['required', 'date', 'after:today'],
            'documents.visaStatus' => ['required', 'string', Rule::in(CustomBookingOptions::visaStatuses())],
            'documents.insuranceStatus' => ['required', 'string', Rule::in(CustomBookingOptions::insuranceStatuses())],
            'requirements.emergencyName' => ['required', 'string', 'min:2', 'max:120'],
            'requirements.emergencyRelationship' => ['required', 'string', 'min:2', 'max:80'],
            'requirements.emergencyPhone' => ['required', 'string', 'min:8', 'max:60', 'regex:'.CustomBookingOptions::PHONE_REGEX],
            'requirements.dietary' => ['required', 'string', Rule::in(CustomBookingOptions::dietaryOptions())],
            'requirements.dietaryDetails' => [
                Rule::requiredIf(fn (): bool => in_array($this->input('requirements.dietary'), ['allergy', 'other'], true)),
                'nullable',
                'string',
                'max:1000',
            ],
            'requirements.medical' => ['required', 'string', Rule::in(CustomBookingOptions::medicalOptions())],
            'requirements.medicalDetails' => [
                Rule::requiredIf(fn (): bool => $this->input('requirements.medical') === 'yes'),
                'nullable',
                'string',
                'max:2000',
            ],
            'requirements.contactMethod' => ['required', 'string', Rule::in(CustomBookingOptions::contactMethods())],
            'requirements.specialRequests' => ['nullable', 'string', 'max:2000'],
            'agreements.accuracy' => ['accepted'],
            'agreements.terms' => ['accepted'],
            'agreements.privacy' => ['accepted'],
            'agreements.marketing' => ['boolean'],
        ];
    }

    /**
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $adults = (int) $this->input('travelers.adults');
                $children = (int) $this->input('travelers.children');
                $total = $adults + $children;

                if ($total > CustomBookingOptions::MAX_TRAVELERS) {
                    $validator->errors()->add(
                        'travelers.adults',
                        'The group cannot exceed '.CustomBookingOptions::MAX_TRAVELERS.' travelers.',
                    );
                }

                $companionCount = count($this->input('travelers.companions', []));
                if ($companionCount !== max(0, $total - 1)) {
                    $validator->errors()->add(
                        'travelers.adults',
                        'Traveler details do not match the selected traveler count.',
                    );
                }

                $passportCount = count($this->input('documents.passports', []));
                if ($passportCount < $total) {
                    $validator->errors()->add(
                        'documents.passports.0.issuingCountry',
                        'Add passport details for each traveler.',
                    );
                }

                $needsDestinations = ! $this->boolean('trip.recommendDestinations')
                    && $this->input('trip.routePreference') !== 'recommend';

                if ($needsDestinations && count($this->input('trip.destinations', [])) === 0) {
                    $validator->errors()->add('trip.destinations', 'Select at least one destination, or ask us to recommend them.');
                }

                $hasService = $this->boolean('services.complete')
                    || $this->boolean('services.guide')
                    || $this->boolean('services.transportation')
                    || $this->boolean('services.accommodation')
                    || $this->boolean('services.airport')
                    || $this->boolean('services.domestic');

                if (! $hasService) {
                    $validator->errors()->add('services.complete', 'Select at least one service, or choose a complete custom package.');
                }

                if (
                    CustomBookingAttributes::inferredGroupType($adults, $children) === null
                    && blank($this->input('travelers.groupType'))
                ) {
                    $validator->errors()->add('travelers.groupType', 'Choose a group type.');
                }
            },
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'travelers.primary.firstName.regex' => 'Enter the first name using letters only, as shown on the travel document.',
            'travelers.primary.lastName.regex' => 'Enter the last name using letters only, as shown on the travel document.',
            'travelers.primary.nationality.regex' => 'Enter a valid nationality using letters only.',
            'travelers.primary.email.required' => 'Enter an email address.',
            'travelers.primary.email.email' => 'Enter a valid email address, for example name@example.com.',
            'travelers.primary.phone.regex' => 'Enter a valid phone number with country code, for example +49 177 668 7088.',
            'requirements.emergencyPhone.regex' => 'Enter a valid phone number with country code, for example +49 177 668 7088.',
            'services.arrivalTime.regex' => 'Enter a valid arrival time, for example 14:30.',
            'services.departureTime.regex' => 'Enter a valid departure time, for example 14:30.',
            'services.arrivalFlight.regex' => 'Enter a valid flight number, for example TK 712.',
            'services.departureFlight.regex' => 'Enter a valid flight number, for example TK 712.',
            'agreements.accuracy.accepted' => 'Please confirm that the information is accurate.',
            'agreements.terms.accepted' => 'Please agree to the booking terms and cancellation policy.',
            'agreements.privacy.accepted' => 'Please acknowledge the privacy policy.',
            'trip.destinations.*.in' => 'Choose a destination from the published list.',
        ];
    }
}
