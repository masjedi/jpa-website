<?php

namespace App\Support\Booking;

use App\Enums\CustomBookingStatus;
use App\Mail\CustomBookingRequestReceived;
use App\Mail\CustomBookingSubmittedForTeam;
use App\Models\CustomBooking;
use App\Support\Admin\AdminNotificationRecorder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class SubmitCustomBookingAction
{
    /**
     * @param  array<string, mixed>  $validated
     */
    public function handle(array $validated): CustomBookingConfirmation
    {
        $booking = DB::transaction(function () use ($validated): CustomBooking {
            $booking = CustomBooking::query()->create([
                ...CustomBookingAttributes::booking($validated),
                'reference' => 'TMP-'.Str::ulid(),
                'status' => CustomBookingStatus::Submitted,
            ]);

            $booking->update([
                'reference' => CustomBookingReference::forBooking($booking),
            ]);

            $travelers = $booking->travelers()->createMany(CustomBookingAttributes::travelers($validated));

            $documents = [];
            foreach (CustomBookingAttributes::documents($validated) as $index => $document) {
                $documents[] = [
                    ...$document,
                    'sort_order' => $index,
                    'custom_booking_traveler_id' => $travelers[$index]->id ?? null,
                ];
            }

            if ($documents !== []) {
                $booking->documents()->createMany($documents);
            }

            $destinationNames = CustomBookingAttributes::destinationNames($validated);
            $destinationIds = CustomBookingCatalog::publishedDestinationIdsByName($destinationNames);

            $destinations = [];
            foreach ($destinationNames as $name) {
                $destinations[] = [
                    'name' => $name,
                    'destination_id' => $destinationIds[mb_strtolower($name)] ?? null,
                ];
            }

            if ($destinations !== []) {
                $booking->destinations()->createMany($destinations);
            }

            $interests = [];
            foreach (CustomBookingAttributes::interests($validated) as $interest) {
                $interests[] = [
                    'interest' => $interest,
                ];
            }

            if ($interests !== []) {
                $booking->interests()->createMany($interests);
            }

            $booking->statusChanges()->create([
                'from_status' => null,
                'to_status' => CustomBookingStatus::Submitted,
                'user_id' => null,
            ]);

            return $booking->load([
                'primaryTraveler',
                'destinations',
                'interests',
            ]);
        });

        $confirmation = CustomBookingConfirmation::fromBooking($booking);

        AdminNotificationRecorder::forCustomBooking($booking);

        // Queue SMTP work so the visitor gets the success response immediately.
        Mail::queue(new CustomBookingRequestReceived($booking));
        Mail::queue(new CustomBookingSubmittedForTeam($booking));

        return $confirmation;
    }
}
