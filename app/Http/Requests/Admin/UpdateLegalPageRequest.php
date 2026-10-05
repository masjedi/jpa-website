<?php

namespace App\Http\Requests\Admin;

use App\Support\Translatable;
use Illuminate\Foundation\Http\FormRequest;

class UpdateLegalPageRequest extends FormRequest
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
            ...Translatable::validationRules('eyebrow', 120),
            ...Translatable::validationRules('title', 180),
            ...Translatable::validationRules('intro', 2000),
            'sections' => ['required', 'array'],
            ...collect(Translatable::localeCodes())
                ->mapWithKeys(fn (string $locale): array => [
                    "sections.{$locale}" => ['nullable', 'array'],
                    "sections.{$locale}.*.title" => ['nullable', 'string', 'max:180'],
                    "sections.{$locale}.*.body" => ['nullable', 'string', 'max:5000'],
                    "sections.{$locale}.*.link_href" => ['nullable', 'string', 'max:255'],
                    "sections.{$locale}.*.link_label" => ['nullable', 'string', 'max:120'],
                ])
                ->all(),
            'sections.en' => ['required', 'array', 'min:1'],
            'sections.en.*.title' => ['required', 'string', 'max:180'],
            'sections.en.*.body' => ['required', 'string', 'max:5000'],
        ];
    }
}
