<?php

namespace App\Support\Booking;

use App\Enums\CustomBookingRequestKind;
use Illuminate\Validation\Rule;

final class CustomBookingValidation
{
    /**
     * @return array<string, array<int, mixed>>
     */
    public static function fieldRules(bool $enforceFuturePreferredDates = true): array
    {
        $preferredDate = ['nullable', 'date', 'required_without:alternative_date'];

        if ($enforceFuturePreferredDates) {
            $preferredDate[] = 'after_or_equal:today';
        }

        return [
            'request_kind' => ['nullable', 'string', Rule::enum(CustomBookingRequestKind::class)],
            'package_title' => ['nullable', 'required_if:request_kind,seasonal_package', 'string', 'max:200'],
            'package_price' => ['nullable', 'string', 'max:120'],
            'full_name' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email:rfc,filter', 'max:50'],
            'phone' => ['required', 'string', 'max:16', 'regex:/^\+[1-9]\d{6,14}$/'],
            'passport_number' => ['required', 'string', 'max:20'],
            'country' => ['required', 'string', 'max:15'],
            'tour_type' => ['required', 'string', Rule::in(['group', 'individual'])],
            'number_of_tourists' => ['required', 'integer', 'min:1', 'max:100'],
            'tourist_genders' => ['required', 'array', 'min:1'],
            'tourist_genders.*' => ['string', Rule::in(['male', 'female'])],
            'guide_preference' => ['required', 'string', Rule::in(['male', 'female', 'no_preference'])],
            'preferred_date' => $preferredDate,
            'preferred_date_end' => ['nullable', 'date', 'after_or_equal:preferred_date', 'required_with:preferred_date'],
            'alternative_date' => array_values(array_filter([
                'nullable',
                'date',
                'required_without:preferred_date',
                $enforceFuturePreferredDates ? 'after_or_equal:today' : null,
            ])),
            'preferred_destinations' => ['required', 'string', 'max:50'],
            'other_requests' => ['nullable', 'string', 'max:100'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function messages(): array
    {
        return [
            'full_name.max' => 'Full name may not be greater than 20 characters.',
            'email.max' => 'Email may not be greater than 50 characters.',
            'email.email' => 'Enter a valid email address.',
            'phone.regex' => 'Enter a valid international phone number (for example +491771234567).',
            'passport_number.max' => 'Passport number may not be greater than 20 characters.',
            'country.max' => 'Country may not be greater than 15 characters.',
            'tourist_genders.required' => 'Select at least one tourist gender.',
            'tour_type.in' => 'Choose Group or Individual.',
            'guide_preference.in' => 'Choose a guide preference.',
            'preferred_date.required_without' => 'Provide a preferred date range or an alternative date.',
            'alternative_date.required_without' => 'Provide a preferred date range or an alternative date.',
            'preferred_date_end.required_with' => 'Provide the preferred end date.',
            'preferred_date_end.after_or_equal' => 'The preferred end date must be on or after the start date.',
            'preferred_destinations.max' => 'Destinations may not be greater than 50 characters.',
            'other_requests.max' => 'Special requirements may not be greater than 100 characters.',
            'number_of_tourists.min' => 'Number of tourists must be between 1 and 100.',
            'number_of_tourists.max' => 'Number of tourists must be between 1 and 100.',
            'package_title.required_if' => 'Seasonal package title is required.',
        ];
    }

    /**
     * @param  array<string, mixed>  $input
     * @return array<string, mixed>
     */
    public static function prepare(array $input): array
    {
        if (array_key_exists('number_of_tourists', $input) && $input['number_of_tourists'] !== null && $input['number_of_tourists'] !== '') {
            $input['number_of_tourists'] = (int) $input['number_of_tourists'];
        }

        if (! empty($input['phone']) && is_string($input['phone'])) {
            $input['phone'] = preg_replace('/[\s\-().]/', '', $input['phone']) ?? $input['phone'];
        }

        foreach (['preferred_date', 'preferred_date_end', 'alternative_date', 'other_requests', 'package_price', 'package_title', 'request_kind'] as $field) {
            if (array_key_exists($field, $input) && $input[$field] === '') {
                $input[$field] = null;
            }
        }

        $requestKind = $input['request_kind'] ?? null;

        if ($requestKind === CustomBookingRequestKind::SeasonalPackage->value) {
            // Keep package metadata as submitted.
        } elseif ($requestKind === CustomBookingRequestKind::CustomTour->value) {
            $input['package_title'] = null;
            $input['package_price'] = null;
        } else {
            unset($input['request_kind'], $input['package_title'], $input['package_price']);
        }

        if (! empty($input['preferred_date']) && empty($input['preferred_date_end'])) {
            $input['preferred_date_end'] = $input['preferred_date'];
        }

        return $input;
    }
}
