import { useEffect, useRef } from 'react';

const HEARTBEAT_MS = 2000;

export function useDebouncedTypingSignal(
    draft: string,
    enabled: boolean,
    signal: () => void | Promise<void>,
): void {
    const lastSentRef = useRef(0);
    const signalRef = useRef(signal);

    useEffect(() => {
        signalRef.current = signal;
    }, [signal]);

    useEffect(() => {
        if (!enabled || draft.trim() === '') {
            return;
        }

        const send = (): void => {
            lastSentRef.current = Date.now();
            void signalRef.current();
        };

        const elapsed = Date.now() - lastSentRef.current;

        if (elapsed >= HEARTBEAT_MS) {
            send();

            return;
        }

        const timer = window.setTimeout(send, HEARTBEAT_MS - elapsed);

        return () => {
            window.clearTimeout(timer);
        };
    }, [draft, enabled]);
}
