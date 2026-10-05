<?php

namespace Tests\Unit;

use App\Enums\EmergencyContactVerificationAge;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class EmergencyContactVerificationAgeTest extends TestCase
{
    public function test_recent_aging_and_stale_windows(): void
    {
        $now = Carbon::parse('2026-08-27');

        $this->assertSame(
            EmergencyContactVerificationAge::Recent,
            EmergencyContactVerificationAge::fromVerifiedAt($now->copy()->subMonthsNoOverflow(3), $now),
        );
        $this->assertSame(
            EmergencyContactVerificationAge::Aging,
            EmergencyContactVerificationAge::fromVerifiedAt($now->copy()->subMonthsNoOverflow(3)->subDay(), $now),
        );
        $this->assertSame(
            EmergencyContactVerificationAge::Aging,
            EmergencyContactVerificationAge::fromVerifiedAt($now->copy()->subMonthsNoOverflow(6), $now),
        );
        $this->assertSame(
            EmergencyContactVerificationAge::Stale,
            EmergencyContactVerificationAge::fromVerifiedAt($now->copy()->subMonthsNoOverflow(6)->subDay(), $now),
        );
    }
}
