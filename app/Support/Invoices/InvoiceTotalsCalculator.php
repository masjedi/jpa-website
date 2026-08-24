<?php

namespace App\Support\Invoices;

class InvoiceTotalsCalculator
{
    /**
     * @param  list<array{name?: string, rate?: mixed, days?: mixed}>  $lineItems
     * @return array{
     *     subtotal: float,
     *     discount: float,
     *     totalPayable: float,
     *     items: list<array{name: string, rate: float, days: float, amount: float}>
     * }
     */
    public static function calculate(array $lineItems, float $discountPercent = 0): array
    {
        $items = [];
        $subtotal = 0.0;

        foreach ($lineItems as $lineItem) {
            $rate = round(max(0, (float) ($lineItem['rate'] ?? 0)), 2);
            $days = max(1, (float) ($lineItem['days'] ?? 1));
            $amount = round($rate * $days, 2);

            $items[] = [
                'name' => trim((string) ($lineItem['name'] ?? '')),
                'rate' => $rate,
                'days' => $days,
                'amount' => $amount,
            ];

            $subtotal += $amount;
        }

        $subtotal = round($subtotal, 2);
        $discount = round($subtotal * max(0, $discountPercent) / 100, 2);
        $totalPayable = round($subtotal - $discount, 2);

        return [
            'subtotal' => $subtotal,
            'discount' => $discount,
            'totalPayable' => $totalPayable,
            'items' => $items,
        ];
    }
}
