<?php

namespace App\Models;

use App\Support\About\AboutPageDefaults;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'intro_eyebrow',
    'intro_title',
    'intro_description',
    'mission_section_eyebrow',
    'mission_section_title',
    'mission_title',
    'mission_description',
    'vision_title',
    'vision_description',
    'cta_eyebrow',
    'cta_title',
    'cta_description',
    'cta_primary_label',
    'cta_primary_href',
    'cta_secondary_label',
    'cta_secondary_href',
])]
class AboutPage extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'intro_eyebrow' => 'array',
            'intro_title' => 'array',
            'intro_description' => 'array',
            'mission_section_eyebrow' => 'array',
            'mission_section_title' => 'array',
            'mission_title' => 'array',
            'mission_description' => 'array',
            'vision_title' => 'array',
            'vision_description' => 'array',
            'cta_eyebrow' => 'array',
            'cta_title' => 'array',
            'cta_description' => 'array',
            'cta_primary_label' => 'array',
            'cta_secondary_label' => 'array',
        ];
    }

    public static function current(): self
    {
        return static::query()->firstOrCreate([], AboutPageDefaults::attributes());
    }
}
