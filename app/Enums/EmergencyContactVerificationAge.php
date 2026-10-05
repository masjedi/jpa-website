<?php

namespace App\Enums;

use DateTimeInterface;
use Illuminate\Support\Carbon;

enum EmergencyContactVerificationAge: string
{
    case Recent = 'recent';
    case Aging = 'aging';
    case Stale = 'stale';

    public static function fromVerifiedAt(DateTimeInterface $verifiedAt, ?DateTimeInterface $now = null): self
    {
        $verified = Carbon::parse($verifiedAt)->startOfDay();
        $reference = Carbon::parse($now ?? now())->startOfDay();

        if ($verified->greaterThanOrEqualTo($reference->copy()->subMonthsNoOverflow(3))) {
            return self::Recent;
        }

        if ($verified->greaterThanOrEqualTo($reference->copy()->subMonthsNoOverflow(6))) {
            return self::Aging;
        }

        return self::Stale;
    }

    public function frontendLabel(): string
    {
        return match ($this) {
            self::Recent => 'Recently verified',
            self::Aging => 'Verification aging',
            self::Stale => 'Verification overdue',
        };
    }
}
