<?php

namespace App\Support\Chat;

use App\Enums\ChatSenderType;
use Illuminate\Support\Facades\Cache;

class ChatTypingIndicator
{
    public const TTL_SECONDS = 5;

    public static function record(int $conversationId, ChatSenderType $sender): void
    {
        Cache::put(
            self::cacheKey($conversationId, $sender),
            true,
            now()->addSeconds(self::TTL_SECONDS),
        );
    }

    public static function isTyping(int $conversationId, ChatSenderType $sender): bool
    {
        return Cache::get(self::cacheKey($conversationId, $sender), false) === true;
    }

    public static function clear(int $conversationId, ChatSenderType $sender): void
    {
        Cache::forget(self::cacheKey($conversationId, $sender));
    }

    private static function cacheKey(int $conversationId, ChatSenderType $sender): string
    {
        return "chat_typing:{$conversationId}:{$sender->value}";
    }
}
