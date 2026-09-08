import { Link, router, usePage } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
import { Suspense, lazy, useCallback, useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { adminFieldClass } from '@/components/admin/adminForm';
import {
    BookingPrintHost,
    fetchAdminBooking,
} from '@/components/admin/BookingPrintDocument';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import { mediaProfiles } from '@/lib/mediaProfiles';
import type { AdminBookingDetail } from '@/types/adminBooking';
import type { SharedPageProps } from '@/types/inertia';

const CustomBookingFormDialog = lazy(() =>
    import('@/components/admin/CustomBookingFormDialog').then((module) => ({
        default: module.CustomBookingFormDialog,
    })),
);

interface BookingRow {
    id: number;
    reference: string;
    status: string;
    statusValue: string;
    travelerName: string;
    email: string;
    preferredDate: string;
    travelerCount: number;
    received: string;
}

interface PaginatedBookings {
    data: BookingRow[];
    links?: { url: string | null; label: string; active: boolean }[];
    meta?: {
        total: number;
        current_page: number;
        last_page: number;
        links?: { url: string | null; label: string; active: boolean }[];
    };
}

interface BookingsPageProps extends SharedPageProps {
    bookings: PaginatedBookings;
    filters: { search: string; status: string };
    statusOptions: { value: string; label: string }[];
    attachmentUpload?: {
        hint: string;
        accept: string;
        max_files: number;
        max_upload_kilobytes: number;
    };
}

const statusStyles: Record<string, string> = {
    Submitted: 'bg-accent/15 text-accent',
    'Under Review': 'bg-secondary/10 text-secondary',
    'Quotation Sent': 'bg-primary/10 text-primary',
    'Customer Accepted': 'bg-secondary/10 text-secondary',
    'Deposit Pending': 'bg-accent/15 text-accent',
    Confirmed: 'bg-primary/10 text-primary',
};

const columns: DataTableColumn<BookingRow>[] = [
    {
        id: 'reference',
        header: 'Reference',
        accessor: (row) => row.reference,
        render: (row) => <span className="font-semibold text-foreground">{row.reference}</span>,
    },
    {
        id: 'traveler',
        header: 'Traveler',
        accessor: (row) => row.travelerName,
        render: (row) => (
            <div>
                <p className="font-medium text-foreground">{row.travelerName}</p>
                <p className="text-xs text-muted-foreground">{row.email}</p>
            </div>
        ),
    },
    { id: 'preferredDate', header: 'Preferred date', accessor: (row) => row.preferredDate },
    { id: 'travelers', header: 'Travelers', accessor: (row) => row.travelerCount },
    {
        id: 'status',
        header: 'Status',
        accessor: (row) => row.status,
        render: (row) => (
            <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[row.status] ?? 'bg-surface-muted text-muted-foreground'}`}
            >
                {row.status}
            </span>
        ),
    },
    { id: 'received', header: 'Received', accessor: (row) => row.received },
];

export default function Bookings() {
    const {
        bookings,
        filters,
        statusOptions = [],
        attachmentUpload,
        flash,
    } = usePage<BookingsPageProps>().props;
    const rows = bookings?.data ?? [];
    const [search, setSearch] = useState(filters?.search ?? '');
    const [formOpen, setFormOpen] = useState(false);
    const [formResetKey, setFormResetKey] = useState('edit');
    const [editingBooking, setEditingBooking] = useState<BookingRow | null>(null);
    const [printBooking, setPrintBooking] = useState<AdminBookingDetail | null>(null);
    const [printError, setPrintError] = useState<string | undefined>();
    const clearPrintJob = useCallback(() => setPrintBooking(null), []);
    const uploadSpec = attachmentUpload ?? {
        hint: mediaProfiles.document_attachment.hint,
        accept: mediaProfiles.document_attachment.accept,
        max_files: mediaProfiles.document_attachment.maxFiles,
        max_upload_kilobytes: mediaProfiles.document_attachment.maxUploadKilobytes,
    };

    const openEditForm = (row: BookingRow) => {
        setEditingBooking(row);
        setFormResetKey(`edit-${row.id}-${Date.now()}`);
        setFormOpen(true);
    };

    const submitEditForm = (files: File[]): Promise<void> => {
        if (editingBooking === null) {
            return Promise.resolve();
        }

        const formData = new FormData();

        for (const file of files) {
            formData.append('attachments[]', file);
        }

        return new Promise((resolve, reject) => {
            router.post(`/admin/bookings/${editingBooking.id}/attachments`, formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: (submitErrors) => {
                    const message =
                        submitErrors.attachments ??
                        Object.values(submitErrors).find((value) => Boolean(value));

                    reject(
                        new Error(
                            message || 'Could not attach files. Check the file type and size.',
                        ),
                    );
                },
            });
        });
    };

    const printSelectedBooking = async (row: BookingRow) => {
        setPrintError(undefined);

        try {
            setPrintBooking(await fetchAdminBooking(row.id));
        } catch (error) {
            setPrintError(
                error instanceof Error ? error.message : 'Could not print this booking request.',
            );
        }
    };

    const applyFilters = (next: { search?: string; status?: string }) => {
        router.get(
            '/admin/bookings',
            {
                search: next.search ?? search,
                status: next.status ?? filters.status,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <>
            <div className="space-y-4">
                {flash.success ? (
                    <div
                        role="status"
                        className="rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm text-secondary"
                    >
                        {flash.success}
                    </div>
                ) : null}

                {printError ? (
                    <div
                        role="alert"
                        className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    >
                        {printError}
                    </div>
                ) : null}

                <AdminSectionHeader
                    eyebrow="Public website"
                    title="Custom bookings"
                    description="Review submitted custom tour requests. These are inquiries, not confirmed reservations."
                    icon={ClipboardList}
                />

                <form
                    className="flex flex-col gap-3 sm:flex-row sm:items-end"
                    onSubmit={(event) => {
                        event.preventDefault();
                        applyFilters({ search });
                    }}
                >
                    <label className="min-w-0 flex-1 text-xs font-medium text-muted-foreground">
                        Search
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Reference, name, or email"
                            className={`${adminFieldClass} mt-1.5`}
                        />
                    </label>
                    <label className="w-full text-xs font-medium text-muted-foreground sm:w-56">
                        Status
                        <select
                            value={filters?.status ?? ''}
                            onChange={(event) => applyFilters({ status: event.target.value })}
                            className={`${adminFieldClass} mt-1.5`}
                        >
                            <option value="">All statuses</option>
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
                    >
                        Search
                    </button>
                </form>

                <PremiumDataTable
                    title="Submitted requests"
                    description="Newest first. Open a request to view traveler, service, and document details."
                    data={rows}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => row.reference}
                    initialPageSize={15}
                    onView={(row) => router.visit(`/admin/bookings/${row.id}`)}
                    onEdit={openEditForm}
                    onPrint={printSelectedBooking}
                    onDelete={(row) => {
                        router.delete(`/admin/bookings/${row.id}`, { preserveScroll: true });
                    }}
                />

                {((bookings.meta?.links ?? bookings.links) ?? []).length > 3 ? (
                    <nav className="flex flex-wrap justify-center gap-1" aria-label="Pagination">
                        {((bookings.meta?.links ?? bookings.links) ?? []).map((link) =>
                            link.url ? (
                                <Link
                                    key={link.label}
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

            <BookingPrintHost booking={printBooking} onDone={clearPrintJob} />

            <Suspense fallback={null}>
                <CustomBookingFormDialog
                    open={formOpen}
                    resetKey={formResetKey}
                    reference={editingBooking?.reference ?? ''}
                    travelerName={editingBooking?.travelerName ?? ''}
                    email={editingBooking?.email ?? ''}
                    accept={uploadSpec.accept}
                    hint={uploadSpec.hint}
                    maxFiles={uploadSpec.max_files}
                    onClose={() => setFormOpen(false)}
                    onSubmit={submitEditForm}
                />
            </Suspense>
        </>
    );
}

Bookings.layout = withAdminLayout('Custom bookings');
