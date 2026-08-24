<?php

namespace App\Support\Media;

use Illuminate\Http\UploadedFile;

/**
 * Thin module helper — all rules live in config/media.php profiles.
 */
class BrandLogoImage
{
    public function __construct(private readonly MediaProcessor $processor) {}

    public function store(UploadedFile $file): MediaAsset
    {
        return $this->processor->store($file, 'brand_logo');
    }

    public function replace(UploadedFile $file, ?MediaAsset $existing = null): MediaAsset
    {
        return $this->processor->replace($file, 'brand_logo', $existing);
    }

    public function delete(MediaAsset $asset): void
    {
        $this->processor->delete($asset);
    }

    /**
     * @return array{width: int, height: int, aspect_ratio: string|null, max_upload_kilobytes: int, hint: string}
     */
    public static function spec(): array
    {
        $profile = MediaProfile::fromConfig('brand_logo');
        $primary = $profile->primaryVariant() ?? ['width' => 0, 'height' => 0];

        return [
            'width' => $primary['width'],
            'height' => $primary['height'],
            'aspect_ratio' => $profile->aspectRatio,
            'max_upload_kilobytes' => $profile->maxUploadKilobytes,
            'hint' => $profile->uploadHint(),
        ];
    }

    /**
     * @return array<int, string>
     */
    public static function validationRules(bool $required = true): array
    {
        return MediaProfile::fromConfig('brand_logo')->validationRules($required);
    }
}
