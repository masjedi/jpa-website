<?php

namespace App\Models;

use App\Support\Media\MediaAsset;
use App\Support\Media\MediaProcessor;
use App\Support\SiteSettings\SiteSettingsDefaults;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'brand_name',
    'contact_email',
    'whatsapp_display',
    'whatsapp_href',
    'office_location',
    'office_maps_href',
    'office_maps_embed_src',
    'social_links',
    'logo_color_media',
    'logo_white_media',
])]
class SiteSetting extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'social_links' => 'array',
            'logo_color_media' => 'array',
            'logo_white_media' => 'array',
        ];
    }

    public static function current(): self
    {
        return static::query()->firstOrCreate([], SiteSettingsDefaults::attributes());
    }

    public function logoColorAsset(): ?MediaAsset
    {
        return $this->hydrateAsset($this->logo_color_media);
    }

    public function logoWhiteAsset(): ?MediaAsset
    {
        return $this->hydrateAsset($this->logo_white_media);
    }

    /**
     * @param  array<string, mixed>|null  $media
     */
    private function hydrateAsset(?array $media): ?MediaAsset
    {
        if (! is_array($media) || $media === []) {
            return null;
        }

        return app(MediaProcessor::class)->hydrate($media);
    }
}
