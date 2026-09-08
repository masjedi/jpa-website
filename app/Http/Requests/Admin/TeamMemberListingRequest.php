<?php

namespace App\Http\Requests\Admin;

use App\Support\Translatable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

abstract class TeamMemberListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return array_merge(
            Translatable::validationRules('name', maxLength: 255),
            Translatable::validationRules('role', maxLength: 255),
            Translatable::validationRules('bio', maxLength: 5000),
            [
                'email' => ['required', 'string', 'email', 'max:255'],
                'whatsapp' => ['required', 'string', 'max:80'],
                'whatsapp_href' => ['required', 'string', 'url', 'max:500'],
                'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
                'avatar_image' => $this->avatarImageRules(),
            ],
        );
    }

    /**
     * @return array<int, string>
     */
    abstract protected function avatarImageRules(): array;
}
