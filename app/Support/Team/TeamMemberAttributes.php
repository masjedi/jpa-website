<?php

namespace App\Support\Team;

use App\Enums\TeamMemberStatus;
use App\Support\Translatable;

class TeamMemberAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated): array
    {
        return [
            'status' => TeamMemberStatus::fromFrontend((string) $validated['status']),
            'name' => Translatable::sanitize($validated['name']),
            'role' => Translatable::sanitize($validated['role']),
            'bio' => Translatable::sanitize($validated['bio']),
            'email' => trim((string) $validated['email']),
            'whatsapp' => trim((string) $validated['whatsapp']),
            'whatsapp_href' => trim((string) $validated['whatsapp_href']),
        ];
    }
}
