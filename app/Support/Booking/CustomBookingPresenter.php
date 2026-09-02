<?php

namespace App\Support\Booking;

use App\Enums\CustomBookingStatus;
use App\Models\CustomBooking;
use App\Support\Media\DocumentAttachment;
use Illuminate\Http\Request;

class CustomBookingPresenter
{
    /**
     * @return array<string, mixed>
     */
    public static function forAdminIndex(Request $request): array
    {
        $search = trim((string) $request->query('search', ''));
        $status = trim((string) $request->query('status', ''));
        $statusEnum = CustomBookingStatus::tryFrom($status);

        $bookings = CustomBooking::query()
            ->select([
                'id',
                'reference',
                'status',
                'start_date',
                'traveler_count',
                'created_at',
            ])
            ->with([
                'primaryTraveler:id,custom_booking_id,first_name,last_name,email',
            ])
            ->when($search !== '', function ($query) use ($search): void {
                $like = '%'.str_replace(['%', '_'], ['\\%', '\\_'], $search).'%';
                $query->where(function ($query) use ($like): void {
                    $query->where('reference', 'like', $like)
                        ->orWhereHas('primaryTraveler', function ($query) use ($like): void {
                            $query->where('first_name', 'like', $like)
                                ->orWhere('last_name', 'like', $like)
                                ->orWhere('email', 'like', $like);
                        });
                });
            })
            ->when($statusEnum instanceof CustomBookingStatus, fn ($query) => $query->where('status', $statusEnum))
            ->latestFirst()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (CustomBooking $booking): array => self::listPayload($booking));

