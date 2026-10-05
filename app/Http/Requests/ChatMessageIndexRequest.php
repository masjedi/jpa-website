<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChatMessageIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->query('after_id') === '') {
            $this->merge(['after_id' => null]);
        }
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'after_id' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function afterId(): ?int
    {
        $validated = $this->validated();

        return isset($validated['after_id']) ? (int) $validated['after_id'] : null;
    }
}
