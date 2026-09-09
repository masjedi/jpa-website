<?php

namespace App\Models;

use App\Enums\LegalPageKey;
use App\Support\Legal\LegalPageDefaults;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'key',
    'eyebrow',
    'title',
    'intro',
    'sections',
])]
class LegalPage extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'key' => LegalPageKey::class,
            'eyebrow' => 'array',
            'title' => 'array',
            'intro' => 'array',
            'sections' => 'array',
        ];
    }

    public static function forKey(LegalPageKey|string $key): self
    {
        $pageKey = $key instanceof LegalPageKey ? $key : LegalPageKey::from($key);

        return static::query()->firstOrCreate(
            ['key' => $pageKey],
            LegalPageDefaults::attributesFor($pageKey),
        );
    }
}
