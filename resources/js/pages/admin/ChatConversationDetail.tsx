import { Link, router, useForm, usePage, usePoll } from '@inertiajs/react';
import { MessageSquareText } from 'lucide-react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { adminFieldClass } from '@/components/admin/adminForm';
import { useDebouncedTypingSignal } from '@/hooks/use-debounced-typing-signal';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import { signalAdminTyping } from '@/lib/chatApi';
import { cn } from '@/lib/utils';
import type { SharedPageProps } from '@/types/inertia';

interface ChatMessageRow {
    id: number;
    body: string;
    senderType: string;
    senderLabel: string;
    isRead: boolean;
    createdAt: string;
}

interface ChatConversationDetailData {
    id: number;
    visitorLabel: string;
    status: string;
    statusValue: string;
    assignedToId: number | null;
    assignedToName: string;
    lastActivityAt: string;
    unreadCount: number;
    visitorTyping: boolean;
    messages: ChatMessageRow[];
}

interface ChatConversationDetailPageProps extends SharedPageProps {
    conversation: ChatConversationDetailData;
    staffOptions: { id: number; name: string }[];
}

function ChatConversationDetailPage() {
    const { conversation, staffOptions } = usePage<ChatConversationDetailPageProps>().props;

    usePoll(5000, {
        only: ['conversation'],
        preserveScroll: true,
    });

    const replyForm = useForm({ message: '' });
    const statusForm = useForm({
        status: conversation.statusValue,
        assigned_to: conversation.assignedToId ? String(conversation.assignedToId) : '',
    });

    useDebouncedTypingSignal(
        replyForm.data.message,
        conversation.statusValue === 'open' && !replyForm.processing,
        () => signalAdminTyping(conversation.id),
    );

    const submitReply = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        replyForm.post(`/admin/chat/${conversation.id}/messages`, {
            preserveScroll: true,
            onSuccess: () => replyForm.reset('message'),
        });
    };

    const submitStatus = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        statusForm.patch(`/admin/chat/${conversation.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-6">
            <AdminSectionHeader
                eyebrow="Messages"
                title={conversation.visitorLabel}
                description={`Last activity ${conversation.lastActivityAt}`}
                icon={MessageSquareText}
                actions={
                    <Link
                        href="/admin/chat"
                        className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted"
                    >
                        Back to list
                    </Link>
                }
            />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <section className="rounded-2xl border border-border/70 bg-card">
                    <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                        <div>
                            <p className="text-sm font-medium text-foreground">{conversation.status}</p>
                            {conversation.unreadCount > 0 ? (
                                <p className="text-xs text-accent">{conversation.unreadCount} unread visitor messages</p>
                            ) : null}
                        </div>
                        {conversation.unreadCount > 0 ? (
                            <button
                                type="button"
                                onClick={() =>
                                    router.patch(`/admin/chat/${conversation.id}/read`, {}, { preserveScroll: true })
                                }
                                className="rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-medium text-secondary"
                            >
                                Mark read
                            </button>
                        ) : null}
                    </div>

                    <div className="max-h-[32rem] space-y-3 overflow-y-auto px-4 py-4">
                        {conversation.messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    'max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words',
                                    message.senderType === 'staff'
                                        ? 'ms-auto bg-secondary/10 text-foreground'
                                        : 'me-auto bg-surface-muted text-foreground',
                                )}
                            >
                                <p className="mb-1 text-[11px] font-medium text-muted-foreground">
                                    {message.senderLabel}
                                </p>
                                <p>{message.body}</p>
                                <p className="mt-1 text-[11px] text-muted-foreground">{message.createdAt}</p>
                            </div>
                        ))}
                        {conversation.visitorTyping ? (
                            <p className="text-xs text-muted-foreground" aria-live="polite">
                                Visitor is typing…
                            </p>
                        ) : null}
                    </div>

                    <form onSubmit={submitReply} className="border-t border-border/60 px-4 py-4">
                        <label className="block space-y-2 text-sm">
                            <span className="font-medium text-foreground">Reply</span>
                            <textarea
                                value={replyForm.data.message}
                                onChange={(event) => replyForm.setData('message', event.target.value)}
                                rows={4}
                                maxLength={2000}
                                disabled={conversation.statusValue === 'closed' || replyForm.processing}
                                className={adminFieldClass}
                                placeholder="Write a reply to the visitor…"
                            />
                        </label>
                        {replyForm.errors.message ? (
                            <p className="mt-2 text-xs text-red-600">{replyForm.errors.message}</p>
                        ) : null}
                        <button
                            type="submit"
                            disabled={conversation.statusValue === 'closed' || replyForm.processing}
                            className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                        >
                            {replyForm.processing ? 'Sending…' : 'Send reply'}
                        </button>
                    </form>
                </section>

                <aside className="space-y-4">
                    <form onSubmit={submitStatus} className="rounded-2xl border border-border/70 bg-card p-4 space-y-4">
                        <h2 className="text-sm font-semibold text-foreground">Conversation settings</h2>
                        <label className="block space-y-1 text-sm">
                            <span className="font-medium text-foreground">Status</span>
                            <select
                                value={statusForm.data.status}
                                onChange={(event) => statusForm.setData('status', event.target.value)}
                                className={adminFieldClass}
                            >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </label>
                        <label className="block space-y-1 text-sm">
                            <span className="font-medium text-foreground">Assigned to</span>
                            <select
                                value={statusForm.data.assigned_to}
                                onChange={(event) => statusForm.setData('assigned_to', event.target.value)}
                                className={adminFieldClass}
                            >
                                <option value="">Unassigned</option>
                                {staffOptions.map((staff) => (
                                    <option key={staff.id} value={String(staff.id)}>
                                        {staff.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button
                            type="submit"
                            disabled={statusForm.processing}
                            className="w-full rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground"
                        >
                            Save changes
                        </button>
                    </form>
                </aside>
            </div>
        </div>
    );
}

export default ChatConversationDetailPage;

ChatConversationDetailPage.layout = withAdminLayout('Chat conversation');
