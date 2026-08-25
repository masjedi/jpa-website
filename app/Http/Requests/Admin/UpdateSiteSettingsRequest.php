<?php

namespace App\Http\Requests\Admin;

use App\Support\Media\BrandLogoImage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateSiteSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'office_maps_href' => $this->nullIfBlank($this->input('office_maps_href')),
            'office_maps_embed_src' => $this->nullIfBlank($this->input('office_maps_embed_src')),
            'social_links' => collect($this->input('social_links', []))
                ->map(function (mixed $link): array {
                    if (! is_array($link)) {
                        return ['label' => '', 'href' => null];
                    }

                    return [
                        'label' => trim((string) ($link['label'] ?? '')),
                        'href' => $this->nullIfBlank($link['href'] ?? null),
                    ];
                })
                ->all(),
        ]);
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
            'office_maps_href' => ['nullable', 'string', 'url', 'max:1000'],
            'office_maps_embed_src' => ['nullable', 'string', 'url', 'max:1000'],
            'social_links' => ['required', 'array', 'size:4'],
            'social_links.*.label' => ['required', 'string', 'max:50', Rule::in([
                'Instagram',
                'Facebook',
                'YouTube',
                'LinkedIn',
            ])],
            'social_links.*.href' => ['nullable', 'string', 'url', 'max:500'],
            'logo_color' => BrandLogoImage::validationRules(required: false),
            'logo_white' => BrandLogoImage::validationRules(required: false),
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $configuredLinks = collect($this->input('social_links', []))
                ->filter(fn (mixed $link): bool => is_array($link) && filled($link['href'] ?? null));

            if ($configuredLinks->isEmpty()) {
                $validator->errors()->add('social_links', 'Add at least one social profile URL.');
            }
        });
    }

    private function nullIfBlank(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $trimmed = trim($value);

        return $trimmed === '' ? null : $trimmed;
    }
}
