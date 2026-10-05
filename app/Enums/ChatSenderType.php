<?php

namespace App\Enums;

enum ChatSenderType: string
{
    case Visitor = 'visitor';
    case Staff = 'staff';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
