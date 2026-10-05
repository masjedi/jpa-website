<?php

namespace App\Support\Admin;

use App\Enums\AdminNotificationType;
use App\Models\AdminNotification;
use App\Models\NewsletterSubscription;

class AdminNotificationRecorder
{
    public static function forNewsletterSubscription(NewsletterSubscription $subscription): AdminNotification
    {
        return AdminNotification::query()->create([
            'type' => AdminNotificationType::NewsletterSubscription,
            'title' => 'New newsletter subscription',
            'description' => $subscription->email.' subscribed from '.$subscription->source->frontendLabel().'.',
            'href' => '/admin/subscriptions',
            'read_at' => null,
        ]);
    }
}
