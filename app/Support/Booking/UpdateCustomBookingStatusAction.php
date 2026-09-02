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
        if (! $booking->status->canTransitionTo($status)) {
            throw ValidationException::withMessages([
                'status' => 'This request cannot move to '.$status->frontendLabel().' from '.$booking->status->frontendLabel().'.',
            ]);
        }

        $from = $booking->status;

        $booking->update([
            'status' => $status,
        ]);

        $booking->statusChanges()->create([
            'from_status' => $from,
            'to_status' => $status,
            'user_id' => $user?->id,
        ]);

        return $booking->refresh();
    }
}
