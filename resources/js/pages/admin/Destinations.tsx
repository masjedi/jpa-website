import { Head } from '@inertiajs/react';
import { Compass, Plus } from 'lucide-react';
import { useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { ContentRecordViewDialog } from '@/components/admin/ContentRecordViewDialog';
import { DestinationFormDialog } from '@/components/admin/DestinationFormDialog';
import { buildDestinationViewModel } from '@/components/admin/destinationView';
import {
    destinationToFormValues,
    slugifyDestinationName,
    type DestinationFormValues,
} from '@/components/admin/destinationForm';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { allDestinations } from '@/data/destinationsData';
import { getToursForDestination } from '@/data/destinationTours';
import type { Destination } from '@/types/destinations';
import { withAdminLayout } from '@/layouts/withAdminLayout';

type DestinationStatus = 'Published' | 'Draft';

interface ManagedDestination extends Destination {
    status: DestinationStatus;
}

interface DestinationRow {
    id: string;
    name: string;
    slug: string;
    region: string;
    tagline: string;
    tours: number;
    status: DestinationStatus;
}

function buildDestinationRow(destination: ManagedDestination): DestinationRow {
    return {
        id: destination.id,
        name: destination.name,
        slug: destination.slug,
        region: destination.region,
        tagline: destination.tagline,
        tours: getToursForDestination(destination).length,
        status: destination.status,
    };
}

function buildInitialDestinations(): ManagedDestination[] {
    return allDestinations.map((destination) => ({
        ...destination,
        status: destination.slug === 'nuristan' ? 'Draft' : 'Published',
    }));
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

export default function Destinations() {
    const [destinations, setDestinations] = useState<ManagedDestination[]>(buildInitialDestinations);
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editingDestinationId, setEditingDestinationId] = useState<string | null>(null);
    const [viewingDestinationId, setViewingDestinationId] = useState<string | null>(null);

    const rows = destinations.map(buildDestinationRow);
    const publishedCount = destinations.filter((destination) => destination.status === 'Published').length;
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

    const handleSubmitDestination = (values: DestinationFormValues) => {
        if (editingDestinationId) {
            setDestinations((current) =>
                current.map((destination) =>
                    destination.id === editingDestinationId
                        ? {
                              ...destination,
                              name: values.name,
                              tagline: values.tagline,
                              region: values.region,
                              image: values.image,
                              description: values.description,
                              status: values.status,
                              tourMatchKeywords: [
                                  ...new Set([
                                      ...destination.tourMatchKeywords,
                                      values.name,
                                      values.region,
                                  ]),
                              ],
                          }
                        : destination,
                ),
            );

            return;
        }

        const slug = slugifyDestinationName(values.name);

        const destination: ManagedDestination = {
            id: slug,
            slug,
            name: values.name,
            tagline: values.tagline,
            region: values.region,
            image: values.image,
            description: values.description,
            highlights: [],
            bestSeason: '',
            travelStyle: '',
            practicalNotes: [],
            tourMatchKeywords: [values.name, values.region],
            status: values.status,
        };

        setDestinations((current) => [destination, ...current]);
    };

    return (
        <>
            <Head title="Destinations" />

            <div className="space-y-4">
                <AdminSectionHeader
                    eyebrow="Public website"
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
                    initialPageSize={5}
                    onView={openViewDialog}
                    onEdit={openEditForm}
                />
            </div>

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

            <DestinationFormDialog
                open={formOpen}
                mode={editingDestinationId ? 'edit' : 'create'}
                resetKey={editingDestinationId ?? 'create'}
                initialValues={
                    editingDestination
                        ? destinationToFormValues(editingDestination, editingDestination.status)
                        : undefined
                }
                onClose={closeForm}
                onSubmit={handleSubmitDestination}
            />
        </>
    );
}

Destinations.layout = withAdminLayout('Destinations');
