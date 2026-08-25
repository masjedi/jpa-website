<?php

namespace App\Support\About;

use App\Models\AboutJourneyStep;
use App\Models\AboutPage;
use App\Support\Media\AboutJourneyImage;

class AboutPagePresenter
{
    /**
     * @return array<string, mixed>
     */
    public static function forAdmin(): array
    {
        $page = AboutPage::current();

        return [
            'content' => self::contentPayload($page),
            'journeySteps' => AboutJourneyStep::query()
                ->ordered()
                ->get()
                ->map(fn (AboutJourneyStep $step): array => self::journeyStepAdminPayload($step))
                ->values()
                ->all(),
            'journeyImageSpec' => AboutJourneyImage::spec(),
            'iconOptions' => self::iconOptions(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function forPublic(): array
    {
        $page = AboutPage::current();

        return [
            'content' => self::contentPayload($page),
            'journeySteps' => AboutJourneyStep::query()
                ->published()
                ->ordered()
                ->get()
                ->map(fn (AboutJourneyStep $step): array => self::journeyStepPublicPayload($step))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function contentPayload(AboutPage $page): array
    {
        return [
            'intro' => [
                'eyebrow' => (string) $page->intro_eyebrow,
                'title' => (string) $page->intro_title,
                'description' => (string) $page->intro_description,
            ],
            'missionSection' => [
                'eyebrow' => (string) $page->mission_section_eyebrow,
                'title' => (string) $page->mission_section_title,
            ],
            'missionVision' => [
                'mission' => [
                    'title' => (string) $page->mission_title,
                    'description' => (string) $page->mission_description,
                ],
                'vision' => [
                    'title' => (string) $page->vision_title,
                    'description' => (string) $page->vision_description,
                ],
            ],
            'cta' => [
                'eyebrow' => (string) $page->cta_eyebrow,
                'title' => (string) $page->cta_title,
                'description' => (string) $page->cta_description,
                'primaryLabel' => (string) $page->cta_primary_label,
                'primaryHref' => (string) $page->cta_primary_href,
                'secondaryLabel' => (string) $page->cta_secondary_label,
                'secondaryHref' => (string) $page->cta_secondary_href,
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function contentAttributesFromValidated(array $validated): array
    {
        return [
            'intro_eyebrow' => (string) $validated['intro_eyebrow'],
            'intro_title' => (string) $validated['intro_title'],
            'intro_description' => (string) $validated['intro_description'],
            'mission_section_eyebrow' => (string) $validated['mission_section_eyebrow'],
            'mission_section_title' => (string) $validated['mission_section_title'],
            'mission_title' => (string) $validated['mission_title'],
            'mission_description' => (string) $validated['mission_description'],
            'vision_title' => (string) $validated['vision_title'],
            'vision_description' => (string) $validated['vision_description'],
            'cta_eyebrow' => (string) $validated['cta_eyebrow'],
            'cta_title' => (string) $validated['cta_title'],
            'cta_description' => (string) $validated['cta_description'],
            'cta_primary_label' => (string) $validated['cta_primary_label'],
            'cta_primary_href' => (string) $validated['cta_primary_href'],
            'cta_secondary_label' => (string) $validated['cta_secondary_label'],
            'cta_secondary_href' => (string) $validated['cta_secondary_href'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function journeyStepAdminPayload(AboutJourneyStep $step): array
    {
        return [
            'id' => $step->id,
            'title' => (string) $step->title,
            'description' => (string) $step->description,
            'image' => self::journeyImageUrl($step),
            'imageAlt' => (string) $step->image_alt,
            'iconKey' => (string) $step->icon_key,
            'order' => (int) $step->sort_order,
            'status' => $step->status->frontendLabel(),
            'updated' => $step->updated_at?->timezone(config('app.timezone'))->diffForHumans() ?? '',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function journeyStepPublicPayload(AboutJourneyStep $step): array
    {
        return [
            'id' => $step->id,
            'title' => (string) $step->title,
            'description' => (string) $step->description,
            'image' => self::journeyImageUrl($step),
            'imageAlt' => (string) $step->image_alt,
            'iconKey' => (string) $step->icon_key,
        ];
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function iconOptions(): array
    {
        return collect(AboutJourneyIcons::keys())
            ->map(fn (string $key): array => [
                'value' => $key,
                'label' => ucwords(str_replace('-', ' ', $key)),
            ])
            ->all();
    }

    private static function journeyImageUrl(AboutJourneyStep $step): string
    {
        return $step->imageAsset()?->cardUrl()
            ?? $step->imageAsset()?->detailUrl()
            ?? '';
    }
}
