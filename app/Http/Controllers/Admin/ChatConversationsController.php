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

class ChatConversationsController extends Controller
{
    public function index(ChatConversationIndexRequest $request): JsonResponse
    {
        return response()->json(ChatPresenter::forAdminIndex($request));
    }

    public function show(ChatConversation $chatConversation): JsonResponse
    {
        return response()->json(ChatPresenter::forAdminShow($chatConversation));
    }

    public function storeMessage(
        StoreAdminChatMessageRequest $request,
        ChatConversation $chatConversation,
        SendAdminChatMessageAction $action,
    ): JsonResponse {
        $action->handle($chatConversation, $request->user(), $request->messageText());

        return response()->json(ChatPresenter::forAdminShow($chatConversation->fresh()));
    }

    public function markRead(
        ChatConversation $chatConversation,
        MarkChatConversationReadAction $action,
    ): JsonResponse {
        $action->handle($chatConversation);

        return response()->json(ChatPresenter::forAdminShow($chatConversation->fresh()));
    }

    public function update(
        UpdateChatConversationRequest $request,
        ChatConversation $chatConversation,
        UpdateChatConversationStatusAction $action,
    ): JsonResponse {
        $action->handle(
            $chatConversation,
            $request->status(),
            $request->assignedToId(),
        );

        return response()->json(ChatPresenter::forAdminShow($chatConversation->fresh()));
    }

    public function typing(ChatConversation $chatConversation): JsonResponse
    {
        if ($chatConversation->isOpen()) {
            ChatTypingIndicator::record($chatConversation->id, ChatSenderType::Staff);
        }

        return response()->json(['ok' => true]);
    }
}
