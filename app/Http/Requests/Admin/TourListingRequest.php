<?php

namespace App\Http\Requests\Admin;

use App\Enums\TourListingType;
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

        return [
            'listing_type' => ['required', 'string', Rule::in(['tour', 'package'])],
            'title' => ['required', 'string', 'max:255'],
            'tagline' => [$isPackage ? 'required' : 'nullable', 'string', 'max:255'],
            'summary' => ['required', 'string', 'max:5000'],
            'destination' => ['required', 'string', 'max:255'],
            'region' => ['required', 'string', Rule::in([
                'Central Highlands',
                'Eastern & Capital',
                'Western Silk Road',
                'Northern Region',
                'Pamir & Badakhshan',
                'Multiple Regions',
                'Southern Plains',
            ])],
            'duration_days' => ['required', 'integer', $isPackage ? 'min:0' : 'min:1', 'max:365'],
            'travel_style' => [$isPackage ? 'nullable' : 'required', 'string', Rule::in([
                'Cultural & Heritage',
                'Adventure & Trekking',
                'Photography Focus',
                'Silk Road History',
                'Small Group Expedition',
            ])],
            'difficulty' => [$isPackage ? 'nullable' : 'required', 'string', Rule::in([
                'Easy',
                'Moderate',
                'Demanding',
                'Expedition',
            ])],
            'badge' => ['nullable', 'string', 'max:80'],
            'content' => [$isPackage ? 'nullable' : 'required', 'string', 'max:65000'],
            'highlights_text' => ['required', 'string', 'max:10000'],
            'key_destinations_text' => [$isPackage ? 'required' : 'nullable', 'string', 'max:5000'],
            'included_services_text' => [$isPackage ? 'required' : 'nullable', 'string', 'max:10000'],
            'next_departure_date' => ['nullable', 'string', 'max:120'],
            'next_departure_status' => ['nullable', 'string', Rule::in([
                'Guaranteed',
                'Limited Availability',
                'Open for Inquiries',
                'Almost Full',
                'On Request',
            ])],
            'estimated_starting_price' => ['nullable', 'string', 'max:255'],
            'price_estimate' => [$isPackage ? 'required' : 'nullable', 'string', 'max:255'],
            'ideal_for' => [$isPackage ? 'required' : 'nullable', 'string', 'max:255'],
            'is_popular' => ['sometimes', 'boolean'],
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
            if ($this->input('listing_type') !== TourListingType::Tour->value) {
                return;
            }

            $content = strip_tags((string) $this->input('content', ''));

            if (trim($content) === '') {
                $validator->errors()->add('content', 'The content field is required for tour itineraries.');
            }
        });
    }
}
