<?php

namespace App\Http\Requests\Admin;

use App\Support\Media\GalleryPhotoImage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGalleryPhotoRequest extends FormRequest
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
            'gallery_images' => ['required', 'array', 'min:1', 'max:24'],
            'gallery_images.*' => GalleryPhotoImage::validationRules(required: true),
            'status' => ['required', 'string', Rule::in(['Published', 'Draft'])],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'gallery_images.required' => 'Select at least one image to upload.',
            'gallery_images.min' => 'Select at least one image to upload.',
            'gallery_images.max' => 'You may upload up to 24 images at once.',
        ];
    }
}
