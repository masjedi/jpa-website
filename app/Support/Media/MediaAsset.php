<?php

namespace App\Support\Media;

use Illuminate\Contracts\Support\Arrayable;

/**
 * @implements Arrayable<string, mixed>
 */
final class MediaAsset implements Arrayable
{
    /**
     * @param  array<string, array{path: string, width: int|null, height: int|null, format: string}>  $variants
     */
    public function __construct(
        public readonly string $id,
        public readonly string $profile,
        public readonly string $disk,
        public readonly string $directory,
        public readonly array $variants,
        public readonly ?string $originalName = null,
        public readonly ?string $mimeType = null,
    ) {}

    public function path(string $variant = 'default'): ?string
    {
        return $this->variants[$variant]['path'] ?? null;
    }

    public function url(string $variant = 'default'): ?string
    {
        $path = $this->path($variant);

        if ($path === null) {
            return null;
        }

        if ($this->disk === 'local') {
            return null;
        }

        return self::publicDiskUrl($path);
    }

    /**
     * Root-relative URL so images work on localhost, 127.0.0.1, or production domains.
     */
    public static function publicDiskUrl(string $path): string
    {
        return '/storage/'.ltrim(str_replace('\\', '/', $path), '/');
    }

    /**
     * Prefer card/list variants for compact surfaces.
     */
    public function cardUrl(): ?string
    {
        foreach (['card', 'thumb', 'display', 'detail', 'default'] as $variant) {
            $url = $this->url($variant);

            if ($url !== null) {
                return $url;
            }
        }

        return null;
    }

    /**
     * Prefer detail/hero variants for large surfaces.
     */
    public function detailUrl(): ?string
    {
        foreach (['detail', 'display', 'card', 'default'] as $variant) {
            $url = $this->url($variant);

            if ($url !== null) {
                return $url;
            }
        }

        return null;
    }

    /**
     * Absolute paths for every stored file under this asset.
     *
     * @return list<string>
     */
    public function allPaths(): array
    {
        return array_values(array_map(
            fn (array $variant): string => $variant['path'],
            $this->variants,
        ));
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        $variants = [];

        foreach ($this->variants as $name => $variant) {
            $variants[$name] = [
                'path' => $variant['path'],
                'width' => $variant['width'],
                'height' => $variant['height'],
                'format' => $variant['format'],
                'url' => $this->disk === 'local' ? null : self::publicDiskUrl($variant['path']),
            ];
        }

        return [
            'id' => $this->id,
            'profile' => $this->profile,
            'disk' => $this->disk,
            'directory' => $this->directory,
            'original_name' => $this->originalName,
            'mime_type' => $this->mimeType,
            'url' => $this->detailUrl() ?? $this->cardUrl(),
            'card_url' => $this->cardUrl(),
            'detail_url' => $this->detailUrl(),
            'variants' => $variants,
        ];
    }
}
