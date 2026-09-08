<?php

namespace App\Http\Requests\Admin;

use App\Support\Media\GalleryPhotoImage;
use App\Support\Translatable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGalleryPhotoRequest extends FormRequest
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
            Translatable::validationRules('alt', maxLength: 255),
            Translatable::validationRules('caption', maxLength: 255),
            [
                'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
                'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
                'gallery_image' => GalleryPhotoImage::validationRules(required: false),
            ],
        );
    }
}
