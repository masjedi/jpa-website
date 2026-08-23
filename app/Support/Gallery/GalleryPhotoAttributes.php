<?php

namespace App\Support\Gallery;

use App\Enums\GalleryPhotoStatus;

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
            'alt' => (string) $validated['alt'],
            'caption' => (string) $validated['caption'],
            'sort_order' => isset($validated['sort_order'])
                ? (int) $validated['sort_order']
                : 0,
        ];
    }
}
