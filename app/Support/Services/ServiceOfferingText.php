<?php

namespace App\Support\Services;

final class ServiceOfferingText
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
