<?php

namespace App\Http\Requests\Admin;

use App\Support\Translatable;
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
        return array_merge(
            Translatable::validationRules('title', maxLength: 255),
            Translatable::validationRules('summary', maxLength: 500),
            Translatable::validationRules('content', maxLength: 65000),
            [
                'category' => ['required', 'string', Rule::in([
                    'Travel tips',
                    'Culture',
                    'Itineraries',
                    'Safety',
                    'Heritage',
                    'Photography',
                ])],
                'is_featured' => ['sometimes', 'boolean'],
                'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
                'team_member_id' => ['nullable', 'integer', 'exists:team_members,id'],
                'author_name' => ['required', 'string', 'min:2', 'max:120'],
                'author_role' => ['nullable', 'string', 'max:120'],
                'cover_image' => $this->coverImageRules(),
            ],
        );
    }

    /**
     * @return array<int, string>
     */
    abstract protected function coverImageRules(): array;

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $content = strip_tags(Translatable::resolve($this->input('content', [])));

            if (trim($content) === '') {
                $validator->errors()->add('content.en', 'The content field is required.');
            }
        });
    }
}
