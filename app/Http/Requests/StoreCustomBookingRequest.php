<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ProhibitsMassAssignmentFields;
use App\Http\Requests\Concerns\TrimsStringInput;
use App\Support\Booking\CustomBookingCatalog;
use App\Support\Booking\CustomBookingOptions;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
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
        $trip['endDate'] = $this->filled('trip.endDate') ? trim((string) $this->input('trip.endDate')) : null;
        $trip['season'] = $this->filled('trip.season') ? trim((string) $this->input('trip.season')) : null;
        $trip['otherDestination'] = '';
        $trip['durationDays'] = (int) ($trip['durationDays'] ?? 0);
        $trip['destinations'] = is_array($trip['destinations'] ?? null) ? array_values($trip['destinations']) : [];

        if ($trip['recommendDestinations']) {
            $trip['destinations'] = [];
        }

        if (($trip['flexibility'] ?? '') === 'unsure') {
            $trip['startDate'] = null;
            $trip['endDate'] = null;
            $trip['durationDays'] = 0;
        } elseif (filled($trip['startDate']) && filled($trip['endDate'])) {
            try {
                $start = Carbon::parse($trip['startDate'])->startOfDay();
                $end = Carbon::parse($trip['endDate'])->startOfDay();

                if ($end->greaterThanOrEqualTo($start)) {
                    $trip['durationDays'] = (int) $start->diffInDays($end) + 1;
                }
            } catch (\Throwable) {
            }
        }

        $travelers['groupType'] = trim((string) ($travelers['groupType'] ?? ''));
        $travelers['adults'] = (int) ($travelers['adults'] ?? 0);
        $travelers['children'] = (int) ($travelers['children'] ?? 0);

        if ($travelers['groupType'] === 'private') {
            $travelers['adults'] = 1;
            $travelers['children'] = 0;
            $travelers['companions'] = [];
        }

        if ($travelers['groupType'] === 'group') {
            $travelers['children'] = 0;
        }

        $primary['email'] = isset($primary['email']) ? trim((string) $primary['email']) : '';
        $primary['phone'] = isset($primary['phone']) ? trim((string) $primary['phone']) : '';
        $travelers['primary'] = $primary;

        $services['guideLanguages'] = is_array($services['guideLanguages'] ?? null)
            ? array_values(array_filter(array_map(
                fn (mixed $language): string => trim((string) $language),
                $services['guideLanguages'],
            )))
            : [];
        $services['guideCount'] = (int) ($services['guideCount'] ?? 0);
        $services['airportPickup'] = trim((string) ($services['airportPickup'] ?? ''));
        $services['guide'] = true;
        $services['transportation'] = true;
        $services['accommodation'] = true;
        $services['domestic'] = true;
        $services['complete'] = false;
        $services['airport'] = $services['airportPickup'] === 'yes';
        $services['roomCount'] = (int) ($services['roomCount'] ?? 0);

        foreach ([
            'arrivalDetailsLater', 'departureDetailsLater',
        ] as $flag) {
            $services[$flag] = $this->boolean('services.'.$flag);
        }

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

        $documents['visaStatus'] = trim((string) ($documents['visaStatus'] ?? ''));
        $documents['insuranceStatus'] = filled($documents['insuranceStatus'] ?? null)
            ? trim((string) $documents['insuranceStatus'])
            : 'will_arrange';

        $requirements['dietary'] = array_values(array_unique(
            is_array($requirements['dietary'] ?? null)
                ? array_filter(array_map(
                    fn (mixed $item): string => trim((string) $item),
                    $requirements['dietary'],
                ))
                : (filled($requirements['dietary'] ?? null) ? [trim((string) $requirements['dietary'])] : []),
        ));
        $requirements['specialRequests'] = '';
        $requirements['medicalDetails'] = '';

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
                Rule::requiredIf(fn (): bool => $this->input('trip.flexibility') === 'known'),
                'nullable',
                'date',
                'after_or_equal:today',
            ],
            'trip.endDate' => [
                Rule::requiredIf(fn (): bool => $this->input('trip.flexibility') === 'known'),
                'nullable',
                'date',
                'after_or_equal:today',
                Rule::when(filled($this->input('trip.startDate')), ['after_or_equal:trip.startDate']),
            ],
            'trip.season' => [
                'nullable',
                'string',
                Rule::in(CustomBookingCatalog::allowedSeasonValues()),
            ],
            'trip.durationDays' => [
                Rule::requiredIf(fn (): bool => $this->input('trip.flexibility') === 'known'),
                'nullable',
                'integer',
                'min:'.($this->input('trip.flexibility') === 'unsure' ? 0 : CustomBookingOptions::MIN_DURATION_DAYS),
                'max:'.CustomBookingOptions::MAX_DURATION_DAYS,
            ],
            'trip.destinations' => ['nullable', 'array'],
            'trip.destinations.*' => ['string', 'max:120', Rule::in(CustomBookingCatalog::allowedDestinationNames())],
            'trip.otherDestination' => ['nullable', 'string', 'max:120'],
            'trip.recommendDestinations' => ['boolean'],
            'trip.interests' => ['required', 'array', 'min:1'],
            'trip.interests.*' => ['string', Rule::in(CustomBookingOptions::interests())],
            'trip.routePreference' => ['required', 'string', Rule::in(CustomBookingOptions::routePreferences())],
            'travelers.adults' => [
                'required',
                'integer',
                Rule::when(
                    $this->input('travelers.groupType') === 'group',
                    ['min:2', 'max:'.CustomBookingOptions::MAX_TRAVELERS],
                ),
                Rule::when(
                    $this->input('travelers.groupType') !== 'group',
                    ['min:1', 'max:'.CustomBookingOptions::MAX_ADULTS],
                ),
            ],
            'travelers.children' => ['required', 'integer', 'min:0', 'max:'.CustomBookingOptions::MAX_CHILDREN],
            'travelers.primary.firstName' => $name,
            'travelers.primary.lastName' => $name,
            'travelers.primary.email' => ['required', 'string', 'email:filter', 'min:5', 'max:255'],
            'travelers.primary.phone' => ['required', 'string', 'min:8', 'max:60', 'regex:'.CustomBookingOptions::PHONE_REGEX],
            'travelers.primary.dateOfBirth' => ['required', 'date', 'before:today'],
            'travelers.primary.nationality' => $name,
            'travelers.primary.countryOfResidence' => $name,
            'travelers.primary.isFirstVisit' => ['required', 'string', Rule::in(CustomBookingOptions::firstVisitAnswers())],
            'travelers.companions' => ['nullable', 'array'],
            'travelers.companions.*.firstName' => $name,
            'travelers.companions.*.lastName' => $name,
            'travelers.companions.*.email' => ['required', 'string', 'email:filter', 'min:5', 'max:255'],
            'travelers.companions.*.phone' => ['required', 'string', 'min:8', 'max:60', 'regex:'.CustomBookingOptions::PHONE_REGEX],
            'travelers.companions.*.dateOfBirth' => ['required', 'date', 'before:today'],
            'travelers.companions.*.nationality' => $name,
            'travelers.companions.*.countryOfResidence' => $name,
            'travelers.companions.*.isFirstVisit' => ['required', 'string', Rule::in(CustomBookingOptions::firstVisitAnswers())],
            'travelers.groupType' => ['required', 'string', Rule::in(CustomBookingOptions::groupTypes())],
            'services.complete' => ['boolean'],
            'services.guide' => ['boolean'],
            'services.transportation' => ['boolean'],
            'services.accommodation' => ['boolean'],
            'services.airport' => ['boolean'],
            'services.domestic' => ['boolean'],
            'services.guideCount' => ['required', 'integer', 'min:1', 'max:'.CustomBookingOptions::MAX_GUIDES],
            'services.guideGender' => ['required', 'string', Rule::in(CustomBookingOptions::guideGenders())],
            'services.guideLanguages' => ['required', 'array', 'min:1'],
            'services.guideLanguages.*' => ['string', Rule::in(CustomBookingOptions::guideLanguages())],
            'services.guideLanguage' => ['nullable', 'string', Rule::in(CustomBookingOptions::guideLanguages())],
            'services.guideLanguageOther' => ['nullable', 'string', 'max:80'],
            'services.guideRequest' => ['nullable', 'string', 'max:2000'],
            'services.vehicle' => ['required', 'string', Rule::in(CustomBookingOptions::vehicles())],
            'services.transportCoverage' => ['required', 'string', Rule::in(CustomBookingOptions::transportCoverages())],
            'services.transportNotes' => ['nullable', 'string', 'max:2000'],
            'services.accommodationLevel' => ['required', 'string', Rule::in(CustomBookingOptions::accommodationLevels())],
            'services.roomPreference' => ['required', 'string', Rule::in(CustomBookingOptions::roomPreferences())],
            'services.roomCount' => ['required', 'integer', 'min:1', 'max:12'],
            'services.accommodationNotes' => ['nullable', 'string', 'max:2000'],
            'services.airportPickup' => ['required', 'string', Rule::in(CustomBookingOptions::firstVisitAnswers())],
            'services.arrivalAssistance' => ['nullable', 'string', Rule::in(CustomBookingOptions::flightAssistance())],
            'services.arrivalDetailsLater' => ['boolean'],
            'services.arrivalAirport' => ['nullable', 'string', 'max:80'],
            'services.arrivalDate' => ['nullable', 'date'],
            'services.arrivalTime' => ['nullable', 'string', 'max:20', 'regex:'.CustomBookingOptions::TIME_REGEX],
            'services.arrivalFlight' => ['nullable', 'string', 'max:12', 'regex:'.CustomBookingOptions::FLIGHT_REGEX],
            'services.departureAssistance' => ['nullable', 'string', Rule::in(CustomBookingOptions::flightAssistance())],
            'services.departureDetailsLater' => ['boolean'],
            'services.departureAirport' => ['nullable', 'string', 'max:80'],
            'services.departureDate' => ['nullable', 'date'],
            'services.departureTime' => ['nullable', 'string', 'max:20', 'regex:'.CustomBookingOptions::TIME_REGEX],
            'services.departureFlight' => ['nullable', 'string', 'max:12', 'regex:'.CustomBookingOptions::FLIGHT_REGEX],
            'services.domesticPreference' => ['required', 'string', Rule::in(CustomBookingOptions::domesticPreferences())],
            'documents.passports' => ['required', 'array', 'min:1'],
            'documents.passports.*.issuingCountry' => $name,
            'documents.passports.*.expiryDate' => ['required', 'date', 'after:today'],
            'documents.visaStatus' => ['required', 'string', Rule::in(CustomBookingOptions::visaStatuses())],
            'documents.insuranceStatus' => ['required', 'string', Rule::in(CustomBookingOptions::insuranceStatuses())],
            'requirements.emergencyName' => ['required', 'string', 'min:2', 'max:120'],
            'requirements.emergencyRelationship' => ['required', 'string', 'min:2', 'max:80'],
            'requirements.emergencyPhone' => ['required', 'string', 'min:8', 'max:60', 'regex:'.CustomBookingOptions::PHONE_REGEX],
            'requirements.dietary' => ['required', 'array', 'min:1'],
            'requirements.dietary.*' => ['string', Rule::in(CustomBookingOptions::dietaryOptions())],
            'requirements.dietaryDetails' => [
                Rule::requiredIf(fn (): bool => count(array_intersect(
                    is_array($this->input('requirements.dietary')) ? $this->input('requirements.dietary') : [],
                    ['allergy', 'other'],
                )) > 0),
                'nullable',
                'string',
                'max:1000',
            ],
            'requirements.medical' => ['required', 'string', Rule::in(CustomBookingOptions::medicalOptions())],
            'requirements.medicalDetails' => ['nullable', 'string', 'max:2000'],
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
                        'Add a tourist form for each tourist until the count matches.',
                    );
                }

                if ($this->input('travelers.groupType') === 'group' && $total < 2) {
                    $validator->errors()->add(
                        'travelers.adults',
                        'A group booking needs at least two tourists.',
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
            'travelers.primary.isFirstVisit.required' => 'Choose whether this is the first visit.',
            'travelers.companions.*.isFirstVisit.required' => 'Choose whether this is the first visit.',
            'requirements.emergencyPhone.regex' => 'Enter a valid phone number with country code, for example +49 177 668 7088.',
            'services.arrivalTime.regex' => 'Enter a valid arrival time, for example 14:30.',
            'services.departureTime.regex' => 'Enter a valid departure time, for example 14:30.',
            'services.arrivalFlight.regex' => 'Enter a valid flight number, for example TK 712.',
            'services.departureFlight.regex' => 'Enter a valid flight number, for example TK 712.',
            'agreements.accuracy.accepted' => 'Please confirm that the information is accurate.',
            'agreements.terms.accepted' => 'Please agree to the booking terms and cancellation policy.',
            'agreements.privacy.accepted' => 'Please acknowledge the privacy policy.',
            'trip.destinations.*.in' => 'Choose a province from the list.',
        ];
    }
}