        return [
            'bookings' => $bookings,
            'filters' => [
                'search' => $search,
                'status' => $statusEnum?->value ?? '',
            ],
            'statusOptions' => collect(CustomBookingStatus::cases())
                ->map(fn (CustomBookingStatus $status): array => [
                    'value' => $status->value,
                    'label' => $status->frontendLabel(),
                ])
                ->all(),
            'attachmentUpload' => DocumentAttachment::spec(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function forAdminShow(CustomBooking $booking): array
    {
        $booking->load([
            'primaryTraveler',
            'travelers',
            'documents',
            'attachments.uploadedBy:id,name',
            'destinations',
            'interests',
            'statusChanges.user:id,name',
        ]);

        return [
            'booking' => self::detailPayload($booking),
            'attachmentUpload' => DocumentAttachment::spec(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function listPayload(CustomBooking $booking): array
    {
        $primary = $booking->primaryTraveler;

        return [
            'id' => $booking->id,
            'reference' => (string) $booking->reference,
            'status' => $booking->status->frontendLabel(),
            'statusValue' => $booking->status->value,
            'travelerName' => $primary?->displayName() ?? 'Traveler',
            'email' => (string) ($primary?->email ?? ''),
            'preferredDate' => $booking->start_date?->format('j M Y') ?? 'To be decided',
            'travelerCount' => (int) $booking->traveler_count,
            'received' => $booking->created_at?->diffForHumans() ?? '',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function detailPayload(CustomBooking $booking): array
    {
        $next = $booking->status->next();

        return [
            ...self::listPayload($booking),
            'receivedAt' => $booking->created_at?->timezone(config('app.timezone'))->format('d M Y · H:i') ?? '',
            'adults' => (int) $booking->adults,
            'children' => (int) $booking->children,
            'groupType' => (string) ($booking->group_type ?? ''),
            'flexibility' => CustomBookingOptions::label('flexibility', (string) $booking->flexibility),
            'season' => (string) ($booking->season ?? ''),
            'durationDays' => (int) $booking->duration_days,
            'otherDestination' => (string) ($booking->other_destination ?? ''),
            'recommendDestinations' => (bool) $booking->recommend_destinations,
            'routePreference' => CustomBookingOptions::label('route', (string) $booking->route_preference),
            'destinations' => $booking->destinations->pluck('name')->values()->all(),
            'interests' => $booking->interests
                ->pluck('interest')
                ->map(fn (mixed $interest): string => CustomBookingOptions::label('interest', (string) $interest))
                ->values()
                ->all(),
            'visaStatus' => (string) $booking->visa_status,
            'insuranceStatus' => (string) $booking->insurance_status,
            'emergencyName' => (string) $booking->emergency_name,
            'emergencyRelationship' => (string) $booking->emergency_relationship,
            'emergencyPhone' => (string) $booking->emergency_phone,
            'dietary' => (string) $booking->dietary,
            'dietaryDetails' => (string) ($booking->dietary_details ?? ''),
            'medical' => (string) $booking->medical,
            'medicalDetails' => (string) ($booking->medical_details ?? ''),
            'contactMethod' => (string) $booking->contact_method,
            'specialRequests' => (string) ($booking->special_requests ?? ''),
            'accuracy' => (bool) $booking->accuracy,
            'terms' => (bool) $booking->terms,
            'privacy' => (bool) $booking->privacy,
            'marketing' => (bool) $booking->marketing,
            'wantsComplete' => (bool) $booking->wants_complete,
            'wantsGuide' => (bool) $booking->wants_guide,
            'guideGender' => $booking->wants_guide
                ? CustomBookingOptions::label('guide_gender', (string) ($booking->guide_gender ?? ''))
                : '',
            'wantsTransportation' => (bool) $booking->wants_transportation,
            'wantsAccommodation' => (bool) $booking->wants_accommodation,
            'wantsAirport' => (bool) $booking->wants_airport,
            'wantsDomestic' => (bool) $booking->wants_domestic,
            'guideLanguage' => (string) ($booking->guide_language ?? ''),
            'guideLanguageOther' => (string) ($booking->guide_language_other ?? ''),
            'guideRequest' => (string) ($booking->guide_request ?? ''),
            'vehicle' => (string) ($booking->vehicle ?? ''),
            'transportCoverage' => (string) ($booking->transport_coverage ?? ''),
            'transportNotes' => (string) ($booking->transport_notes ?? ''),
            'accommodationLevel' => (string) ($booking->accommodation_level ?? ''),
            'roomPreference' => (string) ($booking->room_preference ?? ''),
            'roomCount' => $booking->room_count,
            'accommodationNotes' => (string) ($booking->accommodation_notes ?? ''),
            'arrivalAssistance' => (string) ($booking->arrival_assistance ?? ''),
            'arrivalDetailsLater' => (bool) $booking->arrival_details_later,
            'arrivalAirport' => (string) ($booking->arrival_airport ?? ''),
            'arrivalDate' => $booking->arrival_date?->toDateString() ?? '',
            'arrivalTime' => (string) ($booking->arrival_time ?? ''),
            'arrivalFlight' => (string) ($booking->arrival_flight ?? ''),
            'departureAssistance' => (string) ($booking->departure_assistance ?? ''),
            'departureDetailsLater' => (bool) $booking->departure_details_later,
            'departureAirport' => (string) ($booking->departure_airport ?? ''),
            'departureDate' => $booking->departure_date?->toDateString() ?? '',
            'departureTime' => (string) ($booking->departure_time ?? ''),
            'departureFlight' => (string) ($booking->departure_flight ?? ''),
            'domesticPreference' => (string) ($booking->domestic_preference ?? ''),
            'travelers' => $booking->travelers->map(fn ($traveler): array => [
                'id' => $traveler->id,
                'isPrimary' => (bool) $traveler->is_primary,
                'name' => $traveler->displayName(),
                'dateOfBirth' => $traveler->date_of_birth?->format('j M Y') ?? '',
                'nationality' => (string) $traveler->nationality,
                'email' => (string) ($traveler->email ?? ''),
                'phone' => (string) ($traveler->phone ?? ''),
                'countryOfResidence' => (string) ($traveler->country_of_residence ?? ''),
            ])->values()->all(),
            'documents' => $booking->documents->map(fn ($document): array => [
                'issuingCountry' => (string) $document->issuing_country,
                'expiryDate' => $document->expiry_date?->format('j M Y') ?? '',
            ])->values()->all(),
            'attachments' => $booking->attachments->map(fn ($attachment): array => [
                'id' => $attachment->id,
                'name' => (string) $attachment->original_name,
                'sizeLabel' => self::fileSizeLabel((int) $attachment->size_bytes),
                'uploadedBy' => (string) ($attachment->uploadedBy?->name ?? 'Staff'),
                'uploadedAt' => $attachment->created_at?->timezone(config('app.timezone'))->format('d M Y · H:i') ?? '',
                'downloadUrl' => route('admin.bookings.attachments.download', [
                    'customBooking' => $booking,
                    'customBookingAttachment' => $attachment,
                ], false),
            ])->values()->all(),
            'history' => $booking->statusChanges->map(fn ($change): array => [
                'from' => $change->from_status?->frontendLabel(),
                'to' => $change->to_status->frontendLabel(),
                'by' => $change->user?->name ?? 'Public submission',
                'at' => $change->created_at?->timezone(config('app.timezone'))->format('d M Y · H:i') ?? '',
            ])->values()->all(),
            'nextStatus' => $next?->value,
            'nextStatusLabel' => $next?->frontendLabel(),
        ];
    }

    private static function fileSizeLabel(int $bytes): string
    {
        if ($bytes < 1024) {
            return $bytes.' B';
        }

        if ($bytes < 1024 * 1024) {
            return round($bytes / 1024).' KB';
        }

        return round($bytes / (1024 * 1024), 1).' MB';
    }
}
