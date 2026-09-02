<?php

namespace App\Enums;

enum AdminNotificationType: string
{
    case NewsletterSubscription = 'newsletter_subscription';
    case CustomBooking = 'custom_booking';
}
