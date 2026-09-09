<?php

namespace App\Enums;

enum LegalPageKey: string
{
    case Privacy = 'privacy';
    case Terms = 'terms';

    public function label(): string
    {
        return match ($this) {
            self::Privacy => 'Privacy Policy',
            self::Terms => 'Terms and Conditions',
        };
    }
}
