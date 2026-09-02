<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Concerns\ProhibitsMassAssignmentFields;
use App\Support\Media\DocumentAttachment;
use Illuminate\Foundation\Http\FormRequest;

class StoreCustomBookingAttachmentsRequest extends FormRequest
{
    use ProhibitsMassAssignmentFields;

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
            ...$this->prohibitedMassAssignmentRules(),
            'attachments' => ['required', 'array', 'min:1', 'max:'.DocumentAttachment::MAX_FILES],
            'attachments.*' => DocumentAttachment::validationRules(required: true),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'attachments.required' => 'Select at least one file to attach.',
            'attachments.min' => 'Select at least one file to attach.',
            'attachments.max' => 'You may attach up to '.DocumentAttachment::MAX_FILES.' files at once.',
        ];
    }
}
