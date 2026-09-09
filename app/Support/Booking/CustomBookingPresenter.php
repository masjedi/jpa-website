<?php

namespace App\Support\Booking;

use App\Enums\CustomBookingRequestKind;
use App\Enums\CustomBookingStatus;
use App\Models\CustomBooking;
use Illuminate\Http\Request;

/**
 * @phpstan-type AdminBookingRow array<string, mixed>
 */
class CustomBookingPresenter
{
    /**
     * @return array<string, mixed>
     */
    public static function forAdminIndex(Request $request): array
    {
        $search = trim((string) $request->string('search'));
        $status = trim((string) $request->string('status'));

        $query = CustomBooking::query()->latest('created_at');

        if ($search !== '') {
            $query->search($search);
        }

        if ($status !== '') {
            $query->where('status', $status);
        }

        $bookings = $query
            ->paginate(20)
            ->withQueryString()
            ->through(fn (CustomBooking $booking): array => self::adminListRow($booking));

        return [
            'bookings' => $bookings,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'statusOptions' => collect(CustomBookingStatus::cases())
                ->map(fn (CustomBookingStatus $status): array => [
                    'value' => $status->value,
                    'label' => $status->frontendLabel(),
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function forAdminShow(CustomBooking $booking): array
    {
        return [
            'booking' => self::adminDetail($booking),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function adminListRow(CustomBooking $booking): array
    {
        $requestKind = $booking->request_kind instanceof CustomBookingRequestKind
            ? $booking->request_kind
            : CustomBookingRequestKind::tryFrom((string) $booking->request_kind)
                ?? CustomBookingRequestKind::CustomTour;
        $isSeasonalPackage = $requestKind->isSeasonalPackage();

        return [
            'id' => $booking->id,
            'reference' => $booking->reference,
            'status' => $booking->status instanceof CustomBookingStatus
                ? $booking->status->frontendLabel()
                : (string) $booking->status,
            'statusValue' => $booking->status instanceof CustomBookingStatus
                ? $booking->status->value
                : (string) $booking->status,
            'requestKind' => $requestKind->value,
            'requestKindLabel' => $requestKind->frontendLabel(),
            'isSeasonalPackage' => $isSeasonalPackage,
            'packageTitle' => (string) ($booking->package_title ?? ''),
            'packagePrice' => (string) ($booking->package_price ?? ''),
            'fullName' => $booking->full_name,
            'email' => $booking->email,
            'phone' => $booking->phone,
            'country' => $booking->country,
            'tourType' => self::tourTypeLabel($booking->tour_type),
            'numberOfTourists' => $booking->number_of_tourists,
            'preferredDate' => self::preferredDateLabel($booking),
            'preferredDateStart' => $booking->preferred_date?->toDateString() ?? '',
            'preferredDateEnd' => $booking->preferred_date_end?->toDateString()
                ?? $booking->preferred_date?->toDateString()
                ?? '',
            'preferredDestinations' => $booking->preferred_destinations,
            'submitted' => $booking->created_at?->toDateTimeString() ?? '',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function adminDetail(CustomBooking $booking): array
    {
        return [
            ...self::adminListRow($booking),
            'passportNumber' => $booking->passport_number,
            'touristGenders' => array_values($booking->tourist_genders ?? []),
            'touristGendersLabel' => collect($booking->tourist_genders ?? [])
                ->map(fn (mixed $gender): string => self::genderLabel((string) $gender))
                ->implode(', '),
            'guidePreference' => $booking->guide_preference,
            'guidePreferenceLabel' => self::guidePreferenceLabel($booking->guide_preference),
            'tourTypeValue' => $booking->tour_type,
            'alternativeDate' => $booking->alternative_date?->toDateString() ?? '',
            'otherRequests' => $booking->other_requests ?? '',
            'nextStatus' => $booking->status instanceof CustomBookingStatus
                ? $booking->status->next()?->value
                : null,
            'nextStatusLabel' => $booking->status instanceof CustomBookingStatus
                ? $booking->status->next()?->frontendLabel()
                : null,
        ];
    }

    public static function preferredDateLabel(CustomBooking $booking): string
    {
        $start = $booking->preferred_date;
        $end = $booking->preferred_date_end;

        if ($start === null) {
            return $booking->alternative_date
                ? 'Alt: '.$booking->alternative_date->format('j F Y')
                : '';
        }

        if ($end === null || $end->equalTo($start)) {
            return $start->format('j F Y');
        }

        return $start->format('j F Y').' – '.$end->format('j F Y');
    }

    public static function tourTypeLabel(string $value): string
    {
        return match ($value) {
            'group' => 'Group',
            'individual' => 'Individual',
            default => $value,
        };
    }

    public static function genderLabel(string $value): string
    {
        return match ($value) {
            'male' => 'Male',
            'female' => 'Female',
            default => $value,
        };
    }

    public static function guidePreferenceLabel(string $value): string
    {
        return match ($value) {
            'male' => 'Male',
            'female' => 'Female',
            'no_preference' => 'No Preference',
            default => $value,
        };
    }
}
