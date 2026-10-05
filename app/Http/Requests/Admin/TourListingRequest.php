<?php

namespace App\Http\Requests\Admin;

use App\Enums\TourFilterOptionType;
use App\Enums\TourListingType;
use App\Models\TourFilterOption;
use App\Support\Translatable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

abstract class TourListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_popular' => filter_var($this->input('is_popular', false), FILTER_VALIDATE_BOOLEAN),
        ]);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $listingType = (string) $this->input('listing_type', 'tour');
        $isPackage = $listingType === TourListingType::Package->value;

        return array_merge(
            Translatable::validationRules('title', maxLength: 255),
            $isPackage
                ? Translatable::validationRules('tagline', maxLength: 255)
                : Translatable::validationRulesOptional('tagline', maxLength: 255),
            Translatable::validationRules('summary', maxLength: 5000),
            Translatable::validationRules('destination', maxLength: 255),
            Translatable::validationRulesForStringListText('highlights_text', maxLength: 10000),
            $isPackage
                ? Translatable::validationRulesForStringListText('key_destinations_text', maxLength: 5000)
                : Translatable::validationRulesForStringListText('key_destinations_text', maxLength: 5000, requireEnglish: false),
            $isPackage
                ? Translatable::validationRulesForStringListText('included_services_text', maxLength: 10000)
                : Translatable::validationRulesForStringListText('included_services_text', maxLength: 10000, requireEnglish: false),
            $isPackage
                ? Translatable::validationRules('price_estimate', maxLength: 255)
                : Translatable::validationRulesOptional('price_estimate', maxLength: 255),
            $isPackage
                ? Translatable::validationRules('ideal_for', maxLength: 255)
                : Translatable::validationRulesOptional('ideal_for', maxLength: 255),
            $isPackage
                ? []
                : Translatable::validationRules('content', maxLength: 65000),
            [
                'listing_type' => ['required', 'string', Rule::in(['tour', 'package'])],
                'region' => [
                    'required',
                    'string',
                    Rule::in(TourFilterOption::namesFor(TourFilterOptionType::Region)),
                ],
                'duration_days' => ['required', 'integer', $isPackage ? 'min:0' : 'min:1', 'max:365'],
                'travel_style' => [
                    $isPackage ? 'nullable' : 'required',
                    'string',
                    Rule::in(TourFilterOption::namesFor(TourFilterOptionType::TravelStyle)),
                ],
                'difficulty' => [
                    $isPackage ? 'nullable' : 'required',
                    'string',
                    Rule::in(TourFilterOption::namesFor(TourFilterOptionType::Difficulty)),
                ],
                'badge' => ['nullable', 'array'],
                'badge.en' => ['nullable', 'string', 'max:80'],
                'badge.fa' => ['nullable', 'string', 'max:80'],
                'badge.ps' => ['nullable', 'string', 'max:80'],
                'is_popular' => ['sometimes', 'boolean'],
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
            if ($this->input('listing_type') !== TourListingType::Tour->value) {
                return;
            }

            $content = strip_tags(Translatable::resolve($this->input('content', [])));

            if (trim($content) === '') {
                $validator->errors()->add('content.en', 'The content field is required for tour itineraries.');
            }
        });
    }
}
