<?php

namespace Tests\Feature\Admin;

use App\Enums\ChatConversationStatus;
use App\Enums\ChatSenderType;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\User;
use App\Support\Chat\ChatTypingIndicator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatConversationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_admin_chat_routes(): void
    {
        $conversation = ChatConversation::factory()->create();

        $this->get('/admin/chat')->assertRedirect(route('admin.login'));
        $this->get("/admin/chat/{$conversation->id}")->assertRedirect(route('admin.login'));
        $this->post("/admin/chat/{$conversation->id}/messages", ['message' => 'Hi'])
            ->assertRedirect(route('admin.login'));
        $this->post("/admin/chat/{$conversation->id}/typing")
            ->assertRedirect(route('admin.login'));
        $this->patch("/admin/chat/{$conversation->id}", ['status' => 'closed'])
            ->assertRedirect(route('admin.login'));
    }

    public function test_authenticated_admin_can_fetch_chat_index_as_json(): void
    {
        $user = User::factory()->create();
        ChatConversation::factory()->create();

        $this->actingAs($user)
            ->getJson('/admin/chat')
            ->assertOk()
            ->assertJsonStructure(['conversations' => ['data']]);
    }

    public function test_authenticated_admin_can_fetch_paginated_chat_index_without_json_accept(): void
    {
        $user = User::factory()->create();
        ChatConversation::factory()->count(16)->create();

        $this->actingAs($user)
            ->get('/admin/chat')
            ->assertOk()
            ->assertJsonCount(15, 'conversations.data')
            ->assertJsonMissingPath('conversations.data.0.visitorToken');
    }

    public function test_admin_can_reply_to_open_conversation(): void
    {
        $user = User::factory()->create();
        $conversation = ChatConversation::factory()->create();
        ChatMessage::factory()->create([
            'conversation_id' => $conversation->id,
            'message' => 'Visitor question',
        ]);

        $this->actingAs($user)
            ->postJson("/admin/chat/{$conversation->id}/messages", [
                'message' => 'Thanks for reaching out.',
            ])
            ->assertOk()
            ->assertJsonPath('conversation.id', $conversation->id);

        $this->assertDatabaseHas('chat_messages', [
            'conversation_id' => $conversation->id,
            'sender_type' => ChatSenderType::Staff->value,
            'sender_id' => $user->id,
            'message' => 'Thanks for reaching out.',
        ]);
    }

    public function test_admin_can_close_and_reopen_conversation(): void
    {
        $user = User::factory()->create();
        $conversation = ChatConversation::factory()->create();

        $this->actingAs($user)
            ->patchJson("/admin/chat/{$conversation->id}", [
                'status' => ChatConversationStatus::Closed->value,
                'assigned_to' => $user->id,
            ])
            ->assertOk()
            ->assertJsonPath('conversation.statusValue', ChatConversationStatus::Closed->value);

        $conversation->refresh();
        $this->assertSame(ChatConversationStatus::Closed, $conversation->status);
        $this->assertSame($user->id, $conversation->assigned_to);

        $this->actingAs($user)
            ->patchJson("/admin/chat/{$conversation->id}", [
                'status' => ChatConversationStatus::Open->value,
                'assigned_to' => '',
            ])
            ->assertOk()
            ->assertJsonPath('conversation.statusValue', ChatConversationStatus::Open->value);

        $conversation->refresh();
        $this->assertSame(ChatConversationStatus::Open, $conversation->status);
        $this->assertNull($conversation->assigned_to);
    }

    public function test_admin_can_mark_visitor_messages_as_read(): void
    {
        $user = User::factory()->create();
        $conversation = ChatConversation::factory()->create();
        ChatMessage::factory()->create([
            'conversation_id' => $conversation->id,
            'read_at' => null,
        ]);

        $this->actingAs($user)
            ->patchJson("/admin/chat/{$conversation->id}/read")
            ->assertOk();

        $this->assertSame(0, ChatMessage::query()->whereNull('read_at')->count());
    }

    public function test_admin_typing_is_reflected_on_conversation_show(): void
    {
        $user = User::factory()->create();
        $conversation = ChatConversation::factory()->create();

        $this->actingAs($user)
            ->postJson("/admin/chat/{$conversation->id}/typing")
            ->assertOk()
            ->assertJson(['ok' => true]);

        $this->actingAs($user)
            ->getJson("/admin/chat/{$conversation->id}")
            ->assertOk()
            ->assertJsonPath('conversation.visitorTyping', false);

        $this->actingAs($user)
            ->postJson("/admin/chat/{$conversation->id}/typing")
            ->assertOk();

        $this->actingAs($user)
            ->getJson("/admin/chat/{$conversation->id}")
            ->assertOk()
            ->assertJsonPath('conversation.visitorTyping', false);

        ChatTypingIndicator::record($conversation->id, ChatSenderType::Visitor);

        $this->actingAs($user)
            ->getJson("/admin/chat/{$conversation->id}")
            ->assertOk()
            ->assertJsonPath('conversation.visitorTyping', true);
    }
}
