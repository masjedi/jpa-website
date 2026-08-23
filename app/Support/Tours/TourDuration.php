<?php

namespace App\Support\Tours;

final class TourDuration
{
    public static function label(int $durationDays): string
    {
        if ($durationDays < 1) {
            return 'Custom duration';
        }

        $nights = max($durationDays - 1, 0);

        return sprintf(
            '%d Day%s / %d Night%s',
            $durationDays,
            $durationDays === 1 ? '' : 's',
            $nights,
            $nights === 1 ? '' : 's',
        );
    }
}
