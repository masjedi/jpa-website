<?php

namespace App\Support\About;

use App\Enums\AboutJourneyStepStatus;
use App\Support\Translatable;

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
            'title' => Translatable::sanitize($validated['title']),
            'description' => Translatable::sanitize($validated['description']),
            'image_alt' => Translatable::sanitize($validated['image_alt']),
            'icon_key' => (string) $validated['icon_key'],
        ];
    }
}
