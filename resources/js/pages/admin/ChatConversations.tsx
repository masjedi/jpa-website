import { Link, router, usePage, usePoll } from '@inertiajs/react';
import { MessageSquareText } from 'lucide-react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { adminFieldClass } from '@/components/admin/adminForm';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import { cn } from '@/lib/utils';
import type { SharedPageProps } from '@/types/inertia';

interface ChatConversationRow {
    id: number;
    visitorLabel: string;
    lastMessagePreview: string;
    lastActivityAt: string;
    unreadCount: number;
    status: string;
    statusValue: string;
    assignedToName: string;
}

interface PaginatedConversations {
    data: ChatConversationRow[];
    links?: { url: string | null; label: string; active: boolean }[];
    meta?: {
        total: number;
        current_page: number;
        last_page: number;
        links?: { url: string | null; label: string; active: boolean }[];
    };
}

interface ChatConversationsPageProps extends SharedPageProps {
    conversations: PaginatedConversations;
    filters: {
        search: string;
        status: string;
        assigned_to: string;
        unread_only: string;
    };
    statusOptions: { value: string; label: string }[];
    staffOptions: { id: number; name: string }[];
}

const statusStyles: Record<string, string> = {
    Open: 'bg-secondary/10 text-secondary',
    Closed: 'bg-surface-muted text-muted-foreground',
};

const columns: DataTableColumn<ChatConversationRow>[] = [
    {
        id: 'visitor',
        header: 'Visitor',
        accessor: (row) => row.visitorLabel,
        render: (row) => (
            <div>
                <p className="font-medium text-foreground">{row.visitorLabel}</p>
                {row.unreadCount > 0 ? (
                    <span className="mt-1 inline-flex rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">
                        {row.unreadCount} unread
                    </span>
                ) : null}
            </div>
        ),
    },
    {
        id: 'preview',
        header: 'Last message',
        accessor: (row) => row.lastMessagePreview,
        render: (row) => <p className="max-w-sm truncate text-sm text-muted-foreground">{row.lastMessagePreview}</p>,
    },
    {
        id: 'activity',
        header: 'Last activity',
        accessor: (row) => row.lastActivityAt,
    },
    {
        id: 'status',
        header: 'Status',
        accessor: (row) => row.status,
        render: (row) => (
            <span
                className={cn(
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                    statusStyles[row.status] ?? statusStyles.Closed,
                )}
            >
                {row.status}
            </span>
        ),
    },
    {
        id: 'assigned',
        header: 'Assigned to',
        accessor: (row) => row.assignedToName || 'Unassigned',
    },
];

function ChatConversationsPage() {
    const { conversations, filters, statusOptions, staffOptions } =
        usePage<ChatConversationsPageProps>().props;

    usePoll(8000, {
        only: ['conversations'],
        preserveScroll: true,
    });

    const applyFilters = (next: Partial<ChatConversationsPageProps['filters']>): void => {
        router.get(
            '/admin/chat',
            { ...filters, ...next },
            { preserveState: true, replace: true },
        );
    };

    return (
        <div className="space-y-6">
            <AdminSectionHeader
                eyebrow="Messages"
                title="Website chat"
                description="Anonymous visitor conversations from the public chat widget."
                icon={MessageSquareText}
            />

            <div className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4 md:grid-cols-4">
                <label className="space-y-1 text-sm">
                    <span className="font-medium text-foreground">Search</span>
                    <input
                        type="search"
                        defaultValue={filters.search}
                        placeholder="Visitor #A82F or message text"
                        className={adminFieldClass}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                applyFilters({ search: event.currentTarget.value });
                            }
                        }}
                    />
                </label>
                <label className="space-y-1 text-sm">
                    <span className="font-medium text-foreground">Status</span>
                    <select
                        value={filters.status}
                        className={adminFieldClass}
                        onChange={(event) => applyFilters({ status: event.target.value })}
                    >
                        <option value="">All</option>
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="space-y-1 text-sm">
                    <span className="font-medium text-foreground">Assigned staff</span>
                    <select
                        value={filters.assigned_to}
                        className={adminFieldClass}
                        onChange={(event) => applyFilters({ assigned_to: event.target.value })}
                    >
                        <option value="">All</option>
                        {staffOptions.map((staff) => (
                            <option key={staff.id} value={String(staff.id)}>
                                {staff.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex items-end gap-2 text-sm">
                    <input
                        id="unread-only"
                        type="checkbox"
                        checked={filters.unread_only === '1'}
                        className="size-4 rounded border-border"
                        onChange={(event) =>
                            applyFilters({ unread_only: event.target.checked ? '1' : '' })
                        }
                    />
                    <span className="pb-2 font-medium text-foreground">Unread only</span>
                </label>
            </div>

            <PremiumDataTable
                title="Anonymous conversations"
                description="Visitors are identified by short labels only. Tokens are never shown."
                data={conversations.data}
                columns={columns}
                rowKey={(row) => row.id}
                selectionLabel={(row) => row.visitorLabel}
                initialPageSize={15}
                emptyTitle="No chat conversations yet"
                emptyDescription="Messages appear here after a visitor sends their first message."
                onView={(row) => router.visit(`/admin/chat/${row.id}`)}
                onRefresh={() => router.reload({ only: ['conversations'] })}
            />

            {((conversations.meta?.links ?? conversations.links) ?? []).length > 3 ? (
                <nav className="flex flex-wrap justify-center gap-1" aria-label="Pagination">
                    {((conversations.meta?.links ?? conversations.links) ?? []).map((link) =>
                        link.url ? (
                            <Link
                                key={`${link.label}-${link.url}`}
                                href={link.url}
                                preserveScroll
                                className={`rounded-md px-3 py-1.5 text-xs ${link.active ? 'bg-primary text-primary-foreground' : 'border border-border text-foreground hover:bg-surface-muted'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span
                                key={link.label}
                                className="rounded-md px-3 py-1.5 text-xs text-muted-foreground"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ),
                    )}
                </nav>
            ) : null}
        </div>
    );
}

export default ChatConversationsPage;

ChatConversationsPage.layout = withAdminLayout('Website chat');
