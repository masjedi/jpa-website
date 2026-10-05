<?php

namespace App\Http\Requests\Admin;

use App\Support\Translatable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

abstract class FaqListingRequest extends FormRequest
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
            Translatable::validationRules('question', maxLength: 500),
            Translatable::validationRules('answer', maxLength: 5000),
            [
                'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
            ],
        );
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $question = Translatable::resolve($this->input('question', []));
            $answer = Translatable::resolve($this->input('answer', []));

            if ($question === '') {
                $validator->errors()->add('question.en', 'The question field is required.');
            }

            if ($answer === '') {
                $validator->errors()->add('answer.en', 'The answer field is required.');
            }
        });
    }
}
