import { ArrowLeft, MessageCircle, Search, Send, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { adminFieldClass } from '@/components/admin/adminForm';
import { useDebouncedTypingSignal } from '@/hooks/use-debounced-typing-signal';
import {
    fetchAdminChatInbox,
    fetchAdminChatThread,
    markAdminChatRead,
    sendAdminChatReply,
    signalAdminTyping,
    updateAdminChatStatus,
} from '@/lib/chatApi';
import { cn } from '@/lib/utils';

interface AdminChatListRow {
    id: number;
    visitorLabel: string;
    lastMessagePreview: string;
    lastActivityAt: string;
    unreadCount: number;
    status: string;
    statusValue: string;
    assignedToName: string;
}

interface AdminChatConversationDetail {
    id: number;
    visitorLabel: string;
    status: string;
    statusValue: string;
    assignedToId: number | null;
    assignedToName: string;
    lastActivityAt: string;
    unreadCount: number;
    visitorTyping: boolean;
    messages: Array<{
        id: number;
        body: string;
        senderType: string;
        senderLabel: string;
        isRead: boolean;
        createdAt: string;
    }>;
}

function visitorInitials(label: string): string {
    const code = label.replace(/[^A-Za-z0-9]/g, '').slice(-2);

    return (code || 'CH').toUpperCase();
}

export function AdminChatWidget() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState<AdminChatListRow[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [conversation, setConversation] = useState<AdminChatConversationDetail | null>(null);
    const [draft, setDraft] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const threadRef = useRef<HTMLDivElement>(null);

    const unreadTotal = rows.reduce((sum, row) => sum + row.unreadCount, 0);

    const loadInbox = useCallback(async (query = search) => {
        const payload = await fetchAdminChatInbox(query);
        const nextRows = payload.conversations?.data;

        if (!Array.isArray(nextRows)) {
            throw new Error('Could not load chats.');
        }

        setRows(nextRows);
        setError(null);
    }, [search]);

    const loadThread = useCallback(async (id: number) => {
        const payload = await fetchAdminChatThread(id);
        setConversation(payload.conversation);
    }, []);

    useEffect(() => {
        let cancelled = false;

        const refresh = async (): Promise<void> => {
            try {
                await loadInbox();

                if (open && selectedId !== null && !cancelled) {
                    await loadThread(selectedId);
                }
            } catch {
                if (!cancelled && open) {
                    setError('Could not load chats.');
                }
            }
        };

        void refresh();
        const timer = window.setInterval(() => {
            void refresh();
        }, open ? 5000 : 15000);

        return () => {
            cancelled = true;
            window.clearInterval(timer);
        };
    }, [open, selectedId, loadInbox, loadThread]);

    useEffect(() => {
        const node = threadRef.current;

        if (node) {
            node.scrollTop = node.scrollHeight;
        }
    }, [conversation?.id, conversation?.messages.length, conversation?.visitorTyping]);

    useDebouncedTypingSignal(
        draft,
        open && conversation?.statusValue === 'open' && !sending,
        () => {
            if (conversation) {
                void signalAdminTyping(conversation.id);
            }
        },
    );

    const openConversation = async (id: number): Promise<void> => {
        setError(null);
        setSelectedId(id);
        setDraft('');

        try {
            await loadThread(id);
        } catch {
            setError('Could not open this chat.');
        }
    };

    const sendReply = async (event?: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event?.preventDefault();

        if (conversation === null || draft.trim() === '' || sending) {
            return;
        }

        setSending(true);
        setError(null);

        try {
            const payload = await sendAdminChatReply(conversation.id, draft.trim());
            setConversation(payload.conversation);
            setDraft('');
            await loadInbox();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : 'Could not send reply.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="pointer-events-none fixed end-4 bottom-4 z-40 sm:end-6 sm:bottom-6">
            {open ? (
                <div className="pointer-events-auto mb-3 flex h-[min(34rem,calc(100dvh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
                    {conversation === null ? (
                        <>
                            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                                <span className="inline-flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                    <MessageCircle className="size-4" aria-hidden />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="font-heading text-sm font-semibold text-foreground">Chats</p>
                                    <p className="text-xs text-muted-foreground">Website visitors</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-muted"
                                    aria-label="Close chats"
                                >
                                    <X className="size-4" aria-hidden />
                                </button>
                            </div>
                            <div className="border-b border-border px-3 py-2">
                                <label className="relative block">
                                    <Search
                                        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                        aria-hidden
                                    />
                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                void loadInbox(event.currentTarget.value);
                                            }
                                        }}
                                        placeholder="Search chats"
                                        aria-label="Search chats"
                                        className={`${adminFieldClass} rounded-full bg-background ps-9`}
                                    />
                                </label>
                            </div>
                            <div className="min-h-0 flex-1 overflow-y-auto">
                                {rows.length === 0 ? (
                                    <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                                        No conversations yet.
                                    </p>
                                ) : (
                                    <ul>
                                        {rows.map((row) => (
                                            <li key={row.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => void openConversation(row.id)}
                                                    className="flex w-full items-center gap-3 px-3 py-3 text-start hover:bg-surface-muted/70"
                                                >
                                                    <span
                                                        className={cn(
                                                            'inline-flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                                                            row.unreadCount > 0
                                                                ? 'bg-secondary text-secondary-foreground'
                                                                : 'bg-primary/10 text-primary',
                                                        )}
                                                    >
                                                        {visitorInitials(row.visitorLabel)}
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="flex items-center justify-between gap-2">
                                                            <span
                                                                className={cn(
                                                                    'truncate text-sm text-foreground',
                                                                    row.unreadCount > 0
                                                                        ? 'font-semibold'
                                                                        : 'font-medium',
                                                                )}
                                                            >
                                                                {row.visitorLabel}
                                                            </span>
                                                            <span className="shrink-0 text-[10px] text-muted-foreground">
                                                                {row.lastActivityAt}
                                                            </span>
                                                        </span>
                                                        <span className="mt-0.5 flex items-center justify-between gap-2">
                                                            <span className="truncate text-xs text-muted-foreground">
                                                                {row.lastMessagePreview}
                                                            </span>
                                                            {row.unreadCount > 0 ? (
                                                                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
                                                                    {row.unreadCount > 99 ? '99+' : row.unreadCount}
                                                                </span>
                                                            ) : null}
                                                        </span>
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <header className="flex items-center gap-2 border-b border-border px-2 py-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setConversation(null);
                                        setSelectedId(null);
                                        void loadInbox();
                                    }}
                                    className="inline-flex size-8 items-center justify-center rounded-full hover:bg-surface-muted"
                                    aria-label="Back to chats"
                                >
                                    <ArrowLeft className="size-4" aria-hidden />
                                </button>
                                <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                                    {visitorInitials(conversation.visitorLabel)}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-foreground">
                                        {conversation.visitorLabel}
                                    </p>
                                    <p className="truncate text-[11px] text-muted-foreground">
                                        {conversation.visitorTyping ? 'Typing…' : conversation.status}
                                    </p>
                                </div>
                                <select
                                    value={conversation.statusValue}
                                    aria-label="Chat status"
                                    className="rounded-full border border-border bg-background px-2 py-1 text-[11px]"
                                    onChange={(event) => {
                                        void updateAdminChatStatus(
                                            conversation.id,
                                            event.target.value,
                                            conversation.assignedToId
                                                ? String(conversation.assignedToId)
                                                : '',
                                        ).then((payload) => setConversation(payload.conversation));
                                    }}
                                >
                                    <option value="open">Open</option>
                                    <option value="closed">Closed</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-muted"
                                    aria-label="Close chats"
                                >
                                    <X className="size-4" aria-hidden />
                                </button>
                            </header>
                            <div ref={threadRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
                                {conversation.messages.map((message) => {
                                    const fromStaff = message.senderType === 'staff';

                                    return (
                                        <div
                                            key={message.id}
                                            className={cn('flex', fromStaff ? 'justify-end' : 'justify-start')}
                                        >
                                            <div
                                                className={cn(
                                                    'max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words',
                                                    fromStaff
                                                        ? 'rounded-se-md bg-secondary text-secondary-foreground'
                                                        : 'rounded-ss-md bg-background text-foreground',
                                                )}
                                            >
                                                <p>{message.body}</p>
                                                <p
                                                    className={cn(
                                                        'mt-1 text-end text-[10px]',
                                                        fromStaff
                                                            ? 'text-secondary-foreground/70'
                                                            : 'text-muted-foreground',
                                                    )}
                                                >
                                                    {message.createdAt}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <form
                                onSubmit={(event) => void sendReply(event)}
                                className="flex items-end gap-2 border-t border-border px-3 py-3"
                            >
                                <label className="min-w-0 flex-1">
                                    <span className="sr-only">Reply</span>
                                    <textarea
                                        value={draft}
                                        onChange={(event) => setDraft(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' && !event.shiftKey) {
                                                event.preventDefault();
                                                void sendReply();
                                            }
                                        }}
                                        rows={1}
                                        maxLength={2000}
                                        disabled={conversation.statusValue === 'closed' || sending}
                                        className={`${adminFieldClass} max-h-28 min-h-10 resize-none rounded-full px-4`}
                                        placeholder={
                                            conversation.statusValue === 'closed'
                                                ? 'This chat is closed'
                                                : 'Type a message'
                                        }
                                    />
                                </label>
                                <button
                                    type="submit"
                                    disabled={
                                        conversation.statusValue === 'closed' ||
                                        sending ||
                                        draft.trim() === ''
                                    }
                                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground disabled:opacity-40"
                                    aria-label="Send reply"
                                >
                                    <Send className="size-4" aria-hidden />
                                </button>
                            </form>
                            {conversation.unreadCount > 0 ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        void markAdminChatRead(conversation.id).then((payload) => {
                                            setConversation(payload.conversation);
                                            void loadInbox();
                                        });
                                    }}
                                    className="px-4 pb-2 text-start text-[11px] font-medium text-secondary"
                                >
                                    Mark read
                                </button>
                            ) : null}
                        </>
                    )}
                    {error ? <p className="px-4 pb-3 text-xs text-red-600">{error}</p> : null}
                </div>
            ) : null}

            <button
                type="button"
                onClick={() => {
                    setOpen((current) => !current);
                    setError(null);
                }}
                aria-expanded={open}
                aria-label={open ? 'Close chats' : 'Open chats'}
                className="pointer-events-auto relative ms-auto flex size-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg transition hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
                <MessageCircle className="size-6" aria-hidden />
                {!open && unreadTotal > 0 ? (
                    <span className="absolute -top-1 -end-1 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                        {unreadTotal > 99 ? '99+' : unreadTotal}
                    </span>
                ) : null}
            </button>
        </div>
    );
}
