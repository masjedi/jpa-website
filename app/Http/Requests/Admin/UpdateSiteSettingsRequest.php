<?php

namespace App\Http\Requests\Admin;

use App\Support\Media\BrandLogoImage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSiteSettingsRequest extends FormRequest
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
            'brand_name' => ['required', 'string', 'max:255'],
            'contact_email' => ['required', 'email', 'max:255'],
            'whatsapp_display' => ['required', 'string', 'max:50'],
            'whatsapp_href' => ['required', 'url', 'max:255'],
            'office_location' => ['required', 'string', 'max:255'],
            'office_maps_href' => ['nullable', 'url', 'max:1000'],
            'office_maps_embed_src' => ['nullable', 'url', 'max:1000'],
            'social_links' => ['required', 'array', 'min:1', 'max:8'],
            'social_links.*.label' => ['required', 'string', 'max:50', Rule::in([
                'Instagram',
                'Facebook',
                'YouTube',
                'LinkedIn',
            ])],
            'social_links.*.href' => ['required', 'url', 'max:500'],
            'logo_color' => BrandLogoImage::validationRules(required: false),
            'logo_white' => BrandLogoImage::validationRules(required: false),
        ];
    }
}
