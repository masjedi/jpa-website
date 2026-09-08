<?php

namespace App\Http\Requests\Admin;

use App\Enums\ChatConversationStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateChatConversationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $normalized = [];

        if ($this->has('assigned_to') && $this->input('assigned_to') === '') {
            $normalized['assigned_to'] = null;
        }

        if ($normalized !== []) {
            $this->merge($normalized);
        }
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', 'string', Rule::in(ChatConversationStatus::values())],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }

    public function status(): ChatConversationStatus
    {
        return ChatConversationStatus::from((string) $this->validated('status'));
    }

    public function assignedToId(): ?int
    {
        $validated = $this->validated();

        return array_key_exists('assigned_to', $validated) && $validated['assigned_to'] !== null
            ? (int) $validated['assigned_to']
            : null;
    }
}
