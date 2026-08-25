<?php

namespace App\Http\Requests\Admin;

use App\Support\About\AboutJourneyIcons;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

abstract class AboutJourneyStepListingRequest extends FormRequest
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
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
            'image_alt' => ['required', 'string', 'max:255'],
            'icon_key' => ['required', 'string', Rule::in(AboutJourneyIcons::keys())],
            'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
            'image' => $this->imageRules(),
        ];
    }

    /**
     * @return array<int, string>
     */
    abstract protected function imageRules(): array;
}
