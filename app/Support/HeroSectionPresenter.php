<?php

namespace App\Support;

use App\Models\HeroSection;
use App\Models\HeroSlide;

class HeroSectionPresenter
{
    /**
     * @return array{eyebrow: string, slides: list<array{id: int, title: string, subtitle: string, imageUrl: string|null, imageMediumUrl: string|null, imageUltraUrl: string|null}>}
     */
    public static function forPublicHome(HeroSection $section): array
    {
        return [
            'eyebrow' => Translatable::resolve($section->eyebrow),
            'slides' => $section->slides
                ->map(fn (HeroSlide $slide): array => self::publicSlidePayload($slide))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array{eyebrow: array<string, string>, slides: list<array{id: int, title: array<string, string>, subtitle: array<string, string>, status: string, order: int, updated: string, imageUrl: string|null, imageThumbUrl: string|null}>}
     */
    public static function forAdmin(HeroSection $section): array
    {
        return [
            'eyebrow' => Translatable::normalize($section->eyebrow),
            'slides' => $section->slides
                ->map(fn (HeroSlide $slide): array => self::adminSlidePayload($slide))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array{id: int, title: string, subtitle: string, imageUrl: string|null, imageMediumUrl: string|null, imageUltraUrl: string|null}
     */
    public static function publicSlidePayload(HeroSlide $slide): array
    {
        $asset = $slide->imageAsset();

        return [
            'id' => $slide->id,
            'title' => Translatable::resolve($slide->title),
            'subtitle' => Translatable::resolve($slide->subtitle),
            'imageUrl' => $asset?->heroUrl(),
            'imageMediumUrl' => $asset?->url('hero_md') ?? $asset?->url('thumb'),
            'imageUltraUrl' => $asset?->url('hero_ultra'),
        ];
    }

    /**
     * @return array{id: int, title: array<string, string>, subtitle: array<string, string>, status: string, order: int, updated: string, imageUrl: string|null, imageThumbUrl: string|null}
     */
    public static function adminSlidePayload(HeroSlide $slide): array
    {
        $asset = $slide->imageAsset();

        return [
            'id' => $slide->id,
            'title' => Translatable::normalize($slide->title),
            'subtitle' => Translatable::normalize($slide->subtitle),
            'status' => $slide->status->frontendLabel(),
            'order' => $slide->sort_order,
            'updated' => $slide->updated_at?->diffForHumans() ?? 'Just now',
            'imageUrl' => $asset?->heroUrl(),
            'imageThumbUrl' => $asset?->url('thumb') ?? $asset?->url('hero_md'),
        ];
    }
}
