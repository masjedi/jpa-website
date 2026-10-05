<?php

namespace App\Http\Requests\Admin;

use App\Support\Translatable;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAboutPageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return array_merge(
            Translatable::validationRules('intro_eyebrow', maxLength: 120),
            Translatable::validationRules('intro_title', maxLength: 255),
            Translatable::validationRules('intro_description', maxLength: 2000),
            Translatable::validationRules('mission_section_eyebrow', maxLength: 120),
            Translatable::validationRules('mission_section_title', maxLength: 255),
            Translatable::validationRules('mission_title', maxLength: 255),
            Translatable::validationRules('mission_description', maxLength: 2000),
            Translatable::validationRules('vision_title', maxLength: 255),
            Translatable::validationRules('vision_description', maxLength: 2000),
            Translatable::validationRules('cta_eyebrow', maxLength: 120),
            Translatable::validationRules('cta_title', maxLength: 255),
            Translatable::validationRules('cta_description', maxLength: 2000),
            Translatable::validationRules('cta_primary_label', maxLength: 120),
            Translatable::validationRules('cta_secondary_label', maxLength: 120),
            [
                'cta_primary_href' => ['required', 'string', 'max:500'],
                'cta_secondary_href' => ['required', 'string', 'max:500'],
            ],
        );
    }
}
