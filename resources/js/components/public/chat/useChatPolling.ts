import { useCallback, useEffect, useRef } from 'react';

import { fetchChatMessages, type ChatConversationPayload, type ChatMessagePayload } from '@/lib/chatApi';

const OPEN_POLL_MS = 5000;
const HIDDEN_POLL_MS = 15000;

interface UseChatPollingOptions {
    isOpen: boolean;
    isClosed: boolean;
    messages: ChatMessagePayload[];
    onMessages: (
        messages: ChatMessagePayload[],
        conversation: ChatConversationPayload,
        staffTyping: boolean,
    ) => void;
    onError?: (message: string) => void;
}

export function useChatPolling({
    isOpen,
    isClosed,
    messages,
    onMessages,
    onError,
}: UseChatPollingOptions): { refresh: () => Promise<void> } {
    const messagesRef = useRef(messages);
    const timerRef = useRef<number | null>(null);
    const inFlightRef = useRef(false);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    const poll = useCallback(async (): Promise<void> => {
        if (!isOpen || isClosed || inFlightRef.current) {
            return;
        }

        inFlightRef.current = true;

        try {
            const lastId = messagesRef.current.at(-1)?.id;
            const response = await fetchChatMessages(lastId);
            onMessages(response.messages, response.conversation, response.staffTyping);
        } catch {
            onError?.('load');
        } finally {
            inFlightRef.current = false;
        }
    }, [isClosed, isOpen, onError, onMessages]);

    const refresh = useCallback(async (): Promise<void> => {
        if (inFlightRef.current) {
            return;
        }

        inFlightRef.current = true;

        try {
            const lastId = messagesRef.current.at(-1)?.id;
            const response = await fetchChatMessages(lastId);
            onMessages(response.messages, response.conversation, response.staffTyping);
        } catch {
            onError?.('load');
        } finally {
            inFlightRef.current = false;
        }
    }, [onError, onMessages]);

    useEffect(() => {
        if (!isOpen || isClosed) {
            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }

            return;
        }

        let cancelled = false;

        const schedule = (): void => {
            const delay =
                document.visibilityState === 'hidden' ? HIDDEN_POLL_MS : OPEN_POLL_MS;

            timerRef.current = window.setTimeout(async () => {
                if (cancelled) {
                    return;
                }

                await poll();

                if (!cancelled) {
                    schedule();
                }
            }, delay);
        };

        schedule();

        const handleVisibility = (): void => {
            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }

            if (!cancelled) {
                schedule();
            }
        };

        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            cancelled = true;

            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }

            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [isClosed, isOpen, poll]);

    return { refresh };
}
