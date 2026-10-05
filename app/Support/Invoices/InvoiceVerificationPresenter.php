<?php

namespace App\Support\Invoices;

use App\Models\Invoice;
use App\Support\Brand;

class InvoiceVerificationPresenter
{
    /**
     * @return array<string, mixed>
     */
    public static function forPublicPage(Invoice $invoice): array
    {
        $currency = (string) $invoice->currency;
        $isActive = InvoiceVerification::isActive($invoice);

        return [
            'state' => $isActive ? 'confirmed' : 'expired',
            'invoiceNumber' => (string) $invoice->number,
            'clientName' => (string) $invoice->client_name,
            'tourReference' => (string) ($invoice->tour_reference ?? ''),
            'issuedLabel' => $invoice->issued_on?->format('d M Y') ?? '',
            'expiresLabel' => $invoice->verification_expires_at?->timezone(config('app.timezone'))->format('d M Y') ?? '',
            'status' => $invoice->status->frontendLabel(),
            'amount' => InvoicePresenter::formatAmount((string) $invoice->amount, $currency),
            'currency' => $currency,
            'brandName' => Brand::appName(),
        ];
    }
}
