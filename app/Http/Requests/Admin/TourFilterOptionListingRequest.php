<?php

namespace App\Http\Requests\Admin;

use App\Enums\TourFilterOptionType;
use App\Models\TourFilterOption;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

abstract class TourFilterOptionListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('name')) {
            $this->merge([
                'name' => trim((string) $this->input('name')),
            ]);
        }
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $option = $this->route('tourFilterOption');

        return [
            'type' => ['required', 'string', Rule::in(TourFilterOptionType::frontendValues())],
            'name' => [
                'required',
                'string',
                'max:120',
                Rule::unique((new TourFilterOption)->getTable(), 'name')
                    ->where('type', $this->typeValue() ?? '__invalid__')
                    ->ignore($option instanceof TourFilterOption ? $option->id : null),
            ],
            'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
        ];
    }

    private function typeValue(): ?string
    {
        try {
            return TourFilterOptionType::fromFrontend((string) $this->input('type'))->value;
        } catch (\InvalidArgumentException) {
            return null;
        }
    }
}
