import { Minus, Send, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useChatPolling } from '@/components/public/chat/useChatPolling';
import { useDebouncedTypingSignal } from '@/hooks/use-debounced-typing-signal';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { useTranslations } from '@/hooks/use-translations';
import {
    fetchChatMessages,
    sendChatMessage,
    signalVisitorTyping,
    type ChatConversationPayload,
    type ChatMessagePayload,
} from '@/lib/chatApi';
import { cn } from '@/lib/utils';

interface ChatWidgetProps {
    onClose: () => void;
    onMinimize: () => void;
}

function formatMessageTime(iso: string): string {
    if (iso === '') {
        return '';
    }

    try {
        return new Intl.DateTimeFormat(undefined, {
            hour: 'numeric',
            minute: '2-digit',
        }).format(new Date(iso));
    } catch {
        return '';
    }
}

function TypingDots() {
    return (
        <span className="inline-flex items-center gap-1 ps-1" aria-hidden>
            {[0, 1, 2].map((index) => (
                <span
                    key={index}
                    className="size-1.5 rounded-full bg-secondary motion-safe:animate-pulse"
                    style={{ animationDelay: `${index * 180}ms` }}
                />
            ))}
        </span>
    );
}

export function ChatWidget({ onClose, onMinimize }: ChatWidgetProps) {
    const { t } = useTranslations();
    const { whatsappHref } = useSiteSettings();
    const [messages, setMessages] = useState<ChatMessagePayload[]>([]);
    const [conversation, setConversation] = useState<ChatConversationPayload>({
        hasConversation: false,
        status: null,
        isClosed: false,
    });
    const [draft, setDraft] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [staffTyping, setStaffTyping] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const mergeMessages = useCallback((incoming: ChatMessagePayload[]): void => {
        if (incoming.length === 0) {
            return;
        }

        setMessages((current) => {
            const known = new Set(current.map((message) => message.id));
            const merged = [...current];

            incoming.forEach((message) => {
                if (!known.has(message.id)) {
                    merged.push(message);
                }
            });

            return merged.sort((left, right) => left.id - right.id);
        });
    }, []);

    const handlePollMessages = useCallback(
        (
            incoming: ChatMessagePayload[],
            nextConversation: ChatConversationPayload,
            nextStaffTyping: boolean,
        ): void => {
            mergeMessages(incoming);
            setConversation(nextConversation);
            setStaffTyping(nextStaffTyping);
        },
        [mergeMessages],
    );

    useDebouncedTypingSignal(
        draft,
        conversation.hasConversation && !conversation.isClosed && !isSending,
        signalVisitorTyping,
    );

    const { refresh } = useChatPolling({
        isOpen: true,
        isClosed: conversation.isClosed,
        messages,
        onMessages: handlePollMessages,
    });

    useEffect(() => {
        let cancelled = false;

        const loadInitial = async (): Promise<void> => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetchChatMessages();
                if (cancelled) {
                    return;
                }

                setMessages(response.messages);
                setConversation(response.conversation);
                setStaffTyping(response.staffTyping);
            } catch {
                if (!cancelled) {
                    setError(t('chat.loadError'));
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        void loadInitial();

        return () => {
            cancelled = true;
        };
    }, [t]);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages, isLoading, staffTyping]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [isLoading]);

    const handleSend = async (): Promise<void> => {
        const trimmed = draft.trim();

        if (trimmed === '' || isSending || conversation.isClosed) {
            return;
        }

        setIsSending(true);
        setError(null);

        try {
            const response = await sendChatMessage(trimmed);
            setDraft('');
            setConversation(response.conversation);
            setStaffTyping(false);
            mergeMessages([response.message]);
            await refresh();
        } catch (sendError) {
            setError(sendError instanceof Error ? sendError.message : t('chat.sendError'));
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            void handleSend();
        }
    };

    return (
        <div
            role="dialog"
            aria-label={t('chat.title')}
            className="fixed start-4 bottom-20 z-50 flex w-[min(calc(100%-2rem),22rem)] max-w-[calc(100%-2rem)] flex-col overflow-hidden rounded-3xl bg-surface shadow-[0_24px_56px_rgba(7,23,34,0.28),0_8px_20px_rgba(22,59,92,0.12)] sm:start-6 sm:bottom-24 dark:shadow-[0_24px_56px_rgba(0,0,0,0.45),0_8px_20px_rgba(14,115,115,0.08)]"
        >
            <header className="relative flex items-center justify-between gap-3 bg-primary px-4 py-3.5 text-primary-foreground">
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"
                />
                <div className="min-w-0">
                    <p className="truncate font-heading text-sm font-semibold tracking-tight">
                        {t('chat.title')}
                    </p>
                    <p className="truncate text-xs text-primary-foreground/75">{t('chat.offlineNotice')}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                    <button
                        type="button"
                        onClick={onMinimize}
                        className="inline-flex size-10 items-center justify-center rounded-full text-primary-foreground/90 transition-colors hover:bg-primary-foreground/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        aria-label={t('chat.minimize')}
                    >
                        <Minus className="size-4" aria-hidden />
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex size-10 items-center justify-center rounded-full text-primary-foreground/90 transition-colors hover:bg-primary-foreground/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        aria-label={t('chat.close')}
                    >
                        <X className="size-4" aria-hidden />
                    </button>
                </div>
            </header>

            <div
                ref={listRef}
                className="flex max-h-80 min-h-56 flex-1 flex-col gap-3 overflow-y-auto bg-gradient-to-b from-surface-muted/55 to-background px-4 py-4 dark:from-surface-muted/35"
            >
                <div className="rounded-2xl rounded-es-sm bg-primary/8 px-3.5 py-2.5 text-sm leading-relaxed text-foreground dark:bg-primary/14">
                    {t('chat.greeting')}
                </div>

                {isLoading ? (
                    <div className="space-y-2.5">
                        <div className="h-11 w-[78%] animate-pulse rounded-2xl rounded-es-sm bg-primary/8" />
                        <div className="ms-auto h-11 w-[72%] animate-pulse rounded-2xl rounded-ee-sm bg-secondary/20" />
                    </div>
                ) : null}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            'max-w-[88%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm',
                            message.sender === 'visitor'
                                ? 'ms-auto rounded-2xl rounded-ee-sm bg-secondary text-secondary-foreground shadow-[0_4px_14px_rgba(14,115,115,0.22)]'
                                : 'me-auto rounded-2xl rounded-es-sm bg-surface text-foreground dark:bg-surface-muted/80',
                        )}
                    >
                        <p>{message.body}</p>
                        <p
                            className={cn(
                                'mt-1.5 text-[11px]',
                                message.sender === 'visitor'
                                    ? 'text-secondary-foreground/75'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {formatMessageTime(message.createdAt)}
                        </p>
                    </div>
                ))}

                {staffTyping ? (
                    <div
                        className="flex items-center text-xs font-medium text-secondary"
                        aria-live="polite"
                    >
                        {t('chat.teamTyping')}
                        <TypingDots />
                    </div>
                ) : null}

                {conversation.isClosed ? (
                    <p className="rounded-2xl bg-accent/12 px-3.5 py-2.5 text-sm text-accent-foreground dark:text-accent">
                        {t('chat.closedNotice')}
                    </p>
                ) : null}
            </div>

            {error ? (
                <p className="bg-surface px-4 pb-2 text-xs text-destructive" role="alert">
                    {error}
                </p>
            ) : null}

            <div className="bg-surface px-4 py-3.5">
                <div className="flex items-end gap-2.5">
                    <textarea
                        ref={inputRef}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={2}
                        maxLength={2000}
                        disabled={conversation.isClosed || isSending}
                        placeholder={t('chat.placeholder')}
                        className="min-h-11 flex-1 resize-none rounded-2xl bg-surface-muted px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:bg-surface focus-visible:ring-2 focus-visible:ring-secondary/35 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    <button
                        type="button"
                        onClick={() => void handleSend()}
                        disabled={conversation.isClosed || isSending || draft.trim() === ''}
                        className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-[0_4px_14px_rgba(215,162,58,0.28)] transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-foreground disabled:shadow-none"
                        aria-label={t('chat.send')}
                    >
                        <Send className="size-4" aria-hidden />
                    </button>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-secondary underline-offset-2 transition hover:text-secondary/80 hover:underline"
                    >
                        {t('chat.continueWhatsApp')}
                    </a>
                    {isSending ? (
                        <span className="text-[11px] font-medium text-muted-foreground">{t('chat.sending')}</span>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
