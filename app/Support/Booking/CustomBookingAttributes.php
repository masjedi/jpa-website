<?php

namespace App\Support\Booking;

final class CustomBookingAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function booking(array $validated): array
    {
        $trip = is_array($validated['trip'] ?? null) ? $validated['trip'] : [];
        $travelers = is_array($validated['travelers'] ?? null) ? $validated['travelers'] : [];
        $services = is_array($validated['services'] ?? null) ? $validated['services'] : [];
        $documents = is_array($validated['documents'] ?? null) ? $validated['documents'] : [];
        $requirements = is_array($validated['requirements'] ?? null) ? $validated['requirements'] : [];
        $agreements = is_array($validated['agreements'] ?? null) ? $validated['agreements'] : [];

        $adults = (int) ($travelers['adults'] ?? 1);
        $children = (int) ($travelers['children'] ?? 0);
        $guide = (bool) ($services['guide'] ?? false);
        $transportation = (bool) ($services['transportation'] ?? false);
        $accommodation = (bool) ($services['accommodation'] ?? false);
        $airport = (bool) ($services['airport'] ?? false);
        $domestic = (bool) ($services['domestic'] ?? false);
        $arrivalLater = (bool) ($services['arrivalDetailsLater'] ?? false);
        $departureLater = (bool) ($services['departureDetailsLater'] ?? false);

        $groupType = (string) ($travelers['groupType'] ?? '');
        if ($groupType === '') {
            $groupType = self::inferredGroupType($adults, $children) ?? '';
        }

        return [
            'adults' => $adults,
            'children' => $children,
            'traveler_count' => max(1, $adults + $children),
            'group_type' => $groupType !== '' ? $groupType : null,
            'start_date' => self::nullableString($trip['startDate'] ?? null),
            'flexibility' => (string) ($trip['flexibility'] ?? ''),
            'season' => self::nullableString($trip['season'] ?? null),
            'duration_days' => (int) ($trip['durationDays'] ?? 1),
            'other_destination' => self::nullableString($trip['otherDestination'] ?? null),
            'recommend_destinations' => (bool) ($trip['recommendDestinations'] ?? false)
                || (($trip['routePreference'] ?? '') === 'recommend'),
            'route_preference' => (string) ($trip['routePreference'] ?? ''),
            'visa_status' => (string) ($documents['visaStatus'] ?? ''),
            'insurance_status' => (string) ($documents['insuranceStatus'] ?? ''),
            'emergency_name' => (string) ($requirements['emergencyName'] ?? ''),
            'emergency_relationship' => (string) ($requirements['emergencyRelationship'] ?? ''),
            'emergency_phone' => (string) ($requirements['emergencyPhone'] ?? ''),
            'dietary' => (string) ($requirements['dietary'] ?? ''),
            'dietary_details' => in_array($requirements['dietary'] ?? '', ['allergy', 'other'], true)
                ? self::nullableString($requirements['dietaryDetails'] ?? null)
                : null,
            'medical' => (string) ($requirements['medical'] ?? ''),
            'medical_details' => ($requirements['medical'] ?? '') === 'yes'
                ? self::nullableString($requirements['medicalDetails'] ?? null)
                : null,
            'contact_method' => (string) ($requirements['contactMethod'] ?? ''),
            'special_requests' => self::nullableString($requirements['specialRequests'] ?? null),
            'accuracy' => (bool) ($agreements['accuracy'] ?? false),
            'terms' => (bool) ($agreements['terms'] ?? false),
            'privacy' => (bool) ($agreements['privacy'] ?? false),
            'marketing' => (bool) ($agreements['marketing'] ?? false),
            'wants_complete' => (bool) ($services['complete'] ?? false),
            'wants_guide' => $guide,
            'guide_gender' => $guide ? self::nullableString($services['guideGender'] ?? null) : null,
            'wants_transportation' => $transportation,
            'wants_accommodation' => $accommodation,
            'wants_airport' => $airport,
            'wants_domestic' => $domestic,
            'guide_language' => $guide ? self::nullableString($services['guideLanguage'] ?? null) : null,
            'guide_language_other' => $guide && ($services['guideLanguage'] ?? '') === 'other'
                ? self::nullableString($services['guideLanguageOther'] ?? null)
                : null,
            'guide_request' => $guide ? self::nullableString($services['guideRequest'] ?? null) : null,
            'vehicle' => $transportation ? self::nullableString($services['vehicle'] ?? null) : null,
            'transport_coverage' => $transportation ? self::nullableString($services['transportCoverage'] ?? null) : null,
            'transport_notes' => $transportation && ($services['transportCoverage'] ?? '') === 'selected'
                ? self::nullableString($services['transportNotes'] ?? null)
                : null,
            'accommodation_level' => $accommodation ? self::nullableString($services['accommodationLevel'] ?? null) : null,
            'room_preference' => $accommodation ? self::nullableString($services['roomPreference'] ?? null) : null,
            'room_count' => $accommodation ? (int) ($services['roomCount'] ?? 1) : null,
            'accommodation_notes' => $accommodation ? self::nullableString($services['accommodationNotes'] ?? null) : null,
            'arrival_assistance' => $airport ? self::nullableString($services['arrivalAssistance'] ?? null) : null,
            'arrival_details_later' => $airport && $arrivalLater,
            'arrival_airport' => $airport && ($services['arrivalAssistance'] ?? '') === 'yes' && ! $arrivalLater
                ? self::nullableString($services['arrivalAirport'] ?? null)
                : null,
            'arrival_date' => $airport && ($services['arrivalAssistance'] ?? '') === 'yes' && ! $arrivalLater
                ? self::nullableString($services['arrivalDate'] ?? null)
                : null,
            'arrival_time' => $airport && ($services['arrivalAssistance'] ?? '') === 'yes' && ! $arrivalLater
                ? self::nullableString($services['arrivalTime'] ?? null)
                : null,
            'arrival_flight' => $airport && ($services['arrivalAssistance'] ?? '') === 'yes' && ! $arrivalLater
                ? self::nullableString($services['arrivalFlight'] ?? null)
                : null,
            'departure_assistance' => $airport ? self::nullableString($services['departureAssistance'] ?? null) : null,
            'departure_details_later' => $airport && $departureLater,
            'departure_airport' => $airport && ($services['departureAssistance'] ?? '') === 'yes' && ! $departureLater
                ? self::nullableString($services['departureAirport'] ?? null)
                : null,
            'departure_date' => $airport && ($services['departureAssistance'] ?? '') === 'yes' && ! $departureLater
                ? self::nullableString($services['departureDate'] ?? null)
                : null,
            'departure_time' => $airport && ($services['departureAssistance'] ?? '') === 'yes' && ! $departureLater
                ? self::nullableString($services['departureTime'] ?? null)
                : null,
            'departure_flight' => $airport && ($services['departureAssistance'] ?? '') === 'yes' && ! $departureLater
                ? self::nullableString($services['departureFlight'] ?? null)
                : null,
            'domestic_preference' => $domestic ? self::nullableString($services['domesticPreference'] ?? null) : null,
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return list<array<string, mixed>>
     */
    public static function travelers(array $validated): array
    {
        $travelers = is_array($validated['travelers'] ?? null) ? $validated['travelers'] : [];
        $primary = is_array($travelers['primary'] ?? null) ? $travelers['primary'] : [];
        $companions = is_array($travelers['companions'] ?? null) ? $travelers['companions'] : [];
        $rows = [
            [
                'sort_order' => 0,
                'is_primary' => true,
                'first_name' => trim((string) ($primary['firstName'] ?? '')),
                'last_name' => trim((string) ($primary['lastName'] ?? '')),
                'date_of_birth' => $primary['dateOfBirth'] ?? null,
                'nationality' => trim((string) ($primary['nationality'] ?? '')),
                'email' => mb_strtolower(trim((string) ($primary['email'] ?? ''))),
                'phone' => trim((string) ($primary['phone'] ?? '')),
                'country_of_residence' => trim((string) ($primary['countryOfResidence'] ?? '')),
            ],
        ];

        foreach (array_values($companions) as $index => $companion) {
            if (! is_array($companion)) {
                continue;
            }

            $rows[] = [
                'sort_order' => $index + 1,
                'is_primary' => false,
                'first_name' => trim((string) ($companion['firstName'] ?? '')),
                'last_name' => trim((string) ($companion['lastName'] ?? '')),
                'date_of_birth' => $companion['dateOfBirth'] ?? null,
                'nationality' => trim((string) ($companion['nationality'] ?? '')),
                'email' => null,
                'phone' => null,
                'country_of_residence' => null,
            ];
        }

        return $rows;
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return list<array{issuing_country: string, expiry_date: mixed}>
     */
    public static function documents(array $validated): array
    {
        $documents = is_array($validated['documents'] ?? null) ? $validated['documents'] : [];
        $passports = is_array($documents['passports'] ?? null) ? $documents['passports'] : [];
        $travelers = is_array($validated['travelers'] ?? null) ? $validated['travelers'] : [];
        $total = max(1, (int) ($travelers['adults'] ?? 1) + (int) ($travelers['children'] ?? 0));

        $rows = [];

        foreach (array_slice(array_values($passports), 0, $total) as $passport) {
            if (! is_array($passport)) {
                continue;
            }

            $rows[] = [
                'issuing_country' => trim((string) ($passport['issuingCountry'] ?? '')),
                'expiry_date' => $passport['expiryDate'] ?? null,
            ];
        }

        return $rows;
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return list<string>
     */
    public static function destinationNames(array $validated): array
    {
        $trip = is_array($validated['trip'] ?? null) ? $validated['trip'] : [];
        $names = is_array($trip['destinations'] ?? null) ? $trip['destinations'] : [];

        return collect($names)
            ->map(fn (mixed $name): string => trim((string) $name))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return list<string>
     */
    public static function interests(array $validated): array
    {
        $trip = is_array($validated['trip'] ?? null) ? $validated['trip'] : [];
        $interests = is_array($trip['interests'] ?? null) ? $trip['interests'] : [];

        return collect($interests)
            ->map(fn (mixed $interest): string => (string) $interest)
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    public static function inferredGroupType(int $adults, int $children): ?string
    {
        if ($children > 0) {
            return 'family';
        }

        if ($adults === 1) {
            return 'solo';
        }

        if ($adults === 2) {
            return 'couple';
        }

        return null;
    }

    private static function nullableString(mixed $value): ?string
    {
        if (! is_string($value)) {
            return $value === null ? null : (string) $value;
        }

        $trimmed = trim($value);

        return $trimmed === '' ? null : $trimmed;
    }
}
