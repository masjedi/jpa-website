<?php

namespace App\Support\Admin;

use App\Enums\AdminNotificationType;
use App\Models\AdminNotification;
use App\Models\CustomBooking;
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

    public static function forCustomBooking(CustomBooking $booking): AdminNotification
    {
        $name = trim((string) ($booking->primaryTraveler?->displayName() ?? ''));

        return AdminNotification::query()->create([
            'type' => AdminNotificationType::CustomBooking,
            'title' => 'New custom tour request',
            'description' => ($name !== '' ? $name : 'A traveler').' submitted '.$booking->reference.'.',
            'href' => '/admin/bookings/'.$booking->id,
            'read_at' => null,
        ]);
    }
}
