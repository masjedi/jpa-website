<?php

namespace App\Http\Requests\Admin;

use App\Enums\EmergencyType;
use App\Models\Province;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmergencyContactIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $normalized = [];

        foreach (['search', 'province_id', 'emergency_type', 'status', 'shareable', 'sort', 'direction'] as $key) {
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
            'province_id' => ['nullable', 'integer', Rule::exists((new Province)->getTable(), 'id')],
            'emergency_type' => ['nullable', 'string', Rule::in(EmergencyType::values())],
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive'])],
            'shareable' => ['nullable', 'string', Rule::in(['yes', 'no'])],
            'sort' => ['nullable', 'string', Rule::in(['last_verified_at', 'full_name', 'province', 'organization'])],
            'direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
        ];
    }

    /**
     * @return array{
     *     search: string,
     *     province_id: int|null,
     *     emergency_type: EmergencyType|null,
     *     is_active: bool|null,
     *     is_customer_shareable: bool|null,
     *     status: string,
     *     shareable: string,
     *     sort: string,
     *     direction: string
     * }
     */
    public function filters(): array
    {
        $validated = $this->validated();
        $status = (string) ($validated['status'] ?? '');
        $shareable = (string) ($validated['shareable'] ?? '');
        $type = (string) ($validated['emergency_type'] ?? '');

        return [
            'search' => trim((string) ($validated['search'] ?? '')),
            'province_id' => isset($validated['province_id']) ? (int) $validated['province_id'] : null,
            'emergency_type' => $type !== '' ? EmergencyType::from($type) : null,
            'is_active' => match ($status) {
                'active' => true,
                'inactive' => false,
                default => null,
            },
            'is_customer_shareable' => match ($shareable) {
                'yes' => true,
                'no' => false,
                default => null,
            },
            'status' => $status,
            'shareable' => $shareable,
            'sort' => (string) ($validated['sort'] ?? 'last_verified_at'),
            'direction' => (string) ($validated['direction'] ?? 'desc'),
        ];
    }
}
