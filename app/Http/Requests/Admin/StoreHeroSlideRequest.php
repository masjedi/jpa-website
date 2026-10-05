<?php

namespace App\Http\Requests\Admin;

use App\Support\Media\HeroSlideImage;
use App\Support\Translatable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHeroSlideRequest extends FormRequest
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
            Translatable::validationRules('title', maxLength: 255),
            Translatable::validationRules('subtitle', maxLength: 1000),
            [
                'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
                'hero_image' => HeroSlideImage::validationRules(required: true),
            ],
        );
    }
}
