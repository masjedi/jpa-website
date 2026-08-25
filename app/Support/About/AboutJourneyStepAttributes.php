<?php

namespace App\Support\About;

use App\Enums\AboutJourneyStepStatus;

class AboutJourneyStepAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated): array
    {
        return [
            'status' => AboutJourneyStepStatus::fromFrontend((string) $validated['status']),
            'title' => (string) $validated['title'],
            'description' => (string) $validated['description'],
            'image_alt' => (string) $validated['image_alt'],
            'icon_key' => (string) $validated['icon_key'],
        ];
    }
}
