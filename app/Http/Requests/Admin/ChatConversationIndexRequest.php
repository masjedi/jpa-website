<?php

namespace App\Http\Requests\Admin;

use App\Enums\ChatConversationStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChatConversationIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $normalized = [];

        foreach (['search', 'status', 'assigned_to', 'unread_only'] as $key) {
            if ($this->query($key) === '') {
                $normalized[$key] = null;
            }
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
            'search' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', 'string', Rule::in(ChatConversationStatus::values())],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
            'unread_only' => ['nullable', 'string', Rule::in(['0', '1'])],
        ];
    }

    /**
     * @return array{
     *     search: string,
     *     status: ChatConversationStatus|null,
     *     assigned_to: int|null,
     *     unread_only: bool
     * }
     */
    public function filters(): array
    {
        $validated = $this->validated();
        $status = (string) ($validated['status'] ?? '');

        return [
            'search' => trim((string) ($validated['search'] ?? '')),
            'status' => $status !== '' ? ChatConversationStatus::from($status) : null,
            'assigned_to' => isset($validated['assigned_to']) ? (int) $validated['assigned_to'] : null,
            'unread_only' => ($validated['unread_only'] ?? '') === '1',
        ];
    }
}
