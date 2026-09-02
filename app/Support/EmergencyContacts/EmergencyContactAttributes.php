<?php

namespace App\Support\EmergencyContacts;

use App\Enums\EmergencyType;

final class EmergencyContactAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated): array
    {
        $status = (string) $validated['status'];

        return [
            'province_id' => (int) $validated['province_id'],
            'full_name' => trim((string) $validated['full_name']),
            'position' => trim((string) $validated['position']),
            'organization' => trim((string) $validated['organization']),
            'emergency_type' => EmergencyType::fromFrontend((string) $validated['emergency_type']),
            'primary_phone' => trim((string) $validated['primary_phone']),
            'secondary_phone' => self::nullableString($validated['secondary_phone'] ?? null),
            'whatsapp' => self::nullableString($validated['whatsapp'] ?? null),
            'availability_notes' => self::nullableString($validated['availability_notes'] ?? null),
            'last_verified_at' => (string) $validated['last_verified_at'],
            'is_customer_shareable' => (bool) ($validated['is_customer_shareable'] ?? false),
            'is_active' => $status === EmergencyContactOptions::STATUS_ACTIVE,
            'internal_notes' => self::nullableString($validated['internal_notes'] ?? null),
        ];
    }

    private static function nullableString(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $trimmed = trim((string) $value);

        return $trimmed === '' ? null : $trimmed;
    }
}
