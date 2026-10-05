import { router, usePage } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { adminFieldClass } from '@/components/admin/adminForm';
import {
    fetchAdminBooking,
    startBookingPrint,
} from '@/components/admin/BookingPrintDocument';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import type { SharedPageProps } from '@/types/inertia';

interface BookingRow {
    id: number;
    reference: string;
    status: string;
    fullName: string;
    email: string;
    preferredDate: string;
    numberOfTourists: number;
    tourType: string;
    submitted: string;
    requestKind?: string;
    requestKindLabel?: string;
    isSeasonalPackage?: boolean;
    packageTitle?: string;
    packagePrice?: string;
}

interface PaginatedBookings {
    data: BookingRow[];
    links?: { url: string | null; label: string; active: boolean }[];
    meta?: {
        total: number;
        current_page: number;
        last_page: number;
    };
}

interface BookingsPageProps extends SharedPageProps {
    bookings: PaginatedBookings;
    filters: { search: string; status: string };
    statusOptions: { value: string; label: string }[];
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
        accessor: (row) => row.fullName,
        render: (row) => (
            <div>
                <p className="font-medium text-foreground">{row.fullName}</p>
                <p className="text-xs text-muted-foreground">{row.email}</p>
            </div>
        ),
    },
    {
        id: 'requestKind',
        header: 'Request type',
        accessor: (row) => row.requestKindLabel ?? 'Custom tour',
        render: (row) => (
            <div>
                <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        row.isSeasonalPackage
                            ? 'bg-secondary/10 text-secondary'
                            : 'bg-surface-muted text-muted-foreground'
                    }`}
                >
                    {row.isSeasonalPackage ? 'Seasonal package' : 'Custom tour'}
                </span>
                {row.isSeasonalPackage && row.packageTitle ? (
                    <p className="mt-1 text-xs text-muted-foreground">{row.packageTitle}</p>
                ) : null}
                {row.isSeasonalPackage && row.packagePrice ? (
                    <p className="text-xs text-muted-foreground">Price: {row.packagePrice}</p>
                ) : null}
            </div>
        ),
    },
    { id: 'preferredDate', header: 'Preferred date', accessor: (row) => row.preferredDate },
    { id: 'tourists', header: 'Tourists', accessor: (row) => row.numberOfTourists },
    { id: 'tourType', header: 'Tour type', accessor: (row) => row.tourType },
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
    { id: 'submitted', header: 'Submitted', accessor: (row) => row.submitted },
];

export default function Bookings({ bookings, filters, statusOptions }: BookingsPageProps) {
    const { flash } = usePage().props;
    const bookingRows = bookings?.data ?? [];

    const handlePrint = async (row: BookingRow) => {
        try {
            const detail = await fetchAdminBooking(row.id);
            startBookingPrint(detail);
        } catch {
            window.alert('Unable to load this tour request for printing.');
        }
    };

    return (
        <div className="space-y-4">
            {flash.success ? (
                <div
                    role="status"
                    className="rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm text-secondary"
                >
                    {flash.success}
                </div>
            ) : null}

            <AdminSectionHeader
                eyebrow="Requests"
                title="Tour bookings"
                description="Custom tour and seasonal package requests from the shared Tour Request Form. Seasonal packages are labeled with package title and price."
                icon={ClipboardList}
            />

            <div className="flex flex-wrap gap-3">
                <input
                    defaultValue={filters.search}
                    placeholder="Search name, email, reference…"
                    className={`${adminFieldClass} max-w-sm`}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            router.get(
                                '/admin/bookings',
                                {
                                    search: (event.target as HTMLInputElement).value,
                                    status: filters.status || undefined,
                                },
                                { preserveState: true },
                            );
                        }
                    }}
                />
                <select
                    defaultValue={filters.status}
                    className={`${adminFieldClass} max-w-xs`}
                    onChange={(event) =>
                        router.get(
                            '/admin/bookings',
                            {
                                search: filters.search || undefined,
                                status: event.target.value || undefined,
                            },
                            { preserveState: true },
                        )
                    }
                >
                    <option value="">All statuses</option>
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <PremiumDataTable
                title="Tour requests"
                description="Custom tour and seasonal package request form submissions."
                data={bookingRows}
                columns={columns}
                rowKey={(row) => row.id}
                selectionLabel={(row) => row.reference}
                onView={(row) => router.visit(`/admin/bookings/${row.id}`)}
                onEdit={(row) => router.visit(`/admin/bookings/${row.id}?edit=1`)}
                onPrint={(row) => handlePrint(row)}
                onDelete={(row) => {
                    if (confirm(`Delete ${row.reference}?`)) {
                        router.delete(`/admin/bookings/${row.id}`, { preserveScroll: true });
                    }
                }}
            />
        </div>
    );
}

Bookings.layout = withAdminLayout('Tour bookings');
