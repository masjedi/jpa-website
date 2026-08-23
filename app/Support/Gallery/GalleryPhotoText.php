<?php

namespace App\Support\Gallery;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

final class GalleryPhotoText
{
    public static function labelFromFilename(UploadedFile|string $file): string
    {
        $name = $file instanceof UploadedFile
            ? (string) $file->getClientOriginalName()
            : $file;

        $base = pathinfo($name, PATHINFO_FILENAME);

        return Str::headline(str_replace(['_', '-'], ' ', $base));
    }
}
