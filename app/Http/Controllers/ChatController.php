<?php

namespace App\Http\Controllers;

use App\Enums\ChatSenderType;
use App\Http\Requests\ChatMessageIndexRequest;
use App\Http\Requests\StoreChatMessageRequest;
use App\Models\ChatConversation;
use App\Support\Chat\ChatPresenter;
use App\Support\Chat\ChatTypingIndicator;
use App\Support\Chat\SendVisitorChatMessageAction;
use Illuminate\Http\JsonResponse;

class ChatController extends Controller
{
    public function index(ChatMessageIndexRequest $request): JsonResponse
    {
        $visitorToken = (string) $request->attributes->get('chat_visitor_token');
        $conversation = ChatConversation::query()
            ->where('visitor_token', $visitorToken)
            ->first();

        if ($conversation === null) {
            return response()->json([
                'conversation' => ChatPresenter::publicConversationPayload(null),
                'messages' => [],
                'staffTyping' => false,
            ]);
        }

        $afterId = $request->afterId();
        $messagesQuery = $conversation->messages()->orderBy('id');

        if ($afterId !== null) {
            $messages = $messagesQuery
                ->where('id', '>', $afterId)
                ->limit(50)
                ->get();
        } else {
            $messages = $messagesQuery
                ->orderByDesc('id')
                ->limit(ChatPresenter::PUBLIC_INITIAL_LIMIT)
                ->get()
                ->sortBy('id')
                ->values();
        }

        return response()->json([
            'conversation' => ChatPresenter::publicConversationPayload($conversation),
            'messages' => ChatPresenter::publicMessages($messages),
            'staffTyping' => ChatTypingIndicator::isTyping($conversation->id, ChatSenderType::Staff),
        ]);
    }

    public function store(
        StoreChatMessageRequest $request,
        SendVisitorChatMessageAction $action,
    ): JsonResponse {
        $visitorToken = (string) $request->attributes->get('chat_visitor_token');

        $result = $action->handle($visitorToken, $request->messageText());

        return response()->json([
            'conversation' => ChatPresenter::publicConversationPayload($result['conversation']),
            'message' => ChatPresenter::publicMessage($result['message']),
            'staffTyping' => ChatTypingIndicator::isTyping($result['conversation']->id, ChatSenderType::Staff),
        ], 201);
    }

    public function typing(): JsonResponse
    {
        $visitorToken = (string) request()->attributes->get('chat_visitor_token');
        $conversation = ChatConversation::query()
            ->where('visitor_token', $visitorToken)
            ->first();

        if ($conversation === null || ! $conversation->isOpen()) {
            return response()->json(['ok' => true]);
        }

        ChatTypingIndicator::record($conversation->id, ChatSenderType::Visitor);

        return response()->json(['ok' => true]);
    }
}
