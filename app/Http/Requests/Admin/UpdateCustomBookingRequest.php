<?php

namespace App\Http\Requests\Admin;

use App\Enums\CustomBookingStatus;
use App\Support\Booking\CustomBookingValidation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $prepared = CustomBookingValidation::prepare($this->all());
        unset($prepared['request_kind'], $prepared['package_title'], $prepared['package_price']);
        $this->merge($prepared);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $rules = CustomBookingValidation::fieldRules(enforceFuturePreferredDates: false);
        unset($rules['request_kind'], $rules['package_title'], $rules['package_price']);

        return [
            ...$rules,
            'status' => ['nullable', 'string', Rule::enum(CustomBookingStatus::class)],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return CustomBookingValidation::messages();
    }
}
