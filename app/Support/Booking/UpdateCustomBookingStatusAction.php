<?php

namespace App\Support\Booking;

use App\Enums\CustomBookingStatus;
use App\Models\CustomBooking;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class UpdateCustomBookingStatusAction
{
    public function handle(CustomBooking $booking, CustomBookingStatus $status, ?User $user): CustomBooking
    {
        unset($user);

        if (! $booking->status->canTransitionTo($status)) {
            throw ValidationException::withMessages([
                'status' => 'This request cannot move to '.$status->frontendLabel().' from '.$booking->status->frontendLabel().'.',
            ]);
        }

        $booking->update([
            'status' => $status,
        ]);

        return $booking->refresh();
    }
}
