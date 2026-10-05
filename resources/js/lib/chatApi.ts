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
    const contentType = response.headers.get('content-type') ?? '';

    if (!contentType.includes('application/json')) {
        throw new Error('Request failed');
    }

    const payload = (await response.json()) as T & {
        message?: string;
        errors?: Record<string, string[]>;
        component?: string;
    };

    if (!response.ok) {
        const firstError = payload.errors
            ? Object.values(payload.errors).flat()[0]
            : undefined;

        throw new Error(firstError ?? payload.message ?? 'Request failed');
    }

    if (typeof payload.component === 'string') {
        throw new Error('Could not load chats.');
    }

    return payload;
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

export interface AdminChatInboxPayload {
    conversations: {
        data: Array<{
            id: number;
            visitorLabel: string;
            lastMessagePreview: string;
            lastActivityAt: string;
            unreadCount: number;
            status: string;
            statusValue: string;
            assignedToName: string;
        }>;
    };
}

export interface AdminChatThreadPayload {
    conversation: {
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
    };
}

export async function fetchAdminChatInbox(search = ''): Promise<AdminChatInboxPayload> {
    const query = search.trim() !== '' ? `?search=${encodeURIComponent(search.trim())}` : '';
    const response = await fetch(`/admin/chat${query}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
    });

    return parseJsonResponse<AdminChatInboxPayload>(response);
}

export async function fetchAdminChatThread(conversationId: number): Promise<AdminChatThreadPayload> {
    const response = await fetch(`/admin/chat/${conversationId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
    });

    return parseJsonResponse<AdminChatThreadPayload>(response);
}

export async function sendAdminChatReply(
    conversationId: number,
    message: string,
): Promise<AdminChatThreadPayload> {
    const response = await fetch(`/admin/chat/${conversationId}/messages`, {
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

    return parseJsonResponse<AdminChatThreadPayload>(response);
}

export async function markAdminChatRead(conversationId: number): Promise<AdminChatThreadPayload> {
    const response = await fetch(`/admin/chat/${conversationId}/read`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': readXsrfToken(),
        },
        credentials: 'same-origin',
    });

    return parseJsonResponse<AdminChatThreadPayload>(response);
}

export async function updateAdminChatStatus(
    conversationId: number,
    status: string,
    assignedTo = '',
): Promise<AdminChatThreadPayload> {
    const response = await fetch(`/admin/chat/${conversationId}`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': readXsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ status, assigned_to: assignedTo }),
    });

    return parseJsonResponse<AdminChatThreadPayload>(response);
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
