<?php

namespace App\Support\Invoices;

use App\Models\Invoice;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class InvoiceVerification
{
    public const ACTIVE_DAYS = 30;

    /**
     * @return array{verification_token: string, verification_expires_at: Carbon}
     */
    public static function credentialsForIssueDate(Carbon|string $issuedOn): array
    {
        $issuedAt = Carbon::parse($issuedOn)->startOfDay();

        return [
            'verification_token' => Str::lower(Str::random(48)),
            'verification_expires_at' => $issuedAt->copy()->addDays(self::ACTIVE_DAYS)->endOfDay(),
        ];
    }

    public static function ensureCredentials(Invoice $invoice): Invoice
    {
        if (filled($invoice->verification_token) && $invoice->verification_expires_at !== null) {
            return $invoice;
        }

        $credentials = self::credentialsForIssueDate($invoice->issued_on ?? now());

        $invoice->forceFill($credentials)->save();

        return $invoice->refresh();
    }

    public static function syncExpiryFromIssueDate(Invoice $invoice): void
    {
        if ($invoice->issued_on === null) {
            return;
        }

        $invoice->forceFill([
            'verification_expires_at' => Carbon::parse($invoice->issued_on)
                ->startOfDay()
                ->addDays(self::ACTIVE_DAYS)
                ->endOfDay(),
        ])->save();
    }

    public static function isActive(Invoice $invoice): bool
    {
        return filled($invoice->verification_token)
            && $invoice->verification_expires_at !== null
            && now()->lte($invoice->verification_expires_at);
    }

    public static function verificationUrl(Invoice $invoice): ?string
    {
        if (! filled($invoice->verification_token)) {
            return null;
        }

        return route('invoices.verify', ['token' => $invoice->verification_token], absolute: true);
    }
}
