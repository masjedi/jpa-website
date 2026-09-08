<?php

namespace App\Support\Chat;

use App\Enums\ChatConversationStatus;
use App\Enums\ChatSenderType;
use App\Mail\NewChatConversationForTeam;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Support\Admin\AdminNotificationRecorder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class SendVisitorChatMessageAction
{
    /**
     * @return array{conversation: ChatConversation, message: ChatMessage, isFirstMessage: bool}
     */
    public function handle(string $visitorToken, string $message): array
    {
        $result = DB::transaction(function () use ($visitorToken, $message): array {
            $conversation = ChatConversation::query()
                ->where('visitor_token', $visitorToken)
                ->lockForUpdate()
                ->first();

            $isFirstMessage = $conversation === null;

            if ($conversation !== null && ! $conversation->isOpen()) {
                throw ValidationException::withMessages([
                    'message' => 'This conversation is closed. Please start a new visit or contact us through other channels.',
                ]);
            }

            if ($conversation === null) {
                $conversation = ChatConversation::query()->create([
                    'visitor_token' => $visitorToken,
                    'status' => ChatConversationStatus::Open,
                    'last_message_at' => now(),
                ]);
            }

            $chatMessage = $conversation->messages()->create([
                'sender_type' => ChatSenderType::Visitor,
                'sender_id' => null,
                'message' => $message,
            ]);

            $conversation->update([
                'last_message_at' => $chatMessage->created_at,
            ]);

            ChatTypingIndicator::clear($conversation->id, ChatSenderType::Visitor);

            if ($isFirstMessage) {
                AdminNotificationRecorder::forChatConversation($conversation, $chatMessage);
            }

            return [
                'conversation' => $conversation->fresh(),
                'message' => $chatMessage,
                'isFirstMessage' => $isFirstMessage,
            ];
        });

        if ($result['isFirstMessage']) {
            Mail::queue(new NewChatConversationForTeam($result['conversation'], $result['message']));
        }

        return $result;
    }
}
