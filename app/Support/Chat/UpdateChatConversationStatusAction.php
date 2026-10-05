<?php

namespace App\Support\Chat;

use App\Enums\ChatConversationStatus;
use App\Models\ChatConversation;

class UpdateChatConversationStatusAction
{
    public function handle(ChatConversation $conversation, ChatConversationStatus $status, ?int $assignedTo): ChatConversation
    {
        $conversation->update([
            'status' => $status,
            'assigned_to' => $assignedTo,
        ]);

        return $conversation->fresh(['assignedTo:id,name']);
    }
}
