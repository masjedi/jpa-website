<?php

namespace App\Http\Requests\Admin;

use App\Enums\ServiceOfferingCategory;
use App\Models\ServiceOffering;
use App\Support\Services\ServiceOfferingIcons;
use App\Support\Services\ServiceOfferingText;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

abstract class ServiceOfferingListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $title = trim((string) $this->input('title', ''));
        $slug = trim((string) $this->input('slug', ''));

        $this->merge([
            'title' => $title,
            'slug' => $slug !== '' ? Str::slug($slug) : ($title !== '' ? Str::slug($title) : null),
            'is_featured' => filter_var($this->input('is_featured', false), FILTER_VALIDATE_BOOLEAN),
            'show_on_home' => filter_var($this->input('show_on_home', false), FILTER_VALIDATE_BOOLEAN),
        ]);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $offering = $this->route('serviceOffering');

        return [
            'title' => ['required', 'string', 'max:120'],
            'slug' => [
                'required',
                'string',
                'max:160',
                Rule::unique((new ServiceOffering)->getTable(), 'slug')
                    ->ignore($offering instanceof ServiceOffering ? $offering->id : null),
            ],
            'tagline' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string', 'max:2000'],
            'category' => ['required', 'string', Rule::in(ServiceOfferingCategory::frontendValues())],
            'icon_key' => ['required', 'string', Rule::in(ServiceOfferingIcons::keys())],
            'features_text' => ['required', 'string', 'max:2000'],
            'is_featured' => ['sometimes', 'boolean'],
            'show_on_home' => ['sometimes', 'boolean'],
            'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $features = ServiceOfferingText::lines((string) $this->input('features_text', ''));

            if ($features === []) {
                $validator->errors()->add('features_text', 'Add at least one feature.');
            }

            if (count($features) > 8) {
                $validator->errors()->add('features_text', 'Use at most eight features.');
            }
        });
    }
}
