<?php

namespace App\Http\Requests\Admin;

use App\Support\Translatable;
use Illuminate\Foundation\Http\FormRequest;

class UpdateHeroSectionRequest extends FormRequest
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
        return Translatable::validationRules('eyebrow', maxLength: 255);
    }
}
