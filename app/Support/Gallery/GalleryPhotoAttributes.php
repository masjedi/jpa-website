<?php

namespace App\Support\Gallery;

use App\Enums\GalleryPhotoStatus;
use App\Support\Translatable;

final class GalleryPhotoAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated): array
    {
        return [
            'status' => GalleryPhotoStatus::fromFrontend((string) $validated['status']),
            'alt' => Translatable::sanitize(
                is_array($validated['alt']) ? $validated['alt'] : Translatable::normalize((string) $validated['alt']),
            ),
            'caption' => Translatable::sanitize(
                is_array($validated['caption'])
                    ? $validated['caption']
                    : Translatable::normalize((string) $validated['caption']),
            ),
            'sort_order' => isset($validated['sort_order'])
                ? (int) $validated['sort_order']
                : 0,
        ];
    }
}
