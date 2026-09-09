<?php

namespace App\Http\Requests;

use App\Enums\CustomBookingRequestKind;
use App\Support\Booking\CustomBookingValidation;
use Illuminate\Foundation\Http\FormRequest;

class StoreCustomBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $prepared = CustomBookingValidation::prepare($this->all());

        if (! isset($prepared['request_kind']) || $prepared['request_kind'] === null) {
            $prepared['request_kind'] = CustomBookingRequestKind::CustomTour->value;
        }

        $this->merge($prepared);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return CustomBookingValidation::fieldRules(enforceFuturePreferredDates: true);
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return CustomBookingValidation::messages();
    }
}
