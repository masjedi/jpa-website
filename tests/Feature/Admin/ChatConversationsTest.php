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

    public function test_authenticated_admin_can_view_paginated_chat_index(): void
    {
        $user = User::factory()->create();
        ChatConversation::factory()->count(16)->create();

        $this->actingAs($user)
            ->get('/admin/chat')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/ChatConversations')
                ->has('conversations.data', 15)
                ->missing('conversations.data.0.visitorToken'));
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
            ->post("/admin/chat/{$conversation->id}/messages", [
                'message' => 'Thanks for reaching out.',
            ])
            ->assertRedirect(route('admin.chat.show', $conversation))
            ->assertSessionHas('success');

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
            ->patch("/admin/chat/{$conversation->id}", [
                'status' => ChatConversationStatus::Closed->value,
                'assigned_to' => $user->id,
            ])
            ->assertRedirect(route('admin.chat.show', $conversation));

        $conversation->refresh();
        $this->assertSame(ChatConversationStatus::Closed, $conversation->status);
        $this->assertSame($user->id, $conversation->assigned_to);

        $this->actingAs($user)
            ->patch("/admin/chat/{$conversation->id}", [
                'status' => ChatConversationStatus::Open->value,
                'assigned_to' => '',
            ])
            ->assertRedirect(route('admin.chat.show', $conversation));

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
            ->patch("/admin/chat/{$conversation->id}/read")
            ->assertRedirect(route('admin.chat.show', $conversation));

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
            ->get("/admin/chat/{$conversation->id}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/ChatConversationDetail')
                ->where('conversation.visitorTyping', false));

        $this->actingAs($user)
            ->postJson("/admin/chat/{$conversation->id}/typing")
            ->assertOk();

        $this->actingAs($user)
            ->get("/admin/chat/{$conversation->id}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('conversation.visitorTyping', false));

        // Staff typing should not appear as visitor typing.
        ChatTypingIndicator::record($conversation->id, ChatSenderType::Visitor);

        $this->actingAs($user)
            ->get("/admin/chat/{$conversation->id}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('conversation.visitorTyping', true));
    }
}
