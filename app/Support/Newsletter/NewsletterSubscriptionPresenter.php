<?php

namespace App\Support\Newsletter;

use App\Models\NewsletterSubscription;

class NewsletterSubscriptionPresenter
{
    /**
     * @return array{subscriptions: list<array<string, mixed>>}
     */
    public static function forAdminIndex(): array
    {
        return [
            'subscriptions' => NewsletterSubscription::query()
                ->latestFirst()
                ->get()
                ->map(fn (NewsletterSubscription $subscription): array => self::adminPayload($subscription))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function adminPayload(NewsletterSubscription $subscription): array
    {
        return [
            'id' => $subscription->id,
            'email' => (string) $subscription->email,
            'source' => $subscription->source->frontendLabel(),
            'status' => $subscription->status->frontendLabel(),
            'subscribed' => $subscription->created_at?->diffForHumans() ?? '',
        ];
    }
}
