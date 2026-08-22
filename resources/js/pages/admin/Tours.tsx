import { Head } from '@inertiajs/react';
import { Map, Plus } from 'lucide-react';
import { Suspense, lazy, useEffect, useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import {
    formatTourDuration,
    listingTypeLabel,
    slugifyTourTitle,
    splitMultilineText,
    type TourFormValues,
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
import { SkeletonTable } from '@/components/ui/skeleton';
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
    id: string;
    title: string;
    slug: string;
    listingType: ManagedOffer['listingType'];
    region: string;
    style: string;
    duration: string;
    status: TourStatus;
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

function buildInitialOffers(
    allTours: Awaited<ReturnType<typeof import('@/data/toursData')>>['allTours'],
    tourPackages: Awaited<ReturnType<typeof import('@/data/toursData')>>['tourPackages'],
): ManagedOffer[] {
    const tours: ManagedOffer[] = allTours.map((tour) => ({
        ...tour,
        listingType: 'tour',
        status: 'Published',
    }));

    const packages: ManagedOffer[] = tourPackages.map((pkg) => ({
        ...pkg,
        listingType: 'package',
        status: 'Published',
    }));

    return [...packages, ...tours];
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

function buildTourFromValues(
    values: TourFormValues,
    existing?: Extract<ManagedOffer, { listingType: 'tour' }>,
): Extract<ManagedOffer, { listingType: 'tour' }> {
    const slug = existing?.slug ?? slugifyTourTitle(values.title);
    const highlights = splitMultilineText(values.highlightsText);
    const inclusions = splitMultilineText(values.includedServicesText);

    return {
        listingType: 'tour',
        id: existing?.id ?? slug,
        slug,
        title: values.title,
        destination: values.destination,
        region: values.region,
        durationDays: values.durationDays,
        duration: formatTourDuration(values.durationDays),
        difficulty: values.difficulty,
        travelStyle: values.travelStyle,
        season: existing?.season ?? 'Year-round',
        bestMonths: existing?.bestMonths ?? 'Year-round',
        groupSize: existing?.groupSize ?? 'Max 8 travelers / Private',
        image: values.image,
        badge: values.badge || undefined,
        description: values.summary,
        content: values.content,
        highlights,
        itineraryOverview: existing?.itineraryOverview ?? [],
        inclusions,
        estimatedStartingPrice: values.estimatedStartingPrice,
        nextDeparture: {
            date: values.nextDepartureDate,
            status: values.nextDepartureStatus,
        },
        status: values.status,
    };
}

function buildPackageFromValues(
    values: TourFormValues,
    existing?: Extract<ManagedOffer, { listingType: 'package' }>,
): Extract<ManagedOffer, { listingType: 'package' }> {
    const slug = existing?.slug ?? slugifyTourTitle(values.title);

    return {
        listingType: 'package',
        id: existing?.id ?? slug,
        slug,
        title: values.title,
        tagline: values.tagline,
        duration: formatTourDuration(values.durationDays),
        durationDays: values.durationDays,
        badge: values.badge || 'Package',
        image: values.image,
        description: values.summary,
        featuredPerks: splitMultilineText(values.highlightsText),
        keyDestinations: splitMultilineText(values.keyDestinationsText),
        priceEstimate: values.priceEstimate,
        idealFor: values.idealFor,
        includedServices: splitMultilineText(values.includedServicesText),
        journeyOutline: existing?.journeyOutline,
        isPopular: values.isPopular,
        status: values.status,
    };
}

export default function Tours() {
    const [offers, setOffers] = useState<ManagedOffer[]>([]);
    const [isLoadingOffers, setIsLoadingOffers] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
    const [viewingOfferId, setViewingOfferId] = useState<string | null>(null);

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

    useEffect(() => {
        let cancelled = false;

        void import('@/data/toursData').then((module) => {
            if (cancelled) {
                return;
            }

            setOffers(buildInitialOffers(module.allTours, module.tourPackages));
            setIsLoadingOffers(false);
        });

        return () => {
            cancelled = true;
        };
    }, []);

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

    const handleSubmitOffer = (values: TourFormValues) => {
        if (editingOfferId) {
            setOffers((current) =>
                current.map((offer) => {
                    if (offer.id !== editingOfferId) {
                        return offer;
                    }

                    if (offer.listingType === 'package') {
                        return buildPackageFromValues(values, offer);
                    }

                    return buildTourFromValues(values, offer);
                }),
            );

            return;
        }

        const createdOffer =
            values.listingType === 'package'
                ? buildPackageFromValues(values)
                : buildTourFromValues(values);

        setOffers((current) => [createdOffer, ...current]);
    };

    return (
        <>
            <Head title="Tours" />

            <div className="space-y-4">
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
                    description={
                        isLoadingOffers
                            ? 'Loading tour and package records…'
                            : `${publishedCount} published listing${publishedCount === 1 ? '' : 's'} (${packageCount} package${packageCount === 1 ? '' : 's'}, ${tourCount} tour${tourCount === 1 ? '' : 's'}) visible on the public site.`
                    }
                    data={rows}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => row.title}
                    initialPageSize={8}
                    onView={openViewDialog}
                    onEdit={openEditForm}
                />

                {isLoadingOffers ? (
                    <div className="mt-4">
                        <SkeletonTable rows={6} columns={6} />
                    </div>
                ) : null}
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
                        resetKey={editingOfferId ?? 'create'}
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
