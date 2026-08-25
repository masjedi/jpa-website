<?php

namespace App\Support\Testimonials;

use App\Models\Testimonial;

class TestimonialPresenter
{
    /**
     * @return array{testimonials: list<array<string, mixed>>}
     */
    public static function forAdminIndex(): array
    {
        return [
            'testimonials' => Testimonial::query()
                ->ordered()
                ->get()
                ->map(fn (Testimonial $testimonial): array => self::adminPayload($testimonial))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function forPublicHome(): array
    {
        return Testimonial::query()
            ->published()
            ->ordered()
            ->get()
            ->map(fn (Testimonial $testimonial): array => self::publicPayload($testimonial))
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    public static function adminPayload(Testimonial $testimonial): array
    {
        return [
            'id' => $testimonial->id,
            'name' => (string) $testimonial->name,
            'journey' => (string) $testimonial->journey,
            'text' => (string) $testimonial->text,
            'rating' => (int) $testimonial->rating,
            'order' => (int) $testimonial->sort_order,
            'status' => $testimonial->status->frontendLabel(),
            'updated' => $testimonial->updated_at?->timezone(config('app.timezone'))->diffForHumans() ?? '',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicPayload(Testimonial $testimonial): array
    {
        return [
            'id' => $testimonial->id,
            'name' => (string) $testimonial->name,
            'journey' => (string) $testimonial->journey,
            'text' => (string) $testimonial->text,
            'rating' => (int) $testimonial->rating,
        ];
    }
}
