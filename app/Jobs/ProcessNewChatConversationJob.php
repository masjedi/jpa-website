<?php

namespace App\Jobs;

use App\Mail\NewChatConversationForTeam;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ProcessNewChatConversationJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /**
     * @var list<int>
     */
    public array $backoff = [10, 30, 60];

    public function __construct(
        public ChatConversation $conversation,
        public ChatMessage $message,
    ) {
        $this->afterCommit();
    }

    public function handle(): void
    {
        Mail::send(new NewChatConversationForTeam($this->conversation, $this->message));
    }

    public function failed(?Throwable $exception): void
    {
        Log::error('Failed to send new chat conversation email.', [
            'conversation_id' => $this->conversation->id,
            'message_id' => $this->message->id,
            'error' => $exception?->getMessage(),
        ]);
    }
}
