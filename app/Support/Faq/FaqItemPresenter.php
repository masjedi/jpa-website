<?php

namespace App\Support\Faq;

use App\Models\FaqItem;
use App\Support\Translatable;

class FaqItemPresenter
{
    /**
     * @return array{items: list<array<string, mixed>>}
     */
    public static function forAdminIndex(): array
    {
        return [
            'items' => FaqItem::query()
                ->ordered()
                ->get()
                ->map(fn (FaqItem $item): array => self::adminPayload($item))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function forPublicHomePreview(): array
    {
        return FaqItem::query()
            ->published()
            ->ordered()
            ->get()
            ->map(fn (FaqItem $item): array => self::publicPayload($item))
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    public static function adminPayload(FaqItem $item): array
    {
        return [
            'id' => $item->id,
            'question' => Translatable::normalize($item->question),
            'answer' => Translatable::normalize($item->answer),
            'order' => (int) $item->sort_order,
            'status' => $item->status->frontendLabel(),
            'updated' => $item->updated_at?->timezone(config('app.timezone'))->diffForHumans() ?? '',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicPayload(FaqItem $item): array
    {
        return [
            'id' => $item->id,
            'question' => Translatable::resolve($item->question),
            'answer' => Translatable::resolve($item->answer),
        ];
    }
}
