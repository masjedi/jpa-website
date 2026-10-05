<?php

namespace App\Support\Testimonials;

use App\Enums\TestimonialStatus;
use App\Support\Translatable;

class TestimonialAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated): array
    {
        return [
            'status' => TestimonialStatus::fromFrontend((string) $validated['status']),
            'name' => Translatable::sanitize($validated['name']),
            'journey' => Translatable::sanitize($validated['journey']),
            'text' => Translatable::sanitize($validated['text']),
            'rating' => (int) $validated['rating'],
        ];
    }
}
