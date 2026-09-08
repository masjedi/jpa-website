<?php

namespace App\Support\Chat;

use App\Enums\ChatSenderType;
use App\Http\Requests\Admin\ChatConversationIndexRequest;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ChatPresenter
{
    public const PUBLIC_INITIAL_LIMIT = 25;

    /**
     * @return array<string, mixed>
     */
    public static function forAdminIndex(ChatConversationIndexRequest $request): array
    {
        $filters = $request->filters();
        $table = (new ChatConversation)->getTable();

        $conversations = ChatConversation::query()
            ->select([
                "{$table}.id",
                "{$table}.status",
                "{$table}.assigned_to",
                "{$table}.last_message_at",
                "{$table}.created_at",
            ])
            ->with([
                'assignedTo:id,name',
                'latestMessage' => fn ($query) => $query->select([
                    'chat_messages.id',
                    'chat_messages.conversation_id',
                    'chat_messages.message',
                    'chat_messages.sender_type',
                    'chat_messages.created_at',
                ]),
            ])
            ->withCount([
                'messages as unread_count' => fn (Builder $query): Builder => $query
                    ->where('sender_type', ChatSenderType::Visitor)
                    ->whereNull('read_at'),
            ])
            ->when($filters['search'] !== '', function (Builder $query) use ($filters): void {
                if (preg_match('/^visitor\s*#?([a-f0-9]{4})$/i', $filters['search'], $matches) === 1) {
                    $code = strtoupper($matches[1]);
                    $query->whereRaw(
                        'UPPER(SUBSTRING(SHA2(CONCAT(?, id), 256), 1, 4)) = ?',
                        ['', $code],
                    );

                    return;
                }

                $like = '%'.str_replace(['%', '_'], ['\\%', '\\_'], $filters['search']).'%';
                $query->whereHas('latestMessage', fn (Builder $messageQuery): Builder => $messageQuery->where('message', 'like', $like));
            })
            ->when($filters['status'] !== null, fn (Builder $query): Builder => $query->where("{$table}.status", $filters['status']))
            ->when($filters['assigned_to'] !== null, fn (Builder $query): Builder => $query->where("{$table}.assigned_to", $filters['assigned_to']))
            ->when($filters['unread_only'], fn (Builder $query): Builder => $query->whereHas(
                'messages',
                fn (Builder $messageQuery): Builder => $messageQuery
                    ->where('sender_type', ChatSenderType::Visitor)
                    ->whereNull('read_at'),
            ))
            ->orderByDesc("{$table}.last_message_at")
            ->orderByDesc("{$table}.id")
            ->paginate(15)
            ->withQueryString()
            ->through(fn (ChatConversation $conversation): array => self::adminListRow($conversation));

        return [
            'conversations' => $conversations,
            'filters' => [
                'search' => $filters['search'],
                'status' => $filters['status']?->value ?? '',
                'assigned_to' => $filters['assigned_to'] !== null ? (string) $filters['assigned_to'] : '',
                'unread_only' => $filters['unread_only'] ? '1' : '',
            ],
            'statusOptions' => ChatOptions::statusLabels(),
            'staffOptions' => self::staffOptions(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function forAdminShow(ChatConversation $conversation): array
    {
        $conversation->load([
            'assignedTo:id,name',
            'messages' => fn ($query) => $query
                ->with('sender:id,name')
                ->orderBy('id')
                ->limit(100),
        ]);

        return [
            'conversation' => self::adminDetail($conversation),
            'staffOptions' => self::staffOptions(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicConversationPayload(?ChatConversation $conversation): array
    {
        if ($conversation === null) {
            return [
                'hasConversation' => false,
                'status' => null,
                'isClosed' => false,
            ];
        }

        return [
            'hasConversation' => true,
            'status' => $conversation->status->value,
            'isClosed' => ! $conversation->isOpen(),
        ];
    }

    /**
     * @param  Collection<int, ChatMessage>  $messages
     * @return list<array<string, mixed>>
     */
    public static function publicMessages(Collection $messages): array
    {
        return $messages
            ->map(fn (ChatMessage $message): array => self::publicMessage($message))
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicMessage(ChatMessage $message): array
    {
        return [
            'id' => $message->id,
            'body' => (string) $message->message,
            'sender' => $message->sender_type === ChatSenderType::Staff ? 'staff' : 'visitor',
            'createdAt' => $message->created_at?->toIso8601String() ?? '',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function adminListRow(ChatConversation $conversation): array
    {
        $preview = (string) ($conversation->latestMessage?->message ?? '');

        return [
            'id' => $conversation->id,
            'visitorLabel' => ChatConversationLabel::forConversation($conversation),
            'lastMessagePreview' => self::preview($preview),
            'lastActivityAt' => $conversation->last_message_at?->timezone(config('app.timezone'))->format('j M Y, g:i A') ?? '',
            'lastActivityIso' => $conversation->last_message_at?->toIso8601String() ?? '',
            'unreadCount' => (int) ($conversation->unread_count ?? 0),
            'status' => $conversation->status->frontendLabel(),
            'statusValue' => $conversation->status->value,
            'assignedToName' => (string) ($conversation->assignedTo?->name ?? ''),
            'assignedToId' => $conversation->assigned_to,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function adminDetail(ChatConversation $conversation): array
    {
        return [
            'id' => $conversation->id,
            'visitorLabel' => ChatConversationLabel::forConversation($conversation),
            'status' => $conversation->status->frontendLabel(),
            'statusValue' => $conversation->status->value,
            'assignedToId' => $conversation->assigned_to,
            'assignedToName' => (string) ($conversation->assignedTo?->name ?? ''),
            'lastActivityAt' => $conversation->last_message_at?->timezone(config('app.timezone'))->format('j M Y, g:i A') ?? '',
            'unreadCount' => $conversation->unreadVisitorMessageCount(),
            'visitorTyping' => ChatTypingIndicator::isTyping($conversation->id, ChatSenderType::Visitor),
            'messages' => $conversation->messages
                ->map(fn (ChatMessage $message): array => self::adminMessage($message))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function adminMessage(ChatMessage $message): array
    {
        return [
            'id' => $message->id,
            'body' => (string) $message->message,
            'senderType' => $message->sender_type->value,
            'senderLabel' => $message->sender_type === ChatSenderType::Staff
                ? (string) ($message->sender?->name ?? 'Staff')
                : 'Visitor',
            'isRead' => $message->read_at !== null,
            'createdAt' => $message->created_at?->timezone(config('app.timezone'))->format('j M Y, g:i A') ?? '',
        ];
    }

    private static function preview(string $message): string
    {
        $trimmed = trim($message);

        if ($trimmed === '') {
            return 'No messages yet';
        }

        return mb_strlen($trimmed) > 80 ? mb_substr($trimmed, 0, 77).'…' : $trimmed;
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    private static function staffOptions(): array
    {
        return User::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (User $user): array => [
                'id' => $user->id,
                'name' => (string) $user->name,
            ])
            ->all();
    }
}
