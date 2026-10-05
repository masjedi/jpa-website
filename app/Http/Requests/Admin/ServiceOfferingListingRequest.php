<?php

namespace App\Http\Requests\Admin;

use App\Enums\ServiceOfferingCategory;
use App\Models\ServiceOffering;
use App\Support\Services\ServiceOfferingIcons;
use App\Support\Translatable;
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
        $title = $this->input('title');
        $englishTitle = is_array($title)
            ? trim((string) ($title['en'] ?? ''))
            : trim((string) $title);
        $slug = trim((string) $this->input('slug', ''));

        $featuresText = $this->input('features_text');

        if (is_string($featuresText)) {
            $featuresText = Translatable::normalize($featuresText);
        }

        $this->merge([
            'slug' => $slug !== '' ? Str::slug($slug) : ($englishTitle !== '' ? Str::slug($englishTitle) : null),
            'is_featured' => filter_var($this->input('is_featured', false), FILTER_VALIDATE_BOOLEAN),
            'show_on_home' => filter_var($this->input('show_on_home', false), FILTER_VALIDATE_BOOLEAN),
            'features_text' => is_array($featuresText) ? $featuresText : [],
        ]);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $offering = $this->route('serviceOffering');

        return array_merge(
            Translatable::validationRules('title', maxLength: 120),
            Translatable::validationRules('tagline', maxLength: 200),
            Translatable::validationRules('description', maxLength: 2000),
            Translatable::validationRulesForStringListText('features_text', maxLength: 2000),
            [
                'slug' => [
                    'required',
                    'string',
                    'max:160',
                    Rule::unique((new ServiceOffering)->getTable(), 'slug')
                        ->ignore($offering instanceof ServiceOffering ? $offering->id : null),
                ],
                'category' => ['required', 'string', Rule::in(ServiceOfferingCategory::frontendValues())],
                'icon_key' => ['required', 'string', Rule::in(ServiceOfferingIcons::keys())],
                'is_featured' => ['sometimes', 'boolean'],
                'show_on_home' => ['sometimes', 'boolean'],
                'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
            ],
        );
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $features = Translatable::resolveStringList(
                Translatable::sanitizeStringListFromText($this->input('features_text', [])),
            );

            if ($features === []) {
                $validator->errors()->add('features_text.en', 'Add at least one feature.');
            }

            if (count($features) > 8) {
                $validator->errors()->add('features_text.en', 'Use at most eight features.');
            }
        });
    }
}
