<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

abstract class ArticleListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_featured' => filter_var($this->input('is_featured', false), FILTER_VALIDATE_BOOLEAN),
        ]);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['required', 'string', 'max:500'],
            'category' => ['required', 'string', Rule::in([
                'Travel tips',
                'Culture',
                'Itineraries',
                'Safety',
                'Heritage',
                'Photography',
            ])],
            'content' => ['required', 'string', 'max:65000'],
            'is_featured' => ['sometimes', 'boolean'],
            'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
            'cover_image' => $this->coverImageRules(),
        ];
    }

    /**
     * @return array<int, string>
     */
    abstract protected function coverImageRules(): array;

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $content = strip_tags((string) $this->input('content', ''));

            if (trim($content) === '') {
                $validator->errors()->add('content', 'The content field is required.');
            }
        });
    }
}
