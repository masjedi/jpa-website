<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ChatSenderType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ChatConversationIndexRequest;
use App\Http\Requests\Admin\StoreAdminChatMessageRequest;
use App\Http\Requests\Admin\UpdateChatConversationRequest;
use App\Models\ChatConversation;
use App\Support\Chat\ChatPresenter;
use App\Support\Chat\ChatTypingIndicator;
use App\Support\Chat\MarkChatConversationReadAction;
use App\Support\Chat\SendAdminChatMessageAction;
use App\Support\Chat\UpdateChatConversationStatusAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ChatConversationsController extends Controller
{
    public function index(ChatConversationIndexRequest $request): Response
    {
        return Inertia::render('admin/ChatConversations', ChatPresenter::forAdminIndex($request));
    }

    public function show(ChatConversation $chatConversation): Response
    {
        return Inertia::render('admin/ChatConversationDetail', ChatPresenter::forAdminShow($chatConversation));
    }

    public function storeMessage(
        StoreAdminChatMessageRequest $request,
        ChatConversation $chatConversation,
        SendAdminChatMessageAction $action,
    ): RedirectResponse {
        $action->handle($chatConversation, $request->user(), $request->messageText());

        return redirect()
            ->route('admin.chat.show', $chatConversation)
            ->with('success', 'Reply sent.');
    }

    public function markRead(
        ChatConversation $chatConversation,
        MarkChatConversationReadAction $action,
    ): RedirectResponse {
        $action->handle($chatConversation);

        return redirect()
            ->route('admin.chat.show', $chatConversation)
            ->with('success', 'Conversation marked as read.');
    }

    public function update(
        UpdateChatConversationRequest $request,
        ChatConversation $chatConversation,
        UpdateChatConversationStatusAction $action,
    ): RedirectResponse {
        $action->handle(
            $chatConversation,
            $request->status(),
            $request->assignedToId(),
        );

        $label = $request->status()->frontendLabel();

        return redirect()
            ->route('admin.chat.show', $chatConversation)
            ->with('success', "Conversation marked as {$label}.");
    }

    public function typing(ChatConversation $chatConversation): JsonResponse
    {
        if ($chatConversation->isOpen()) {
            ChatTypingIndicator::record($chatConversation->id, ChatSenderType::Staff);
        }

        return response()->json(['ok' => true]);
    }
}
