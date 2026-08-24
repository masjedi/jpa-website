<?php

namespace App\Support\Faq;

use App\Models\FaqItem;

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
            'question' => (string) $item->question,
            'answer' => (string) $item->answer,
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
            'question' => (string) $item->question,
            'answer' => (string) $item->answer,
        ];
    }
}
