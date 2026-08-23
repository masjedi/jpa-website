<?php

namespace App\Support\Destinations;

final class DestinationText
{
    /**
     * @return list<string>
     */
    public static function lines(?string $value): array
    {
        if ($value === null || trim($value) === '') {
            return [];
        }

        return array_values(array_filter(array_map(
            static fn (string $line): string => trim($line),
            preg_split('/\R+/', $value) ?: [],
        )));
    }
}
