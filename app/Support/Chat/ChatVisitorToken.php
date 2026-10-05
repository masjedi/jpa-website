<?php

namespace App\Support\Chat;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class ChatVisitorToken
{
    public const COOKIE_NAME = 'jpa_chat_visitor';

    public static function fromRequest(Request $request): string
    {
        $token = (string) $request->cookie(self::COOKIE_NAME, '');

        if ($token !== '' && self::isValidFormat($token)) {
            return $token;
        }

        return self::generate();
    }

    public static function generate(): string
    {
        return bin2hex(random_bytes(32));
    }

    public static function isValidFormat(string $token): bool
    {
        return strlen($token) === 64 && ctype_xdigit($token);
    }

    public static function queueCookie(string $token): void
    {
        Cookie::queue(Cookie::make(
            name: self::COOKIE_NAME,
            value: $token,
            minutes: 60 * 24 * 365,
            path: '/',
            secure: request()->isSecure(),
            httpOnly: true,
            raw: false,
            sameSite: 'lax',
        ));
    }
}
