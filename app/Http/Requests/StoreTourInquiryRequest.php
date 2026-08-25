<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ProhibitsMassAssignmentFields;
use App\Http\Requests\Concerns\TrimsStringInput;
use App\Support\Inquiries\TourInquiryTravelerCounts;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTourInquiryRequest extends FormRequest
{
    use ProhibitsMassAssignmentFields;
    use TrimsStringInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->trimStringInput([
            'tourTitle',
            'preferredDate',
            'travelerCount',
            'fullName',
            'email',
            'nationality',
            'whatsappOrPhone',
            'notes',
        ]);

        $this->nullifyEmptyStringInput([
            'preferredDate',
            'travelerCount',
            'nationality',
            'whatsappOrPhone',
            'notes',
        ]);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            ...$this->prohibitedMassAssignmentRules(),
            'tourTitle' => ['required', 'string', 'min:2', 'max:200'],
            'preferredDate' => [
                'nullable',
                'string',
                'max:120',
                'regex:/^[\p{L}\p{N}\s.,\-–—\/+]+$/u',
            ],
            'travelerCount' => [
                'nullable',
                'string',
                Rule::in(TourInquiryTravelerCounts::values()),
            ],
            'fullName' => [
                'required',
                'string',
                'min:2',
                'max:120',
                'regex:/^[\p{L}\p{M}][\p{L}\p{M}\s.\'-]*$/u',
            ],
            'email' => ['required', 'string', 'email:filter', 'min:5', 'max:255'],
            'nationality' => [
                'nullable',
                'string',
                'min:2',
                'max:120',
                'regex:/^[\p{L}\p{M}][\p{L}\p{M}\s.\'-]*$/u',
            ],
            'whatsappOrPhone' => [
                'nullable',
                'string',
                'min:7',
                'max:60',
                'regex:/^\+?[\d\s().\-]+$/',
            ],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'fullName.regex' => 'Please enter a valid name using letters only.',
            'nationality.regex' => 'Please enter a valid nationality using letters only.',
            'travelerCount.in' => 'Please choose a valid group size.',
            'preferredDate.regex' => 'Please enter travel dates using letters, numbers, or common punctuation only.',
            'whatsappOrPhone.regex' => 'Please enter a valid phone number.',
        ];
    }
}
