<?php

namespace Database\Factories;

use App\Enums\ChatConversationStatus;
use App\Models\ChatConversation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ChatConversation>
 */
class ChatConversationFactory extends Factory
{
    protected $model = ChatConversation::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'visitor_token' => bin2hex(random_bytes(32)),
            'status' => ChatConversationStatus::Open,
            'assigned_to' => null,
            'last_message_at' => now(),
        ];
    }

    public function closed(): static
    {
        return $this->state(fn (): array => [
            'status' => ChatConversationStatus::Closed,
        ]);
    }
}
