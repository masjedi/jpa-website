<?php

namespace App\Http\Requests\Admin;

use App\Support\Translatable;
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
        $merge = [
            'is_featured' => filter_var($this->input('is_featured', false), FILTER_VALIDATE_BOOLEAN),
        ];

        foreach (['highlights_text', 'practical_notes_text'] as $field) {
            $value = $this->input($field);

            if (is_string($value)) {
                $merge[$field] = Translatable::normalize($value);
            }
        }

        $this->merge($merge);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return array_merge(
            Translatable::validationRules('name', maxLength: 255),
            Translatable::validationRules('tagline', maxLength: 255),
            Translatable::validationRules('description', maxLength: 65000),
            Translatable::validationRulesOptional('badge', maxLength: 80),
            Translatable::validationRulesForStringListText('highlights_text', maxLength: 10000, requireEnglish: false),
            Translatable::validationRulesOptional('best_season', maxLength: 120),
            Translatable::validationRulesOptional('travel_style', maxLength: 120),
            Translatable::validationRulesForStringListText('practical_notes_text', maxLength: 10000, requireEnglish: false),
            [
                'region' => ['required', 'string', Rule::in([
                    'Central Highlands',
                    'Capital & East',
                    'Western Silk Road',
                    'Northern Region',
                    'Pamir & Badakhshan',
                    'Southern Plains',
                ])],
                'tour_match_keywords_text' => ['nullable', 'string', 'max:5000'],
                'is_featured' => ['sometimes', 'boolean'],
                'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
                'cover_image' => $this->coverImageRules(),
            ],
        );
    }

    /**
     * @return array<int, string>
     */
    abstract protected function coverImageRules(): array;

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $description = strip_tags(Translatable::resolve($this->input('description', [])));

            if (trim($description) === '') {
                $validator->errors()->add('description.en', 'The description field is required.');
            }
        });
    }
}
