<?php

namespace App\Support\Media;

use RuntimeException;

final class MediaValidationException extends RuntimeException
{
    public static function unsupportedType(): self
    {
        return new self('The uploaded file type is not allowed for this media profile.');
    }

    public static function invalidImage(): self
    {
        return new self('The uploaded file is not a valid image.');
    }

    public static function tooLarge(): self
    {
        return new self('The uploaded file exceeds the maximum allowed size.');
    }

    public static function dimensionsTooLarge(): self
    {
        return new self('The uploaded image exceeds the maximum allowed dimensions.');
    }

    public static function executableRejected(): self
    {
        return new self('Executable files are not allowed.');
    }
}
