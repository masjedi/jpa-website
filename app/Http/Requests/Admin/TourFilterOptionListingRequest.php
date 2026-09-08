<?php

namespace App\Http\Requests\Admin;

use App\Enums\TourFilterOptionType;
use App\Models\TourFilterOption;
use App\Support\Translatable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

abstract class TourFilterOptionListingRequest extends FormRequest
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
        $option = $this->route('tourFilterOption');

        return array_merge(
            Translatable::validationRules('name', maxLength: 120),
            [
                'type' => ['required', 'string', Rule::in(TourFilterOptionType::frontendValues())],
                'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
                'value' => [
                    'required',
                    'string',
                    'max:120',
                    Rule::unique((new TourFilterOption)->getTable(), 'value')
                        ->where('type', $this->typeValue() ?? '__invalid__')
                        ->ignore($option instanceof TourFilterOption ? $option->id : null),
                ],
            ],
        );
    }

    protected function prepareForValidation(): void
    {
        $name = $this->input('name');

        if (is_string($name)) {
            $name = Translatable::normalize($name);
            $this->merge(['name' => $name]);
        }

        $englishName = is_array($name)
            ? trim((string) ($name['en'] ?? ''))
            : trim((string) $name);

        $this->merge([
            'value' => $englishName,
        ]);
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
