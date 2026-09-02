import { router, usePage } from '@inertiajs/react';
import { Briefcase, Plus } from 'lucide-react';
import { useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { ContentRecordViewDialog } from '@/components/admin/ContentRecordViewDialog';
import { ServiceFormDialog } from '@/components/admin/ServiceFormDialog';
import {
    buildServicePayload,
    serviceToFormValues,
    type ServiceFormValues,
} from '@/components/admin/serviceForm';
import { buildServiceViewModel } from '@/components/admin/serviceView';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import type {
    ServiceCategory,
    ServiceIconOption,
    ServiceOffering,
} from '@/types/services';

const statusStyles: Record<ServiceOffering['status'], string> = {
    Published: 'bg-secondary/10 text-secondary',
    Draft: 'bg-accent/15 text-accent',
};

const columns: DataTableColumn<ServiceOffering>[] = [
    {
        id: 'service',
        header: 'Service',
        accessor: (row) => row.title,
        render: (row) => (
            <div className="max-w-md">
                <p className="font-medium text-foreground">{row.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {row.tagline}
                </p>
            </div>
        ),
    },
    { id: 'category', header: 'Category', accessor: (row) => row.category },
    {
        id: 'placement',
        header: 'Placement',
        accessor: (row) =>
            [row.isFeatured ? 'Featured' : '', row.showOnHome ? 'Home' : '']
                .filter(Boolean)
                .join(', ') || 'Catalogue',
        render: (row) => (
            <p className="text-sm text-muted-foreground">
                {[row.isFeatured ? 'Featured' : null, row.showOnHome ? 'Home' : null]
                    .filter(Boolean)
                    .join(' · ') || 'Catalogue'}
            </p>
        ),
    },
    {
        id: 'status',
        header: 'Status',
        accessor: (row) => row.status,
        render: (row) => (
            <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[row.status]}`}
            >
                {row.status}
            </span>
        ),
    },
    { id: 'order', header: 'Order', accessor: (row) => row.order },
    { id: 'updated', header: 'Updated', accessor: (row) => row.updated },
];

interface ServicesPageProps {
    items: ServiceOffering[];
    iconOptions: ServiceIconOption[];
    categoryOptions: ServiceCategory[];
}

function submitServiceForm(
    values: ServiceFormValues,
    editingItemId: number | null,
): Promise<void> {
    const payload = buildServicePayload(values);

    return new Promise((resolve, reject) => {
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                router.flush('/');
                router.flush('/services');
                resolve();
            },
            onError: () => reject(),
        };

        if (editingItemId !== null) {
            router.patch(`/admin/services/${editingItemId}`, payload, options);

            return;
        }

        router.post('/admin/services', payload, options);
    });
}

export default function Services({
    items,
    iconOptions,
    categoryOptions,
}: ServicesPageProps) {
    const { flash } = usePage().props;
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [viewingItemId, setViewingItemId] = useState<number | null>(null);

    const publishedCount = items.filter((item) => item.status === 'Published').length;
    const editingItem =
        editingItemId !== null ? items.find((item) => item.id === editingItemId) ?? null : null;
    const viewingItem =
        viewingItemId !== null ? items.find((item) => item.id === viewingItemId) ?? null : null;

    const openCreateForm = () => {
        setEditingItemId(null);
        setFormOpen(true);
    };

    const openEditForm = (row: ServiceOffering) => {
        setEditingItemId(row.id);
        setFormOpen(true);
    };

    const openViewDialog = (row: ServiceOffering) => {
        setViewingItemId(row.id);
        setViewOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditingItemId(null);
    };

    const closeView = () => {
        setViewOpen(false);
        setViewingItemId(null);
    };

    const openEditFromView = () => {
        if (viewingItemId === null) {
            return;
        }

        closeView();
        setEditingItemId(viewingItemId);
        setFormOpen(true);
    };

    const handleSubmitService = async (values: ServiceFormValues) => {
        await submitServiceForm(values, editingItemId);
        closeForm();
    };

    const handleDeleteService = (row: ServiceOffering) => {
        router.delete(`/admin/services/${row.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                router.flush('/');
                router.flush('/services');
            },
        });
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
                    eyebrow="Public website"
                    title="Services"
                    description="Manage the offerings shown on the public services page and the homepage strip."
                    icon={Briefcase}
                    actions={
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95"
                        >
                            <Plus className="size-4" aria-hidden />
                            New service
                        </button>
                    }
                />

                <PremiumDataTable
                    title="Service catalogue"
                    description={`${publishedCount} published offering${publishedCount === 1 ? '' : 's'} currently visible on the public site.`}
                    data={items}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => row.title}
                    emptyTitle="No services yet"
                    emptyDescription="Add the first offering to show it on the public website."
                    initialPageSize={10}
                    onView={openViewDialog}
                    onEdit={openEditForm}
                    onDelete={handleDeleteService}
                />
            </div>

            <ContentRecordViewDialog
                open={viewOpen}
                title="View service"
                description={viewingItem?.title}
                model={viewingItem ? buildServiceViewModel(viewingItem) : null}
                onClose={closeView}
                onEdit={openEditFromView}
            />

            <ServiceFormDialog
                open={formOpen}
                mode={editingItemId !== null ? 'edit' : 'create'}
                resetKey={editingItemId !== null ? String(editingItemId) : 'create'}
                iconOptions={iconOptions}
                categoryOptions={categoryOptions}
                initialValues={editingItem ? serviceToFormValues(editingItem) : undefined}
                onClose={closeForm}
                onSubmit={handleSubmitService}
            />
        </>
    );
}

Services.layout = withAdminLayout('Services');
