<?php

namespace App\Http\Requests\Admin;

use App\Enums\EmergencyType;
use App\Http\Requests\Concerns\ProhibitsMassAssignmentFields;
use App\Http\Requests\Concerns\TrimsStringInput;
use App\Models\Province;
use App\Support\EmergencyContacts\EmergencyContactOptions;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

abstract class EmergencyContactListingRequest extends FormRequest
{
    use ProhibitsMassAssignmentFields;
    use TrimsStringInput;

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->trimStringInput([
            'full_name',
            'position',
            'organization',
            'primary_phone',
            'secondary_phone',
            'whatsapp',
            'availability_notes',
            'internal_notes',
            'last_verified_at',
            'status',
            'emergency_type',
        ]);
        $this->nullifyEmptyStringInput([
            'secondary_phone',
            'whatsapp',
            'availability_notes',
            'internal_notes',
        ]);
        $this->merge([
            'is_customer_shareable' => filter_var($this->input('is_customer_shareable', false), FILTER_VALIDATE_BOOLEAN),
        ]);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $phone = ['string', 'min:8', 'max:60', 'regex:'.EmergencyContactOptions::PHONE_REGEX];

        return [
            ...$this->prohibitedMassAssignmentRules(),
            'created_by' => ['prohibited'],
            'updated_by' => ['prohibited'],
            'verified_by' => ['prohibited'],
            'is_active' => ['prohibited'],
            'province_id' => ['required', 'integer', Rule::exists((new Province)->getTable(), 'id')],
            'full_name' => ['required', 'string', 'min:2', 'max:120'],
            'position' => ['required', 'string', 'min:2', 'max:120'],
            'organization' => ['required', 'string', 'min:2', 'max:160'],
            'emergency_type' => ['required', 'string', Rule::in(array_merge(EmergencyType::values(), EmergencyType::frontendValues()))],
            'primary_phone' => ['required', ...$phone],
            'secondary_phone' => ['nullable', ...$phone],
            'whatsapp' => ['nullable', ...$phone],
            'availability_notes' => ['nullable', 'string', 'max:500'],
            'last_verified_at' => ['required', 'date', 'before_or_equal:today'],
            'status' => ['required', 'string', Rule::in(EmergencyContactOptions::statusLabels())],
            'is_customer_shareable' => ['sometimes', 'boolean'],
            'internal_notes' => ['nullable', 'string', 'max:5000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'primary_phone.regex' => 'Enter a phone number with country code, for example +93 70 000 0000.',
            'secondary_phone.regex' => 'Enter a phone number with country code, for example +93 70 000 0000.',
            'whatsapp.regex' => 'Enter a WhatsApp number with country code, for example +93 70 000 0000.',
            'province_id.exists' => 'Choose a province from the published list.',
            'emergency_type.in' => 'Choose a valid emergency type.',
        ];
    }
}
