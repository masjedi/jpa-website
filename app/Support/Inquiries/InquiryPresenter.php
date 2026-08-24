<?php

namespace App\Support\Inquiries;

use App\Models\Inquiry;

class InquiryPresenter
{
    /**
     * @return array{inquiries: list<array<string, mixed>>}
     */
    public static function forAdminIndex(): array
    {
        return [
            'inquiries' => Inquiry::query()
                ->latestFirst()
                ->get()
                ->map(fn (Inquiry $inquiry): array => self::adminPayload($inquiry))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function adminPayload(Inquiry $inquiry): array
    {
        return [
            'id' => $inquiry->id,
            'name' => (string) $inquiry->name,
            'email' => (string) $inquiry->email,
            'tour' => (string) ($inquiry->subject ?: $inquiry->source->frontendLabel()),
            'status' => $inquiry->status->frontendLabel(),
            'source' => $inquiry->source->frontendLabel(),
            'received' => $inquiry->created_at?->diffForHumans() ?? '',
            'receivedAt' => $inquiry->created_at?->timezone(config('app.timezone'))->format('d M Y · H:i') ?? '',
            'message' => (string) ($inquiry->message ?? ''),
            'phone' => (string) ($inquiry->phone ?? ''),
            'nationality' => (string) ($inquiry->nationality ?? ''),
            'preferredDate' => (string) ($inquiry->preferred_date ?? ''),
            'travelerCount' => (string) ($inquiry->traveler_count ?? ''),
        ];
    }
}
