<?php

namespace App\Support\EmergencyContacts;

final class EmergencyContactOptions
{
    public const PHONE_REGEX = '/^\+[1-9][\d\s().\-]{6,20}$/';

    public const STATUS_ACTIVE = 'Active';

    public const STATUS_INACTIVE = 'Inactive';

    /**
     * @return list<string>
     */
    public static function statusLabels(): array
    {
        return [self::STATUS_ACTIVE, self::STATUS_INACTIVE];
    }
}
