<?php

namespace App\Support\Media;

use InvalidArgumentException;

final class MediaProfile
{
    /**
     * @param  array<string, array{width: int, height: int}>  $variants
     * @param  list<string>  $allowedMimes
     * @param  list<string>  $allowedExtensions
     */
    public function __construct(
        public readonly string $key,
        public readonly string $type,
        public readonly string $disk,
        public readonly string $directory,
        public readonly array $allowedMimes,
        public readonly array $allowedExtensions,
        public readonly int $maxUploadKilobytes,
        public readonly ?int $maxSourceWidth,
        public readonly ?int $maxSourceHeight,
        public readonly ?int $maxSourcePixels,
        public readonly ?string $aspectRatio,
        public readonly string $fit,
        public readonly string $outputFormat,
        public readonly string $fallbackFormat,
        public readonly int $quality,
        public readonly bool $retainOriginal,
        public readonly string $visibility,
        public readonly array $variants,
    ) {}

    public static function fromConfig(string $key): self
    {
        $profiles = config('media.profiles', []);

        if (! is_array($profiles) || ! array_key_exists($key, $profiles)) {
            throw new InvalidArgumentException("Unknown media profile [{$key}].");
        }

        /** @var array<string, mixed> $config */
        $config = $profiles[$key];
        $defaults = config('media.defaults', []);

        $type = (string) ($config['type'] ?? 'image');

        return new self(
            key: $key,
            type: $type,
            disk: (string) ($config['disk'] ?? ($type === 'document' ? 'local' : 'public')),
            directory: trim((string) ($config['directory'] ?? "media/{$key}"), '/'),
            allowedMimes: array_values($config['allowed_mimes'] ?? []),
            allowedExtensions: array_values($config['allowed_extensions'] ?? []),
            maxUploadKilobytes: (int) ($config['max_upload_kilobytes'] ?? ($defaults['max_upload_kilobytes'] ?? 8192)),
            maxSourceWidth: isset($config['max_source_width']) ? (int) $config['max_source_width'] : (isset($defaults['max_source_width']) ? (int) $defaults['max_source_width'] : null),
            maxSourceHeight: isset($config['max_source_height']) ? (int) $config['max_source_height'] : (isset($defaults['max_source_height']) ? (int) $defaults['max_source_height'] : null),
            maxSourcePixels: isset($config['max_source_pixels']) ? (int) $config['max_source_pixels'] : (isset($defaults['max_source_pixels']) ? (int) $defaults['max_source_pixels'] : null),
            aspectRatio: isset($config['aspect_ratio']) ? (is_string($config['aspect_ratio']) ? $config['aspect_ratio'] : null) : null,
            fit: (string) ($config['fit'] ?? 'cover'),
            outputFormat: (string) ($config['output_format'] ?? ($defaults['image_format'] ?? 'webp')),
            fallbackFormat: (string) ($config['fallback_format'] ?? ($defaults['fallback_format'] ?? 'jpg')),
            quality: (int) ($config['quality'] ?? ($defaults['quality'] ?? 82)),
            retainOriginal: (bool) ($config['retain_original'] ?? false),
            visibility: (string) ($config['visibility'] ?? ($type === 'document' ? 'private' : 'public')),
            variants: is_array($config['variants'] ?? null) ? $config['variants'] : [],
        );
    }

    public function isImage(): bool
    {
        return $this->type === 'image';
    }

    public function isPrivate(): bool
    {
        return $this->visibility === 'private' || $this->disk === 'local';
    }

    /**
     * @return array<int, string>
     */
    public function validationRules(bool $required = true): array
    {
        $extensions = implode(',', $this->allowedExtensions);

        return array_values(array_filter([
            $required ? 'required' : 'nullable',
            'file',
            $this->isImage() ? 'image' : null,
            $extensions !== '' ? 'mimes:'.$extensions : null,
            'max:'.$this->maxUploadKilobytes,
        ]));
    }

    /**
     * Human-readable upload guidance for admin forms.
     */
    public function uploadHint(): string
    {
        if (! $this->isImage()) {
            $extensions = strtoupper(implode(', ', $this->allowedExtensions));

            return "Allowed: {$extensions}. Max {$this->maxUploadKilobytes} KB.";
        }

        $primary = $this->primaryVariant();
        $size = $primary
            ? "{$primary['width']} × {$primary['height']} px"
            : 'configured variants';

        $ratio = $this->aspectRatio ? " ({$this->aspectRatio})" : '';

        return "Target {$size}{$ratio}. Larger uploads are cropped/resized automatically. Max {$this->maxUploadKilobytes} KB.";
    }

    /**
     * @return array{width: int, height: int}|null
     */
    public function primaryVariant(): ?array
    {
        if ($this->variants === []) {
            return null;
        }

        $preferred = ['hero', 'hero_ultra', 'hero_md', 'detail', 'display', 'card', 'thumb'];

        foreach ($preferred as $name) {
            if (isset($this->variants[$name])) {
                return [
                    'width' => (int) $this->variants[$name]['width'],
                    'height' => (int) $this->variants[$name]['height'],
                ];
            }
        }

        $first = reset($this->variants);

        return [
            'width' => (int) $first['width'],
            'height' => (int) $first['height'],
        ];
    }
}
