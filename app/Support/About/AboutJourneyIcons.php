<?php

namespace App\Support\About;

final class AboutJourneyIcons
{
    /**
     * @return list<string>
     */
    public static function keys(): array
    {
        return [
            'compass',
            'users',
            'hand-heart',
            'route',
            'shield-check',
            'map-pinned',
            'file-check-2',
            'handshake',
        ];
    }

    public static function isValid(string $key): bool
    {
        return in_array($key, self::keys(), true);
    }
}
