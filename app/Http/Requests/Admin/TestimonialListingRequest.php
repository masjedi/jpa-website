<?php

namespace App\Http\Requests\Admin;

use App\Support\Translatable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

abstract class TestimonialListingRequest extends FormRequest
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
            Translatable::validationRules('name', maxLength: 120),
            Translatable::validationRules('journey', maxLength: 255),
            Translatable::validationRules('text', maxLength: 2000),
            [
                'rating' => ['required', 'integer', 'min:1', 'max:5'],
                'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
            ],
        );
    }
}
