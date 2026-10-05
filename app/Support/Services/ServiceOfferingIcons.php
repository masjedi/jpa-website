<?php

namespace App\Support\Services;

final class ServiceOfferingIcons
{
    /**
     * @return list<string>
     */
    public static function keys(): array
    {
        return [
            'users',
            'route',
            'user-check',
            'map-pinned',
            'bus',
            'bed-double',
            'file-check-2',
            'shield-check',
        ];
    }

    public static function isValid(string $key): bool
    {
        return in_array($key, self::keys(), true);
    }
}
