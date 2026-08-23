import { Head, router, usePage } from '@inertiajs/react';
import { Map, Plus } from 'lucide-react';
import { Suspense, lazy, useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import {
    buildTourFormData,
    listingTypeLabel,
    type TourFormSubmitPayload,
} from '@/components/admin/tourForm';
import {
    buildOfferViewModel,
    offerToFormValues,
    type ManagedOffer,
} from '@/components/admin/tourView';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { withAdminLayout } from '@/layouts/withAdminLayout';

const TourFormDialog = lazy(() =>
    import('@/components/admin/TourFormDialog').then((module) => ({
        default: module.TourFormDialog,
    })),
);

const ContentRecordViewDialog = lazy(() =>
    import('@/components/admin/ContentRecordViewDialog').then((module) => ({
        default: module.ContentRecordViewDialog,
    })),
);

type TourStatus = 'Published' | 'Draft';

interface OfferRow {
    id: number;
    title: string;
    slug: string;
    listingType: ManagedOffer['listingType'];
    region: string;
    style: string;
    duration: string;
    status: TourStatus;
}

interface ToursPageProps {
    offers: ManagedOffer[];
}

function buildOfferRow(offer: ManagedOffer): OfferRow {
    if (offer.listingType === 'package') {
        return {
            id: offer.id,
            title: offer.title,
            slug: offer.slug,
            listingType: offer.listingType,
            region: 'Packages section',
            style: '—',
            duration: offer.duration,
            status: offer.status,
        };
    }

    return {
        id: offer.id,
        title: offer.title,
        slug: offer.slug,
        listingType: offer.listingType,
        region: offer.region,
        style: offer.travelStyle,
        duration: offer.duration,
        status: offer.status,
    };
}

const statusStyles: Record<TourStatus, string> = {
    Published: 'bg-secondary/10 text-secondary',
    Draft: 'bg-accent/15 text-accent',
};

const listingTypeStyles: Record<ManagedOffer['listingType'], string> = {
    tour: 'bg-primary/10 text-primary',
    package: 'bg-accent/15 text-accent-foreground',
};

const columns: DataTableColumn<OfferRow>[] = [
    {
        id: 'offer',
        header: 'Listing',
        accessor: (row) => row.title,
        render: (row) => (
            <div className="max-w-sm">
                <p className="font-medium text-foreground">{row.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{row.region}</p>
            </div>
        ),
    },
    {
        id: 'type',
        header: 'Type',
        accessor: (row) => row.listingType,
        render: (row) => (
            <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${listingTypeStyles[row.listingType]}`}
            >
                {listingTypeLabel(row.listingType)}
            </span>
        ),
    },
    { id: 'style', header: 'Style', accessor: (row) => row.style },
    { id: 'duration', header: 'Duration', accessor: (row) => row.duration },
    { id: 'slug', header: 'Slug', accessor: (row) => row.slug },
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

function submitTourForm(
    payload: TourFormSubmitPayload,
    editingOfferId: number | null,
): Promise<void> {
    const formData = buildTourFormData(payload);

    return new Promise((resolve, reject) => {
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                router.flush('/tours');
                resolve();
            },
            onError: () => reject(),
        };

        if (editingOfferId !== null) {
            formData.append('_method', 'patch');
            router.post(`/admin/tours/${editingOfferId}`, formData, options);

            return;
        }

        router.post('/admin/tours', formData, options);
    });
}

export default function Tours({ offers }: ToursPageProps) {
    const { flash } = usePage().props;
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editingOfferId, setEditingOfferId] = useState<number | null>(null);
    const [viewingOfferId, setViewingOfferId] = useState<number | null>(null);

    const rows = offers.map(buildOfferRow);
    const publishedCount = offers.filter((offer) => offer.status === 'Published').length;
    const tourCount = offers.filter((offer) => offer.listingType === 'tour').length;
    const packageCount = offers.filter((offer) => offer.listingType === 'package').length;
    const editingOffer = editingOfferId
        ? offers.find((offer) => offer.id === editingOfferId) ?? null
        : null;
    const viewingOffer = viewingOfferId
        ? offers.find((offer) => offer.id === viewingOfferId) ?? null
        : null;

    const openCreateForm = () => {
        setEditingOfferId(null);
        setFormOpen(true);
    };

    const openEditForm = (row: OfferRow) => {
        setEditingOfferId(row.id);
        setFormOpen(true);
    };

    const openViewDialog = (row: OfferRow) => {
        setViewingOfferId(row.id);
        setViewOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditingOfferId(null);
    };

    const closeView = () => {
        setViewOpen(false);
        setViewingOfferId(null);
    };

    const openEditFromView = () => {
        if (!viewingOfferId) {
            return;
        }

        closeView();
        setEditingOfferId(viewingOfferId);
        setFormOpen(true);
    };

    const handleSubmitOffer = async (payload: TourFormSubmitPayload) => {
        await submitTourForm(payload, editingOfferId);
        closeForm();
    };

    const handleDeleteOffer = (row: OfferRow) => {
        router.delete(`/admin/tours/${row.id}`, {
            preserveScroll: true,
            onSuccess: () => router.flush('/tours'),
        });
    };

    return (
        <>
            <Head title="Tours" />

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
                    title="Tours & packages"
                    description="Manage tour itineraries and ready-to-request packages with the same fields used on the public filters and listing pages."
                    icon={Map}
                    actions={
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95"
                        >
                            <Plus className="size-4" aria-hidden />
                            New listing
                        </button>
                    }
                />

                <PremiumDataTable
                    title="Tour & package library"
                    description={`${publishedCount} published listing${publishedCount === 1 ? '' : 's'} (${packageCount} package${packageCount === 1 ? '' : 's'}, ${tourCount} tour${tourCount === 1 ? '' : 's'}) in the library.`}
                    data={rows}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => row.title}
                    initialPageSize={8}
                    onView={openViewDialog}
                    onEdit={openEditForm}
                    onDelete={handleDeleteOffer}
                />
            </div>

            {viewOpen ? (
                <Suspense fallback={null}>
                    <ContentRecordViewDialog
                        open={viewOpen}
                        title="View listing"
                        description={viewingOffer?.title}
                        model={viewingOffer ? buildOfferViewModel(viewingOffer) : null}
                        onClose={closeView}
                        onEdit={openEditFromView}
                    />
                </Suspense>
            ) : null}

            {formOpen ? (
                <Suspense fallback={null}>
                    <TourFormDialog
                        open={formOpen}
                        mode={editingOfferId ? 'edit' : 'create'}
                        resetKey={editingOfferId ? String(editingOfferId) : 'create'}
                        initialValues={editingOffer ? offerToFormValues(editingOffer) : undefined}
                        onClose={closeForm}
                        onSubmit={handleSubmitOffer}
                    />
                </Suspense>
            ) : null}
        </>
    );
}

Tours.layout = withAdminLayout('Tours');
