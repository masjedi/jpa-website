import { Head, router, usePage } from '@inertiajs/react';
import { Compass, Plus } from 'lucide-react';
import { Suspense, lazy, useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import {
    buildDestinationFormData,
    type DestinationFormSubmitPayload,
} from '@/components/admin/destinationForm';
import {
    buildDestinationViewModel,
    managedDestinationToFormValues,
    type ManagedDestination,
} from '@/components/admin/destinationView';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { withAdminLayout } from '@/layouts/withAdminLayout';

const DestinationFormDialog = lazy(() =>
    import('@/components/admin/DestinationFormDialog').then((module) => ({
        default: module.DestinationFormDialog,
    })),
);

const ContentRecordViewDialog = lazy(() =>
    import('@/components/admin/ContentRecordViewDialog').then((module) => ({
        default: module.ContentRecordViewDialog,
    })),
);

type DestinationStatus = 'Published' | 'Draft';

interface DestinationRow {
    id: number;
    name: string;
    slug: string;
    region: string;
    tagline: string;
    tours: number;
    status: DestinationStatus;
}

interface DestinationsPageProps {
    destinations: ManagedDestination[];
}

function buildDestinationRow(destination: ManagedDestination): DestinationRow {
    return {
        id: destination.id,
        name: destination.name,
        slug: destination.slug,
        region: destination.region,
        tagline: destination.tagline,
        tours: destination.linkedToursCount ?? destination.linkedTours?.length ?? 0,
        status: destination.status,
    };
}

const statusStyles: Record<DestinationStatus, string> = {
    Published: 'bg-secondary/10 text-secondary',
    Draft: 'bg-accent/15 text-accent',
};

const columns: DataTableColumn<DestinationRow>[] = [
    {
        id: 'destination',
        header: 'Destination',
        accessor: (row) => row.name,
        render: (row) => (
            <div className="max-w-sm">
                <p className="font-medium text-foreground">{row.name}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {row.tagline}
                </p>
            </div>
        ),
    },
    { id: 'region', header: 'Region', accessor: (row) => row.region },
    { id: 'slug', header: 'Slug', accessor: (row) => row.slug },
    { id: 'tours', header: 'Linked tours', accessor: (row) => row.tours },
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
];

function submitDestinationForm(
    payload: DestinationFormSubmitPayload,
    editingDestinationId: number | null,
): Promise<void> {
    const formData = buildDestinationFormData(payload);

    return new Promise((resolve, reject) => {
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                router.flush('/destinations');
                resolve();
            },
            onError: () => reject(),
        };

        if (editingDestinationId !== null) {
            formData.append('_method', 'patch');
            router.post(`/admin/destinations/${editingDestinationId}`, formData, options);

            return;
        }

        router.post('/admin/destinations', formData, options);
    });
}

export default function Destinations({ destinations }: DestinationsPageProps) {
    const { flash } = usePage().props;
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editingDestinationId, setEditingDestinationId] = useState<number | null>(null);
    const [viewingDestinationId, setViewingDestinationId] = useState<number | null>(null);

    const rows = destinations.map(buildDestinationRow);
    const publishedCount = destinations.filter(
        (destination) => destination.status === 'Published',
    ).length;
    const editingDestination = editingDestinationId
        ? destinations.find((destination) => destination.id === editingDestinationId) ?? null
        : null;
    const viewingDestination = viewingDestinationId
        ? destinations.find((destination) => destination.id === viewingDestinationId) ?? null
        : null;

    const openCreateForm = () => {
        setEditingDestinationId(null);
        setFormOpen(true);
    };

    const openEditForm = (row: DestinationRow) => {
        setEditingDestinationId(row.id);
        setFormOpen(true);
    };

    const openViewDialog = (row: DestinationRow) => {
        setViewingDestinationId(row.id);
        setViewOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditingDestinationId(null);
    };

    const closeView = () => {
        setViewOpen(false);
        setViewingDestinationId(null);
    };

    const openEditFromView = () => {
        if (!viewingDestinationId) {
            return;
        }

        closeView();
        setEditingDestinationId(viewingDestinationId);
        setFormOpen(true);
    };

    const handleSubmitDestination = async (payload: DestinationFormSubmitPayload) => {
        await submitDestinationForm(payload, editingDestinationId);
        closeForm();
    };

    const handleDeleteDestination = (row: DestinationRow) => {
        router.delete(`/admin/destinations/${row.id}`, {
            preserveScroll: true,
            onSuccess: () => router.flush('/destinations'),
        });
    };

    return (
        <>
            <Head title="Destinations" />

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
                    eyebrow="Content"
                    title="Destinations"
                    description="Manage Afghan regions, travel highlights, and destination detail pages shown on the public website."
                    icon={Compass}
                    actions={
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95"
                        >
                            <Plus className="size-4" aria-hidden />
                            New destination
                        </button>
                    }
                />

                <PremiumDataTable
                    title="Destination catalog"
                    description={`${publishedCount} published destination${publishedCount === 1 ? '' : 's'} are currently visible on the public site.`}
                    data={rows}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => row.name}
                    initialPageSize={8}
                    onView={openViewDialog}
                    onEdit={openEditForm}
                    onDelete={handleDeleteDestination}
                />
            </div>

            {viewOpen ? (
                <Suspense fallback={null}>
                    <ContentRecordViewDialog
                        open={viewOpen}
                        title="View destination"
                        description={viewingDestination?.name}
                        model={
                            viewingDestination
                                ? buildDestinationViewModel({
                                      destination: viewingDestination,
                                      status: viewingDestination.status,
                                  })
                                : null
                        }
                        onClose={closeView}
                        onEdit={openEditFromView}
                    />
                </Suspense>
            ) : null}

            {formOpen ? (
                <Suspense fallback={null}>
                    <DestinationFormDialog
                        open={formOpen}
                        mode={editingDestinationId ? 'edit' : 'create'}
                        resetKey={
                            editingDestinationId ? String(editingDestinationId) : 'create'
                        }
                        initialValues={
                            editingDestination
                                ? managedDestinationToFormValues(editingDestination)
                                : undefined
                        }
                        onClose={closeForm}
                        onSubmit={handleSubmitDestination}
                    />
                </Suspense>
            ) : null}
        </>
    );
}

Destinations.layout = withAdminLayout('Destinations');
