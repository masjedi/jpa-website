<?php

namespace App\Support\Team;

use App\Enums\TeamMemberStatus;

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
            'name' => trim((string) $validated['name']),
            'role' => trim((string) $validated['role']),
            'bio' => trim((string) $validated['bio']),
            'email' => trim((string) $validated['email']),
            'whatsapp' => trim((string) $validated['whatsapp']),
            'whatsapp_href' => trim((string) $validated['whatsapp_href']),
        ];
    }
}
