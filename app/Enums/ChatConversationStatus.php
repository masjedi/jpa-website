<?php

namespace App\Enums;

enum ChatConversationStatus: string
{
    case Open = 'open';
    case Closed = 'closed';

    public function frontendLabel(): string
    {
        return match ($this) {
            self::Open => 'Open',
            self::Closed => 'Closed',
        };
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
