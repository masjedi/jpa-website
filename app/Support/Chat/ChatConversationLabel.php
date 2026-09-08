<?php

namespace App\Support\Chat;

use App\Models\ChatConversation;

class ChatConversationLabel
{
    public static function forConversation(ChatConversation $conversation): string
    {
        $code = strtoupper(substr(hash('sha256', (string) $conversation->id), 0, 4));

        return "Visitor #{$code}";
    }
}
