<?php

namespace App\Support\Booking;

use App\Models\CustomBooking;

final class CustomBookingReference
{
    public static function forBooking(CustomBooking $booking): string
    {
        $year = $booking->created_at?->year ?? now()->year;

        return sprintf('JTP-%d-%05d', $year, $booking->id);
    }
}
