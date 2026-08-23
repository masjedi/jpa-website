<?php

namespace App\Support;

use App\Models\HeroSection;
use App\Models\HeroSlide;

class HeroSectionPresenter
{
    /**
     * @return array{eyebrow: string, slides: list<array{id: int, title: string, subtitle: string}>}
     */
    public static function forPublicHome(HeroSection $section): array
    {
        return [
            'eyebrow' => $section->eyebrow,
            'slides' => $section->slides
                ->map(fn (HeroSlide $slide): array => self::publicSlidePayload($slide))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array{eyebrow: string, slides: list<array{id: int, title: string, subtitle: string, status: string, order: int, updated: string}>}
     */
    public static function forAdmin(HeroSection $section): array
    {
        return [
            'eyebrow' => $section->eyebrow,
            'slides' => $section->slides
                ->map(fn (HeroSlide $slide): array => self::adminSlidePayload($slide))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array{id: int, title: string, subtitle: string}
     */
    public static function publicSlidePayload(HeroSlide $slide): array
    {
        return [
            'id' => $slide->id,
            'title' => $slide->title,
            'subtitle' => $slide->subtitle,
        ];
    }

    /**
     * @return array{id: int, title: string, subtitle: string, status: string, order: int, updated: string}
     */
    public static function adminSlidePayload(HeroSlide $slide): array
    {
        return [
            'id' => $slide->id,
            'title' => $slide->title,
            'subtitle' => $slide->subtitle,
            'status' => $slide->status->frontendLabel(),
            'order' => $slide->sort_order,
            'updated' => $slide->updated_at?->diffForHumans() ?? 'Just now',
        ];
    }
}
