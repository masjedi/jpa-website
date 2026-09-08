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
        $guideLanguages = is_array($services['guideLanguages'] ?? null)
            ? array_values(array_filter(array_map(
                fn (mixed $language): string => trim((string) $language),
                $services['guideLanguages'],
            )))
            : [];
        $airportPickup = (string) ($services['airportPickup'] ?? '');

        $groupType = (string) ($travelers['groupType'] ?? '');
        $dietaries = is_array($requirements['dietary'] ?? null)
            ? array_values(array_unique(array_filter(array_map(
                fn (mixed $item): string => trim((string) $item),
                $requirements['dietary'],
            ))))
            : (filled($requirements['dietary'] ?? null) ? [trim((string) $requirements['dietary'])] : []);

        return [
            'adults' => $adults,
            'children' => $children,
            'traveler_count' => max(1, $adults + $children),
            'group_type' => $groupType !== '' ? $groupType : null,
            'start_date' => self::nullableString($trip['startDate'] ?? null),
            'end_date' => self::nullableString($trip['endDate'] ?? null),
            'flexibility' => (string) ($trip['flexibility'] ?? ''),
            'season' => self::nullableString($trip['season'] ?? null),
            'duration_days' => (int) ($trip['durationDays'] ?? 0),
            'other_destination' => self::nullableString($trip['otherDestination'] ?? null),
            'recommend_destinations' => (bool) ($trip['recommendDestinations'] ?? false)
                || (($trip['routePreference'] ?? '') === 'recommend'),
            'route_preference' => (string) ($trip['routePreference'] ?? ''),
            'visa_status' => (string) ($documents['visaStatus'] ?? ''),
            'insurance_status' => (string) ($documents['insuranceStatus'] ?? ''),
            'emergency_name' => (string) ($requirements['emergencyName'] ?? ''),
            'emergency_relationship' => (string) ($requirements['emergencyRelationship'] ?? ''),
            'emergency_phone' => (string) ($requirements['emergencyPhone'] ?? ''),
            'dietary' => $dietaries[0] ?? '',
            'dietary_options' => $dietaries,
            'dietary_details' => count(array_intersect($dietaries, ['allergy', 'other'])) > 0
                ? self::nullableString($requirements['dietaryDetails'] ?? null)
                : null,
            'medical' => (string) ($requirements['medical'] ?? ''),
            'medical_details' => null,
            'contact_method' => (string) ($requirements['contactMethod'] ?? ''),
            'special_requests' => null,
            'accuracy' => (bool) ($agreements['accuracy'] ?? false),
            'terms' => (bool) ($agreements['terms'] ?? false),
            'privacy' => (bool) ($agreements['privacy'] ?? false),
            'marketing' => (bool) ($agreements['marketing'] ?? false),
            'wants_complete' => false,
            'wants_guide' => true,
            'guide_count' => (int) ($services['guideCount'] ?? 0),
            'guide_gender' => self::nullableString($services['guideGender'] ?? null),
            'wants_transportation' => true,
            'wants_accommodation' => true,
            'wants_airport' => $airportPickup === 'yes',
            'wants_domestic' => true,
            'guide_language' => $guideLanguages[0] ?? null,
            'guide_languages' => $guideLanguages,
            'guide_language_other' => null,
            'guide_request' => null,
            'vehicle' => self::nullableString($services['vehicle'] ?? null),
            'transport_coverage' => self::nullableString($services['transportCoverage'] ?? null),
            'transport_notes' => null,
            'accommodation_level' => self::nullableString($services['accommodationLevel'] ?? null),
            'room_preference' => self::nullableString($services['roomPreference'] ?? null),
            'room_count' => (int) ($services['roomCount'] ?? 1),
            'accommodation_notes' => null,
            'arrival_assistance' => null,
            'arrival_details_later' => false,
            'arrival_airport' => null,
            'arrival_date' => null,
            'arrival_time' => null,
            'arrival_flight' => null,
            'departure_assistance' => null,
            'departure_details_later' => false,
            'departure_airport' => null,
            'departure_date' => null,
            'departure_time' => null,
            'departure_flight' => null,
            'domestic_preference' => self::nullableString($services['domesticPreference'] ?? null),
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
                'is_first_visit' => ($primary['isFirstVisit'] ?? '') === 'yes',
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
                'email' => filled($companion['email'] ?? null)
                    ? mb_strtolower(trim((string) $companion['email']))
                    : null,
                'phone' => filled($companion['phone'] ?? null) ? trim((string) $companion['phone']) : null,
                'country_of_residence' => filled($companion['countryOfResidence'] ?? null)
                    ? trim((string) $companion['countryOfResidence'])
                    : null,
                'is_first_visit' => ($companion['isFirstVisit'] ?? '') === 'yes',
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
            ->filter(fn (string $name): bool => $name !== '' && strcasecmp($name, CustomBookingOptions::OTHER_DESTINATION) !== 0)
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

    public static function inferredGroupType(int $adults, int $children): string
    {
        return ($adults + $children) > 1 ? 'group' : 'private';
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
