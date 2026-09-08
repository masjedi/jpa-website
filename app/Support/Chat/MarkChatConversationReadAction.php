<?php

namespace App\Support\Chat;

use App\Enums\ChatSenderType;
use App\Models\ChatConversation;

class MarkChatConversationReadAction
{
    public function handle(ChatConversation $conversation): int
    {
        return $conversation->messages()
            ->where('sender_type', ChatSenderType::Visitor)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}
