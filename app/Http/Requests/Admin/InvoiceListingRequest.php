<?php

namespace App\Http\Requests\Admin;

use App\Enums\InvoiceStatus;
use App\Support\Invoices\InvoiceTotalsCalculator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

abstract class InvoiceListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'client_name' => ['required', 'string', 'max:255'],
            'client_email' => ['required', 'email', 'max:255'],
            'client_address' => ['nullable', 'string', 'max:2000'],
            'tour_reference' => ['nullable', 'string', 'max:255'],
            'issued_on' => ['required', 'date'],
            'due_on' => ['nullable', 'date', 'after_or_equal:issued_on'],
            'currency' => ['required', 'string', Rule::in(['USD', 'EUR', 'GBP', 'AFN'])],
            'discount_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'amount' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'status' => ['required', 'string', Rule::in(array_column(InvoiceStatus::cases(), 'value'))],
            'line_items' => ['required', 'array', 'min:1'],
            'line_items.*.name' => ['required', 'string', 'max:255'],
            'line_items.*.rate' => ['required', 'numeric', 'min:0'],
            'line_items.*.days' => ['required', 'numeric', 'min:1'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            /** @var list<array<string, mixed>> $lineItems */
            $lineItems = $this->input('line_items', []);
            $discountPercent = (float) $this->input('discount_percent', 0);
            $totals = InvoiceTotalsCalculator::calculate($lineItems, $discountPercent);
            $submittedAmount = round((float) $this->input('amount', 0), 2);

            if (abs($submittedAmount - $totals['totalPayable']) > 0.01) {
                $validator->errors()->add('amount', 'The total amount must match the calculated service totals.');
            }
        });
    }
}
