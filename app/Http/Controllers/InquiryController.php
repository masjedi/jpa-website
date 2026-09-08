<?php

namespace App\Http\Controllers;

use App\Enums\InquirySource;
use App\Enums\InquiryStatus;
use App\Http\Requests\StoreContactInquiryRequest;
use App\Http\Requests\StoreTourInquiryRequest;
use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;

class InquiryController extends Controller
{
    public function storeContact(StoreContactInquiryRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Inquiry::query()->create([
            'source' => InquirySource::Contact,
            'status' => InquiryStatus::New,
            'name' => trim((string) $validated['name']),
            'email' => mb_strtolower(trim((string) $validated['email'])),
            'subject' => trim((string) $validated['subject']),
            'message' => trim((string) $validated['message']),
            'read_at' => null,
        ]);

        return back()->with('success', 'Thank you for your message. We will be in touch shortly.');
    }

    public function storeTour(StoreTourInquiryRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Inquiry::query()->create([
            'source' => InquirySource::TourInquiry,
            'status' => InquiryStatus::New,
            'name' => trim((string) $validated['fullName']),
            'email' => mb_strtolower(trim((string) $validated['email'])),
            'subject' => trim((string) $validated['tourTitle']),
            'message' => filled($validated['notes'] ?? null) ? trim((string) $validated['notes']) : null,
            'phone' => filled($validated['whatsappOrPhone'] ?? null) ? trim((string) $validated['whatsappOrPhone']) : null,
            'nationality' => filled($validated['nationality'] ?? null) ? trim((string) $validated['nationality']) : null,
            'preferred_date' => filled($validated['preferredDate'] ?? null) ? trim((string) $validated['preferredDate']) : null,
            'traveler_count' => filled($validated['travelerCount'] ?? null) ? trim((string) $validated['travelerCount']) : null,
            'read_at' => null,
        ]);

        return back()->with('success', 'Thank you for your inquiry. Our team will reply with a tailored proposal.');
    }
}
