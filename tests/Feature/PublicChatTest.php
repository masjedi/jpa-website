<?php

namespace Tests\Feature;

use App\Enums\ChatSenderType;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Support\Chat\ChatTypingIndicator;
use App\Support\Chat\ChatVisitorToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicChatTest extends TestCase
{
    use RefreshDatabase;

    private function asChatVisitor(string $token): static
    {
        return $this->withCredentials()
            ->withUnencryptedCookie(ChatVisitorToken::COOKIE_NAME, $token);
    }

    public function test_visitor_can_send_first_message_and_conversation_is_created(): void
    {
        $token = bin2hex(random_bytes(32));

        $this->asChatVisitor($token)
            ->postJson('/chat/messages', [
                'message' => 'Hello, I need help planning a trip.',
            ])
            ->assertCreated()
            ->assertJsonPath('message.body', 'Hello, I need help planning a trip.')
            ->assertJsonPath('message.sender', 'visitor')
            ->assertJsonPath('conversation.hasConversation', true)
            ->assertJsonPath('conversation.isClosed', false);

        $this->assertDatabaseCount('chat_conversations', 1);
        $this->assertDatabaseHas('chat_messages', [
            'sender_type' => ChatSenderType::Visitor->value,
            'message' => 'Hello, I need help planning a trip.',
        ]);
    }

    public function test_opening_chat_does_not_create_conversation(): void
    {
        $token = bin2hex(random_bytes(32));

        $this->asChatVisitor($token)
            ->getJson('/chat/messages')
            ->assertOk()
            ->assertJsonPath('conversation.hasConversation', false)
            ->assertJsonCount(0, 'messages');

        $this->assertDatabaseCount('chat_conversations', 0);
    }

    public function test_same_visitor_continues_same_conversation(): void
    {
        $token = bin2hex(random_bytes(32));

        $this->asChatVisitor($token);

        $this->getJson('/chat/messages')
            ->assertOk()
            ->assertJsonPath('conversation.hasConversation', false);

        $this->postJson('/chat/messages', ['message' => 'First message'])
            ->assertCreated();

        $this->assertSame($token, ChatConversation::query()->value('visitor_token'));

        $this->getJson('/chat/messages')
            ->assertOk()
            ->assertJsonPath('conversation.hasConversation', true)
            ->assertJsonCount(1, 'messages');

        $this->postJson('/chat/messages', ['message' => 'Second message'])
            ->assertCreated();

        $conversation = ChatConversation::query()->first();
        $this->assertNotNull($conversation);
        $this->assertSame(2, $conversation->messages()->count());
        $this->assertDatabaseCount('chat_conversations', 1);
    }

    public function test_invalid_message_is_rejected(): void
    {
        $token = bin2hex(random_bytes(32));

        $this->asChatVisitor($token)
            ->postJson('/chat/messages', ['message' => ''])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('message');

        $this->assertDatabaseCount('chat_conversations', 0);
    }

    public function test_visitor_cannot_access_another_visitors_conversation(): void
    {
        $conversation = ChatConversation::factory()->create([
            'visitor_token' => bin2hex(random_bytes(32)),
        ]);

        ChatMessage::factory()->create([
            'conversation_id' => $conversation->id,
            'message' => 'Private message',
        ]);

        $otherToken = bin2hex(random_bytes(32));

        $this->asChatVisitor($otherToken)
            ->getJson('/chat/messages')
            ->assertOk()
            ->assertJsonCount(0, 'messages')
            ->assertJsonPath('conversation.hasConversation', false);
    }

    public function test_after_id_returns_only_newer_messages(): void
    {
        $token = bin2hex(random_bytes(32));
        $conversation = ChatConversation::factory()->create([
            'visitor_token' => $token,
        ]);

        $first = ChatMessage::factory()->create([
            'conversation_id' => $conversation->id,
            'message' => 'First',
            'created_at' => now()->subMinutes(2),
        ]);
        $second = ChatMessage::factory()->create([
            'conversation_id' => $conversation->id,
            'message' => 'Second',
            'created_at' => now()->subMinute(),
        ]);

        $this->asChatVisitor($token)
            ->getJson('/chat/messages?after_id='.$first->id)
            ->assertOk()
            ->assertJsonCount(1, 'messages')
            ->assertJsonPath('messages.0.id', $second->id);
    }

    public function test_closed_conversation_rejects_new_visitor_messages(): void
    {
        $token = bin2hex(random_bytes(32));
        $conversation = ChatConversation::factory()->closed()->create([
            'visitor_token' => $token,
        ]);

        ChatMessage::factory()->create([
            'conversation_id' => $conversation->id,
        ]);

        $this->asChatVisitor($token)
            ->postJson('/chat/messages', ['message' => 'Can I still write?'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('message');
    }

    public function test_message_submission_is_rate_limited(): void
    {
        $token = bin2hex(random_bytes(32));

        for ($attempt = 0; $attempt < 20; $attempt++) {
            $this->asChatVisitor($token)
                ->postJson('/chat/messages', ['message' => "Message {$attempt}"]);
        }

        $this->asChatVisitor($token)
            ->postJson('/chat/messages', ['message' => 'Too many messages'])
            ->assertStatus(429);
    }

    public function test_visitor_typing_is_reflected_in_message_poll(): void
    {
        $token = bin2hex(random_bytes(32));
        $conversation = ChatConversation::factory()->create([
            'visitor_token' => $token,
        ]);

        $this->asChatVisitor($token)
            ->postJson('/chat/typing')
            ->assertOk()
            ->assertJson(['ok' => true]);

        $this->asChatVisitor($token)
            ->getJson('/chat/messages')
            ->assertOk()
            ->assertJsonPath('staffTyping', false);

        ChatTypingIndicator::record($conversation->id, ChatSenderType::Staff);

        $this->asChatVisitor($token)
            ->getJson('/chat/messages')
            ->assertOk()
            ->assertJsonPath('staffTyping', true);
    }

    public function test_visitor_typing_without_conversation_succeeds_silently(): void
    {
        $token = bin2hex(random_bytes(32));

        $this->asChatVisitor($token)
            ->postJson('/chat/typing')
            ->assertOk()
            ->assertJson(['ok' => true]);
    }
}
