<?php

namespace App\Support\Testimonials;

use App\Models\Testimonial;
use App\Support\Media\TestimonialAvatarImage;
use App\Support\Translatable;

class TestimonialPresenter
{
    private const PLACEHOLDER_AVATAR = '/brand/logo-color-h.png';

    /**
     * @return array{testimonials: list<array<string, mixed>>, avatarSpec: array<string, mixed>}
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
            'avatarSpec' => TestimonialAvatarImage::spec(),
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
            'name' => Translatable::normalize($testimonial->name),
            'journey' => Translatable::normalize($testimonial->journey),
            'text' => Translatable::normalize($testimonial->text),
            'image' => self::avatarUrl($testimonial),
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
            'name' => Translatable::resolve($testimonial->name),
            'journey' => Translatable::resolve($testimonial->journey),
            'text' => Translatable::resolve($testimonial->text),
            'image' => self::avatarUrl($testimonial),
            'rating' => (int) $testimonial->rating,
        ];
    }

    public static function avatarUrl(Testimonial $testimonial): string
    {
        return $testimonial->avatarAsset()?->cardUrl()
            ?? self::PLACEHOLDER_AVATAR;
    }
}
