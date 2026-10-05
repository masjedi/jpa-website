<?php

namespace App\Support\About;

use App\Models\AboutJourneyStep;
use App\Models\AboutPage;
use App\Support\Media\AboutJourneyImage;
use App\Support\Translatable;

class AboutPagePresenter
{
    /**
     * @return array<string, mixed>
     */
    public static function forAdmin(): array
    {
        $page = AboutPage::current();

        return [
            'content' => self::contentPayload($page, forAdmin: true),
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
    public static function contentPayload(AboutPage $page, bool $forAdmin = false): array
    {
        $resolve = $forAdmin
            ? static fn (mixed $value): mixed => Translatable::normalize($value)
            : static fn (mixed $value): string => Translatable::resolve($value);

        return [
            'intro' => [
                'eyebrow' => $resolve($page->intro_eyebrow),
                'title' => $resolve($page->intro_title),
                'description' => $resolve($page->intro_description),
            ],
            'missionSection' => [
                'eyebrow' => $resolve($page->mission_section_eyebrow),
                'title' => $resolve($page->mission_section_title),
            ],
            'missionVision' => [
                'mission' => [
                    'title' => $resolve($page->mission_title),
                    'description' => $resolve($page->mission_description),
                ],
                'vision' => [
                    'title' => $resolve($page->vision_title),
                    'description' => $resolve($page->vision_description),
                ],
            ],
            'cta' => [
                'eyebrow' => $resolve($page->cta_eyebrow),
                'title' => $resolve($page->cta_title),
                'description' => $resolve($page->cta_description),
                'primaryLabel' => $resolve($page->cta_primary_label),
                'primaryHref' => (string) $page->cta_primary_href,
                'secondaryLabel' => $resolve($page->cta_secondary_label),
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
            'intro_eyebrow' => Translatable::sanitize($validated['intro_eyebrow']),
            'intro_title' => Translatable::sanitize($validated['intro_title']),
            'intro_description' => Translatable::sanitize($validated['intro_description']),
            'mission_section_eyebrow' => Translatable::sanitize($validated['mission_section_eyebrow']),
            'mission_section_title' => Translatable::sanitize($validated['mission_section_title']),
            'mission_title' => Translatable::sanitize($validated['mission_title']),
            'mission_description' => Translatable::sanitize($validated['mission_description']),
            'vision_title' => Translatable::sanitize($validated['vision_title']),
            'vision_description' => Translatable::sanitize($validated['vision_description']),
            'cta_eyebrow' => Translatable::sanitize($validated['cta_eyebrow']),
            'cta_title' => Translatable::sanitize($validated['cta_title']),
            'cta_description' => Translatable::sanitize($validated['cta_description']),
            'cta_primary_label' => Translatable::sanitize($validated['cta_primary_label']),
            'cta_primary_href' => (string) $validated['cta_primary_href'],
            'cta_secondary_label' => Translatable::sanitize($validated['cta_secondary_label']),
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
            'title' => Translatable::normalize($step->title),
            'description' => Translatable::normalize($step->description),
            'image' => self::journeyImageUrl($step),
            'imageAlt' => Translatable::normalize($step->image_alt),
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
            'title' => Translatable::resolve($step->title),
            'description' => Translatable::resolve($step->description),
            'image' => self::journeyImageUrl($step),
            'imageAlt' => Translatable::resolve($step->image_alt),
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
