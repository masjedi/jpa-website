<?php

namespace App\Http\Requests\Admin;

use App\Models\HeroSlide;
use App\Support\Media\HeroSlideImage;
use App\Support\Translatable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHeroSlideRequest extends FormRequest
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
        /** @var HeroSlide $heroSlide */
        $heroSlide = $this->route('heroSlide');
        $requiresImage = $heroSlide->imageAsset() === null;

        return array_merge(
            Translatable::validationRules('title', maxLength: 255),
            Translatable::validationRules('subtitle', maxLength: 1000),
            [
                'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
                'hero_image' => HeroSlideImage::validationRules(required: $requiresImage),
            ],
        );
    }
}
