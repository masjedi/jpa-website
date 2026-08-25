<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ProhibitsMassAssignmentFields;
use App\Http\Requests\Concerns\TrimsStringInput;
use App\Support\Inquiries\ContactInquiryTopics;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactInquiryRequest extends FormRequest
{
    use ProhibitsMassAssignmentFields;
    use TrimsStringInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->trimStringInput(['name', 'email', 'topic', 'message']);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            ...$this->prohibitedMassAssignmentRules(),
            'name' => [
                'required',
                'string',
                'min:2',
                'max:120',
                'regex:/^[\p{L}\p{M}][\p{L}\p{M}\s.\'-]*$/u',
            ],
            'email' => ['required', 'string', 'email:filter', 'min:5', 'max:255'],
            'topic' => ['required', 'string', Rule::in(ContactInquiryTopics::values())],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.regex' => 'Please enter a valid name using letters only.',
            'topic.in' => 'Please choose a valid topic.',
            'message.min' => 'Please write at least :min characters in your message.',
        ];
    }
}
