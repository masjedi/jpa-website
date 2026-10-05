<?php

namespace App\Http\Requests\Admin;

use App\Support\About\AboutJourneyIcons;
use App\Support\Translatable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

abstract class AboutJourneyStepListingRequest extends FormRequest
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
        return array_merge(
            Translatable::validationRules('title', maxLength: 255),
            Translatable::validationRules('description', maxLength: 2000),
            Translatable::validationRules('image_alt', maxLength: 255),
            [
                'icon_key' => ['required', 'string', Rule::in(AboutJourneyIcons::keys())],
                'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
                'image' => $this->imageRules(),
            ],
        );
    }

    /**
     * @return array<int, string>
     */
    abstract protected function imageRules(): array;
}
