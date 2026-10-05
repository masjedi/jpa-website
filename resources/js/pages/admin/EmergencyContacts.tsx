import { Link, router, usePage } from '@inertiajs/react';
import { Phone, Plus } from 'lucide-react';
import { Suspense, lazy, useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { adminFieldClass } from '@/components/admin/adminForm';
import { ContentRecordViewDialog } from '@/components/admin/ContentRecordViewDialog';
import {
    buildEmergencyContactPayload,
    emergencyContactToFormValues,
    type EmergencyContactFormValues,
} from '@/components/admin/emergencyContactForm';
import { buildEmergencyContactViewModel } from '@/components/admin/emergencyContactView';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import { cn } from '@/lib/utils';
import type { SharedPageProps } from '@/types/inertia';
import type {
    EmergencyContactFilters,
    EmergencyContactProvinceOption,
    EmergencyContactRow,
    EmergencyContactVerificationAge,
    EmergencyTypeOption,
} from '@/types/emergencyContacts';

const EmergencyContactFormDialog = lazy(() =>
    import('@/components/admin/EmergencyContactFormDialog').then((module) => ({
        default: module.EmergencyContactFormDialog,
    })),
);

const statusStyles: Record<EmergencyContactRow['status'], string> = {
    Active: 'bg-secondary/10 text-secondary',
    Inactive: 'bg-surface-muted text-muted-foreground',
};

const verificationAgeStyles: Record<EmergencyContactVerificationAge, string> = {
    recent: 'bg-secondary/10 text-secondary',
    aging: 'bg-accent/15 text-accent',
    stale: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

const columns: DataTableColumn<EmergencyContactRow>[] = [
    { id: 'province', header: 'Province', accessor: (row) => row.province, sortable: true },
    {
        id: 'name',
        header: 'Official / Contact Name',
        accessor: (row) => row.fullName,
        render: (row) => (
            <div className="max-w-xs">
                <p className="font-medium text-foreground">{row.fullName}</p>
                <p className="text-xs text-muted-foreground">{row.organization}</p>
            </div>
        ),
    },
    { id: 'position', header: 'Position', accessor: (row) => row.position },
    { id: 'organization', header: 'Organization', accessor: (row) => row.organization },
    { id: 'type', header: 'Emergency Type', accessor: (row) => row.emergencyTypeLabel },
    { id: 'phone', header: 'Primary Phone', accessor: (row) => row.primaryPhone },
    {
        id: 'verified',
        header: 'Last Verified',
        accessor: (row) => row.lastVerifiedAt,
        render: (row) => (
            <div>
                <p className="text-sm text-foreground">{row.lastVerifiedLabel}</p>
                <span
                    className={cn(
                        'mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium',
                        verificationAgeStyles[row.verificationAge],
                    )}
                >
                    {row.verificationAgeLabel}
                </span>
            </div>
        ),
    },
    {
        id: 'status',
        header: 'Status',
        accessor: (row) => row.status,
        render: (row) => (
            <span
                className={cn(
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                    statusStyles[row.status],
                )}
            >
                {row.status}
            </span>
        ),
    },
    {
        id: 'shareable',
        header: 'Customer Shareable',
        accessor: (row) => (row.isEligibleForCustomerSharing ? 'Yes' : 'No'),
    },
];

interface PaginatedContacts {
    data: EmergencyContactRow[];
    links?: { url: string | null; label: string; active: boolean }[];
    meta?: {
        total: number;
        current_page: number;
        last_page: number;
        links?: { url: string | null; label: string; active: boolean }[];
    };
}

interface EmergencyContactsPageProps extends SharedPageProps {
    contacts: PaginatedContacts;
    filters: EmergencyContactFilters;
    provinces: EmergencyContactProvinceOption[];
    emergencyTypes: EmergencyTypeOption[];
    statusOptions: string[];
}

function submitEmergencyContactForm(
    values: EmergencyContactFormValues,
    editingId: number | null,
): Promise<void> {
    const payload = buildEmergencyContactPayload(values);

    return new Promise((resolve, reject) => {
        const options = {
            preserveScroll: true,
            onSuccess: () => resolve(),
            onError: () => reject(),
        };

        if (editingId !== null) {
            router.patch(`/admin/emergency-contacts/${editingId}`, payload, options);

            return;
        }

        router.post('/admin/emergency-contacts', payload, options);
    });
}

export default function EmergencyContacts({
    contacts,
    filters,
    provinces = [],
    emergencyTypes = [],
    statusOptions = ['Active', 'Inactive'],
}: EmergencyContactsPageProps) {
    const { flash } = usePage().props;
    const rows = contacts?.data ?? [];
    const [search, setSearch] = useState(filters?.search ?? '');
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [formResetKey, setFormResetKey] = useState('create');
    const [editingContact, setEditingContact] = useState<EmergencyContactRow | null>(null);
    const [viewingContact, setViewingContact] = useState<EmergencyContactRow | null>(null);

    const applyFilters = (next: Partial<EmergencyContactFilters>) => {
        router.get(
            '/admin/emergency-contacts',
            {
                search: next.search ?? search,
                province_id: next.province_id ?? filters.province_id,
                emergency_type: next.emergency_type ?? filters.emergency_type,
                status: next.status ?? filters.status,
                shareable: next.shareable ?? filters.shareable,
                sort: next.sort ?? filters.sort,
                direction: next.direction ?? filters.direction,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const openCreateDialog = () => {
        setFormMode('create');
        setEditingContact(null);
        setFormResetKey(`create-${Date.now()}`);
        setFormOpen(true);
    };

    const openEditDialog = (contact: EmergencyContactRow) => {
        setFormMode('edit');
        setEditingContact(contact);
        setFormResetKey(`edit-${contact.id}-${Date.now()}`);
        setFormOpen(true);
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

                <AdminSectionHeader
                    eyebrow="Configuration"
                    title="Emergency Contacts"
                    description="Verified provincial contacts for operational use. This directory is not published on the public website."
                    icon={Phone}
                    actions={
                        <button
                            type="button"
                            onClick={openCreateDialog}
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            <Plus className="size-4" aria-hidden />
                            New contact
                        </button>
                    }
                />

                <form
                    className="grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
                    onSubmit={(event) => {
                        event.preventDefault();
                        applyFilters({ search });
                    }}
                >
                    <label className="text-xs font-medium text-muted-foreground xl:col-span-2">
                        Search
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Name, organization, position, or phone"
                            className={`${adminFieldClass} mt-1.5`}
                        />
                    </label>
                    <label className="text-xs font-medium text-muted-foreground">
                        Province
                        <select
                            value={filters?.province_id ?? ''}
                            onChange={(event) => applyFilters({ province_id: event.target.value })}
                            className={`${adminFieldClass} mt-1.5`}
                        >
                            <option value="">All provinces</option>
                            {provinces.map((province) => (
                                <option key={province.id} value={province.id}>
                                    {province.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="text-xs font-medium text-muted-foreground">
                        Emergency type
                        <select
                            value={filters?.emergency_type ?? ''}
                            onChange={(event) => applyFilters({ emergency_type: event.target.value })}
                            className={`${adminFieldClass} mt-1.5`}
                        >
                            <option value="">All types</option>
                            {emergencyTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="text-xs font-medium text-muted-foreground">
                        Status
                        <select
                            value={filters?.status ?? ''}
                            onChange={(event) => applyFilters({ status: event.target.value })}
                            className={`${adminFieldClass} mt-1.5`}
                        >
                            <option value="">All statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </label>
                    <label className="text-xs font-medium text-muted-foreground">
                        Customer shareable
                        <select
                            value={filters?.shareable ?? ''}
                            onChange={(event) => applyFilters({ shareable: event.target.value })}
                            className={`${adminFieldClass} mt-1.5`}
                        >
                            <option value="">All</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </label>
                    <label className="text-xs font-medium text-muted-foreground">
                        Sort
                        <select
                            value={filters?.sort ?? 'last_verified_at'}
                            onChange={(event) => applyFilters({ sort: event.target.value })}
                            className={`${adminFieldClass} mt-1.5`}
                        >
                            <option value="last_verified_at">Last verified</option>
                            <option value="full_name">Name</option>
                            <option value="province">Province</option>
                            <option value="organization">Organization</option>
                        </select>
                    </label>
                    <label className="text-xs font-medium text-muted-foreground">
                        Direction
                        <select
                            value={filters?.direction ?? 'desc'}
                            onChange={(event) => applyFilters({ direction: event.target.value })}
                            className={`${adminFieldClass} mt-1.5`}
                        >
                            <option value="desc">Newest first</option>
                            <option value="asc">Oldest first</option>
                        </select>
                    </label>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <PremiumDataTable
                    title="Provincial directory"
                    description="Server-filtered list. Deactivate a contact instead of deleting it."
                    data={rows}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => `${row.fullName} — ${row.province}`}
                    initialPageSize={15}
                    emptyTitle="No emergency contacts"
                    emptyDescription="Add a verified provincial contact, or change the filters."
                    onRefresh={() => router.reload({ only: ['contacts'] })}
                    onView={(row) => setViewingContact(row)}
                    onEdit={(row) => openEditDialog(row)}
                    onDelete={(row) => {
                        router.patch(`/admin/emergency-contacts/${row.id}/deactivate`, {}, {
                            preserveScroll: true,
                        });
                    }}
                />

                {((contacts?.meta?.links ?? contacts?.links) ?? []).length > 3 ? (
                    <nav className="flex flex-wrap justify-center gap-1" aria-label="Pagination">
                        {((contacts.meta?.links ?? contacts.links) ?? []).map((link) =>
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

            <Suspense fallback={null}>
                <EmergencyContactFormDialog
                    open={formOpen}
                    mode={formMode}
                    resetKey={formResetKey}
                    provinces={provinces}
                    emergencyTypes={emergencyTypes}
                    statusOptions={statusOptions}
                    initialValues={
                        editingContact ? emergencyContactToFormValues(editingContact) : undefined
                    }
                    onClose={() => setFormOpen(false)}
                    onSubmit={(values) =>
                        submitEmergencyContactForm(values, editingContact?.id ?? null)
                    }
                />
            </Suspense>

            <ContentRecordViewDialog
                open={viewingContact !== null}
                title="Emergency contact"
                description="Staff-only operational details."
                size="lg"
                model={viewingContact ? buildEmergencyContactViewModel(viewingContact) : null}
                onClose={() => setViewingContact(null)}
                onEdit={
                    viewingContact
                        ? () => {
                              const contact = viewingContact;
                              setViewingContact(null);
                              openEditDialog(contact);
                          }
                        : undefined
                }
            />
        </>
    );
}

EmergencyContacts.layout = withAdminLayout('Emergency Contacts');
