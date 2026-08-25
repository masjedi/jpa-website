<?php

namespace App\Http\Requests\Admin;

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
        return [
            'intro_eyebrow' => ['required', 'string', 'max:120'],
            'intro_title' => ['required', 'string', 'max:255'],
            'intro_description' => ['required', 'string', 'max:2000'],
            'mission_section_eyebrow' => ['required', 'string', 'max:120'],
            'mission_section_title' => ['required', 'string', 'max:255'],
            'mission_title' => ['required', 'string', 'max:255'],
            'mission_description' => ['required', 'string', 'max:2000'],
            'vision_title' => ['required', 'string', 'max:255'],
            'vision_description' => ['required', 'string', 'max:2000'],
            'cta_eyebrow' => ['required', 'string', 'max:120'],
            'cta_title' => ['required', 'string', 'max:255'],
            'cta_description' => ['required', 'string', 'max:2000'],
            'cta_primary_label' => ['required', 'string', 'max:120'],
            'cta_primary_href' => ['required', 'string', 'max:500'],
            'cta_secondary_label' => ['required', 'string', 'max:120'],
            'cta_secondary_href' => ['required', 'string', 'max:500'],
        ];
    }
}
