<?php

namespace App\Support\Media;

use Illuminate\Http\UploadedFile;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Thin module helper — all rules live in config/media.php profiles.
 */
class DocumentAttachment
{
    public const PROFILE = 'document_attachment';

    public const MAX_FILES = 12;

    public function __construct(private readonly MediaProcessor $processor) {}

    public function store(UploadedFile $file): MediaAsset
    {
        return $this->processor->store($file, self::PROFILE);
    }

    public function delete(MediaAsset $asset): void
    {
        $this->processor->delete($asset);
    }

    public function download(MediaAsset $asset): StreamedResponse
    {
        return $this->processor->download($asset);
    }

    /**
     * @return array{max_upload_kilobytes: int, max_files: int, accept: string, hint: string}
     */
    public static function spec(): array
    {
        $profile = MediaProfile::fromConfig(self::PROFILE);

        return [
            'max_upload_kilobytes' => $profile->maxUploadKilobytes,
            'max_files' => self::MAX_FILES,
            'accept' => self::acceptAttribute($profile),
            'hint' => $profile->uploadHint(),
        ];
    }

    /**
     * @return array<int, string>
     */
    public static function validationRules(bool $required = true): array
    {
        return MediaProfile::fromConfig(self::PROFILE)->validationRules($required);
    }

    private static function acceptAttribute(MediaProfile $profile): string
    {
        $extensions = array_map(
            fn (string $extension): string => '.'.$extension,
            $profile->allowedExtensions,
        );

        return implode(',', array_merge($profile->allowedMimes, $extensions));
    }
}
