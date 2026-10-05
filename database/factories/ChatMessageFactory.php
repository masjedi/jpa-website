<?php

namespace Database\Factories;

use App\Enums\ChatSenderType;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ChatMessage>
 */
class ChatMessageFactory extends Factory
{
    protected $model = ChatMessage::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'conversation_id' => ChatConversation::factory(),
            'sender_type' => ChatSenderType::Visitor,
            'sender_id' => null,
            'message' => fake()->sentence(),
            'read_at' => null,
        ];
    }

    public function fromStaff(): static
    {
        return $this->state(fn (): array => [
            'sender_type' => ChatSenderType::Staff,
        ]);
    }

    public function read(): static
    {
        return $this->state(fn (): array => [
            'read_at' => now(),
        ]);
    }
}
