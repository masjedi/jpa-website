<?php

namespace App\Http\Controllers;

use App\Enums\NewsletterSubscriptionStatus;
use App\Http\Requests\StoreNewsletterSubscriptionRequest;
use App\Models\NewsletterSubscription;
use App\Support\Admin\AdminNotificationRecorder;
use Illuminate\Http\RedirectResponse;

class NewsletterSubscriptionController extends Controller
{
    public function store(StoreNewsletterSubscriptionRequest $request): RedirectResponse
    {
        $email = $request->normalizedEmail();
        $source = $request->source();

        $subscription = NewsletterSubscription::query()->where('email', $email)->first();
        $shouldNotify = false;

        if ($subscription === null) {
            $subscription = NewsletterSubscription::query()->create([
                'email' => $email,
                'source' => $source,
                'status' => NewsletterSubscriptionStatus::Active,
            ]);
            $shouldNotify = true;
        } elseif ($subscription->status === NewsletterSubscriptionStatus::Unsubscribed) {
            $subscription->update([
                'source' => $source,
                'status' => NewsletterSubscriptionStatus::Active,
            ]);
            $shouldNotify = true;
        }

        if ($shouldNotify) {
            AdminNotificationRecorder::forNewsletterSubscription($subscription->fresh());
        }

        return back()->with('success', 'Thank you for subscribing to our travel notes.');
    }
}
