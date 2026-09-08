<?php

namespace App\Support\Chat;

use App\Enums\ChatSenderType;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SendAdminChatMessageAction
{
    public function handle(ChatConversation $conversation, User $user, string $message): ChatMessage
    {
        if (! $conversation->isOpen()) {
            throw ValidationException::withMessages([
                'message' => 'Reopen this conversation before sending a reply.',
            ]);
        }

        return DB::transaction(function () use ($conversation, $user, $message): ChatMessage {
            $chatMessage = $conversation->messages()->create([
                'sender_type' => ChatSenderType::Staff,
                'sender_id' => $user->id,
                'message' => $message,
                'read_at' => now(),
            ]);

            $conversation->update([
                'last_message_at' => $chatMessage->created_at,
            ]);

            ChatTypingIndicator::clear($conversation->id, ChatSenderType::Staff);

            return $chatMessage;
        });
    }
}
