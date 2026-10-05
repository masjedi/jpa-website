<?php

namespace App\Support\Booking;

use App\Enums\CustomBookingRequestKind;
use App\Enums\CustomBookingStatus;
use App\Jobs\ProcessCustomBookingSubmittedJob;
use App\Models\CustomBooking;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SubmitCustomBookingAction
{
    /**
     * @param  array<string, mixed>  $validated
     */
    public function handle(array $validated): CustomBookingConfirmation
    {
        $booking = DB::transaction(function () use ($validated): CustomBooking {
            $requestKind = CustomBookingRequestKind::tryFrom((string) ($validated['request_kind'] ?? ''))
                ?? CustomBookingRequestKind::CustomTour;
            $isSeasonalPackage = $requestKind === CustomBookingRequestKind::SeasonalPackage;

            $booking = CustomBooking::query()->create([
                'reference' => 'TMP-'.Str::ulid(),
                'status' => CustomBookingStatus::Submitted,
                'request_kind' => $requestKind,
                'package_title' => $isSeasonalPackage && filled($validated['package_title'] ?? null)
                    ? trim((string) $validated['package_title'])
                    : null,
                'package_price' => $isSeasonalPackage && filled($validated['package_price'] ?? null)
                    ? trim((string) $validated['package_price'])
                    : null,
                'full_name' => trim((string) $validated['full_name']),
                'email' => strtolower(trim((string) $validated['email'])),
                'phone' => trim((string) $validated['phone']),
                'passport_number' => trim((string) $validated['passport_number']),
                'country' => trim((string) $validated['country']),
                'tour_type' => (string) $validated['tour_type'],
                'number_of_tourists' => (int) $validated['number_of_tourists'],
                'tourist_genders' => array_values(array_unique($validated['tourist_genders'])),
                'guide_preference' => (string) $validated['guide_preference'],
                'preferred_date' => $validated['preferred_date'] ?? null,
                'preferred_date_end' => $validated['preferred_date_end'] ?? null,
                'alternative_date' => $validated['alternative_date'] ?? null,
                'preferred_destinations' => trim((string) $validated['preferred_destinations']),
                'other_requests' => filled($validated['other_requests'] ?? null)
                    ? trim((string) $validated['other_requests'])
                    : null,
            ]);

            $booking->update([
                'reference' => CustomBookingReference::forBooking($booking),
            ]);

            return $booking->fresh();
        });

        // Emails + admin notification run after commit via the database queue.
        ProcessCustomBookingSubmittedJob::dispatch($booking);

        return CustomBookingConfirmation::fromBooking($booking);
    }
}
