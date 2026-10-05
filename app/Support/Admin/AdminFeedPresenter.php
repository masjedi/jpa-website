<?php

namespace App\Support\Admin;

use App\Models\AdminNotification;
use App\Models\Inquiry;

class AdminFeedPresenter
{
    /**
     * @return array{
     *     notifications: list<array<string, mixed>>,
     *     messages: list<array<string, mixed>>,
     *     unreadNotifications: int,
     *     unreadMessages: int
     * }
     */
    public static function forNavbar(int $limit = 8): array
    {
        $notifications = AdminNotification::query()
            ->latestFirst()
            ->limit($limit)
            ->get()
            ->map(fn (AdminNotification $notification): array => self::notificationItem($notification))
            ->values()
            ->all();

        $messages = Inquiry::query()
            ->latestFirst()
            ->limit($limit)
            ->get()
            ->map(fn (Inquiry $inquiry): array => self::messageItem($inquiry))
            ->values()
            ->all();

        return [
            'notifications' => $notifications,
            'messages' => $messages,
            'unreadNotifications' => AdminNotification::query()->whereNull('read_at')->count(),
            'unreadMessages' => Inquiry::query()->whereNull('read_at')->count(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function notificationItem(AdminNotification $notification): array
    {
        return [
            'id' => (string) $notification->id,
            'title' => (string) $notification->title,
            'description' => (string) $notification->description,
            'time' => $notification->created_at?->diffForHumans() ?? '',
            'href' => $notification->href,
            'unread' => $notification->isUnread(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function messageItem(Inquiry $inquiry): array
    {
        $description = filled($inquiry->message)
            ? (string) $inquiry->message
            : (string) ($inquiry->subject ?: $inquiry->source->frontendLabel());

        return [
            'id' => (string) $inquiry->id,
            'title' => (string) $inquiry->name,
            'description' => \Illuminate\Support\Str::limit($description, 120),
            'time' => $inquiry->created_at?->diffForHumans() ?? '',
            'href' => '/admin/inquiries',
            'unread' => $inquiry->isUnread(),
        ];
    }
}
