<?php

namespace App\Support\Invoices;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;

class InvoicePresenter
{
    /**
     * @return array{invoices: list<array<string, mixed>>}
     */
    public static function forAdminIndex(): array
    {
        return [
            'invoices' => Invoice::query()
                ->latestFirst()
                ->get()
                ->map(fn (Invoice $invoice): array => self::adminPayload($invoice))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function adminPayload(Invoice $invoice): array
    {
        $invoice = InvoiceVerification::ensureCredentials($invoice);

        $lineItems = is_array($invoice->line_items) ? $invoice->line_items : [];
        $discountPercent = (float) ($invoice->discount_percent ?? 0);
        $totals = InvoiceTotalsCalculator::calculate($lineItems, $discountPercent);
        $currency = (string) $invoice->currency;

        return [
            'id' => $invoice->id,
            'number' => (string) $invoice->number,
            'client' => (string) $invoice->client_name,
            'clientEmail' => (string) $invoice->client_email,
            'clientAddress' => (string) ($invoice->client_address ?? ''),
            'tour' => (string) ($invoice->tour_reference ?? ''),
            'amount' => self::formatAmount((string) $invoice->amount, $currency),
            'amountValue' => (string) $invoice->amount,
            'currency' => $currency,
            'status' => $invoice->status->frontendLabel(),
            'statusValue' => $invoice->status->value,
            'issued' => $invoice->issued_on?->format('d M Y') ?? '',
            'issuedOn' => $invoice->issued_on?->format('Y-m-d') ?? '',
            'dueOn' => $invoice->due_on?->format('Y-m-d') ?? '',
            'dueLabel' => $invoice->due_on?->format('d M Y') ?? '',
            'discountPercent' => (string) $discountPercent,
            'lineItems' => collect($totals['items'])
                ->map(fn (array $item): array => [
                    'name' => $item['name'],
                    'rate' => (string) $item['rate'],
                    'days' => (string) $item['days'],
                    'amount' => self::formatAmount((string) $item['amount'], $currency),
                    'amountValue' => (string) $item['amount'],
                ])
                ->values()
                ->all(),
            'totals' => [
                'subtotal' => self::formatAmount((string) $totals['subtotal'], $currency),
                'subtotalValue' => (string) $totals['subtotal'],
                'discount' => self::formatAmount((string) $totals['discount'], $currency),
                'discountValue' => (string) $totals['discount'],
                'totalPayable' => self::formatAmount((string) $totals['totalPayable'], $currency),
                'totalPayableValue' => (string) $totals['totalPayable'],
            ],
            'notes' => (string) ($invoice->notes ?? ''),
            'createdAt' => $invoice->created_at?->timezone(config('app.timezone'))->format('d M Y · H:i') ?? '',
            'verificationUrl' => InvoiceVerification::verificationUrl($invoice) ?? '',
            'verificationExpiresLabel' => $invoice->verification_expires_at?->timezone(config('app.timezone'))->format('d M Y') ?? '',
            'verificationActive' => InvoiceVerification::isActive($invoice),
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function attributesFromValidated(array $validated): array
    {
        $discountPercent = (float) ($validated['discount_percent'] ?? 0);
        /** @var list<array<string, mixed>> $lineItems */
        $lineItems = $validated['line_items'];
        $totals = InvoiceTotalsCalculator::calculate($lineItems, $discountPercent);

        return [
            'client_name' => (string) $validated['client_name'],
            'client_email' => (string) $validated['client_email'],
            'client_address' => filled($validated['client_address'] ?? null)
                ? (string) $validated['client_address']
                : null,
            'tour_reference' => filled($validated['tour_reference'] ?? null)
                ? (string) $validated['tour_reference']
                : null,
            'issued_on' => (string) $validated['issued_on'],
            'due_on' => filled($validated['due_on'] ?? null)
                ? (string) $validated['due_on']
                : null,
            'currency' => (string) $validated['currency'],
            'discount_percent' => $discountPercent,
            'line_items' => collect($totals['items'])
                ->map(fn (array $item): array => [
                    'name' => $item['name'],
                    'rate' => $item['rate'],
                    'days' => $item['days'],
                ])
                ->values()
                ->all(),
            'amount' => (string) $totals['totalPayable'],
            'status' => InvoiceStatus::from((string) $validated['status']),
            'notes' => filled($validated['notes'] ?? null)
                ? (string) $validated['notes']
                : null,
        ];
    }

    public static function formatAmount(string $amount, string $currency): string
    {
        $formatted = number_format((float) $amount, 2);

        return match ($currency) {
            'USD' => '$'.$formatted,
            'EUR' => '€'.$formatted,
            'GBP' => '£'.$formatted,
            'AFN' => $formatted.' AFN',
            default => $currency.' '.$formatted,
        };
    }
}
