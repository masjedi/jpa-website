export interface ChatMessagePayload {
    id: number;
    body: string;
    sender: 'visitor' | 'staff';
    createdAt: string;
}

export interface ChatConversationPayload {
    hasConversation: boolean;
    status: string | null;
    isClosed: boolean;
}

export interface ChatMessagesResponse {
    conversation: ChatConversationPayload;
    messages: ChatMessagePayload[];
    staffTyping: boolean;
}

function readXsrfToken(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);

    return match ? decodeURIComponent(match[1]) : '';
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let message = 'Request failed';

        try {
            const payload = (await response.json()) as { message?: string; errors?: Record<string, string[]> };
            const firstError = payload.errors
                ? Object.values(payload.errors).flat()[0]
                : undefined;

            message = firstError ?? payload.message ?? message;
        } catch {
            // Keep generic message when body is not JSON.
        }

        throw new Error(message);
    }

    return (await response.json()) as T;
}

export async function fetchChatMessages(afterId?: number): Promise<ChatMessagesResponse> {
    const query = afterId !== undefined && afterId > 0 ? `?after_id=${afterId}` : '';
    const response = await fetch(`/chat/messages${query}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
    });

    return parseJsonResponse<ChatMessagesResponse>(response);
}

export async function sendChatMessage(message: string): Promise<ChatMessagesResponse & { message: ChatMessagePayload }> {
    const response = await fetch('/chat/messages', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': readXsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ message }),
    });

    return parseJsonResponse(response);
}

export async function signalVisitorTyping(): Promise<void> {
    const response = await fetch('/chat/typing', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': readXsrfToken(),
        },
        credentials: 'same-origin',
    });

    if (!response.ok) {
        return;
    }
}

export async function signalAdminTyping(conversationId: number): Promise<void> {
    const response = await fetch(`/admin/chat/${conversationId}/typing`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': readXsrfToken(),
        },
        credentials: 'same-origin',
    });

    if (!response.ok) {
        return;
    }
}
