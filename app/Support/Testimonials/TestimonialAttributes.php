<?php

namespace App\Support\Testimonials;

use App\Enums\TestimonialStatus;

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
            'name' => (string) $validated['name'],
            'journey' => (string) $validated['journey'],
            'text' => (string) $validated['text'],
            'rating' => (int) $validated['rating'],
        ];
    }
}
