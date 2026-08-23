<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

abstract class DestinationListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_featured' => filter_var($this->input('is_featured', false), FILTER_VALIDATE_BOOLEAN),
        ]);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'tagline' => ['required', 'string', 'max:255'],
            'region' => ['required', 'string', Rule::in([
                'Central Highlands',
                'Capital & East',
                'Western Silk Road',
                'Northern Region',
                'Pamir & Badakhshan',
                'Southern Plains',
            ])],
            'badge' => ['nullable', 'string', 'max:80'],
            'description' => ['required', 'string', 'max:65000'],
            'highlights_text' => ['nullable', 'string', 'max:10000'],
            'best_season' => ['nullable', 'string', 'max:120'],
            'travel_style' => ['nullable', 'string', 'max:120'],
            'practical_notes_text' => ['nullable', 'string', 'max:10000'],
            'tour_match_keywords_text' => ['nullable', 'string', 'max:5000'],
            'is_featured' => ['sometimes', 'boolean'],
            'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
            'cover_image' => $this->coverImageRules(),
        ];
    }

    /**
     * @return array<int, string>
     */
    abstract protected function coverImageRules(): array;

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $description = strip_tags((string) $this->input('description', ''));

            if (trim($description) === '') {
                $validator->errors()->add('description', 'The description field is required.');
            }
        });
    }
}
