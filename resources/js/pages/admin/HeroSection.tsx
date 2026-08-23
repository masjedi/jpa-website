import { Head, router } from '@inertiajs/react';
import { Image, Plus } from 'lucide-react';
import { useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { AdminSectionPanel } from '@/components/admin/AdminSectionPanel';
import { ContentRecordViewDialog } from '@/components/admin/ContentRecordViewDialog';
import { HeroEyebrowEditor } from '@/components/admin/HeroEyebrowEditor';
import type { HeroEyebrowFormValues } from '@/components/admin/heroEyebrowForm';
import { HeroSlideFormDialog } from '@/components/admin/HeroSlideFormDialog';
import { heroSlideToFormValues, type HeroSlideFormValues } from '@/components/admin/heroSlideForm';
import { buildHeroSlideViewModel } from '@/components/admin/heroSlideView';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import type { HeroSlide } from '@/types/heroSection';
import { withAdminLayout } from '@/layouts/withAdminLayout';

interface HeroSectionPageProps {
    eyebrow: string;
    slides: HeroSlide[];
}

const statusStyles: Record<HeroSlide['status'], string> = {
    Published: 'bg-secondary/10 text-secondary',
    Draft: 'bg-accent/15 text-accent',
};

const columns: DataTableColumn<HeroSlide>[] = [
    {
        id: 'slide',
        header: 'Slide',
        accessor: (row) => row.title,
        render: (row) => (
            <div className="max-w-md">
                <p className="font-medium text-foreground">{row.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {row.subtitle}
                </p>
            </div>
        ),
    },
    { id: 'title', header: 'Title', accessor: (row) => row.title },
    { id: 'subtitle', header: 'Subtitle', accessor: (row) => row.subtitle },
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

export default function HeroSection({ eyebrow, slides }: HeroSectionPageProps) {
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editingSlideId, setEditingSlideId] = useState<number | null>(null);
    const [viewingSlideId, setViewingSlideId] = useState<number | null>(null);

    const publishedCount = slides.filter((slide) => slide.status === 'Published').length;
    const editingSlide =
        editingSlideId !== null
            ? slides.find((slide) => slide.id === editingSlideId) ?? null
            : null;
    const viewingSlide =
        viewingSlideId !== null
            ? slides.find((slide) => slide.id === viewingSlideId) ?? null
            : null;

    const openCreateForm = () => {
        setEditingSlideId(null);
        setFormOpen(true);
    };

    const openEditForm = (row: HeroSlide) => {
        setEditingSlideId(row.id);
        setFormOpen(true);
    };

    const openViewDialog = (row: HeroSlide) => {
        setViewingSlideId(row.id);
        setViewOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditingSlideId(null);
    };

    const closeView = () => {
        setViewOpen(false);
        setViewingSlideId(null);
    };

    const openEditFromView = () => {
        if (viewingSlideId === null) {
            return;
        }

        closeView();
        setEditingSlideId(viewingSlideId);
        setFormOpen(true);
    };

    const invalidatePublicHome = () => {
        router.flush('/');
    };

    const handleSaveEyebrow = (values: HeroEyebrowFormValues) => {
        router.patch('/admin/hero-section', values, {
            preserveScroll: true,
            onSuccess: invalidatePublicHome,
        });
    };

    const handleSubmitSlide = (values: HeroSlideFormValues) => {
        if (editingSlideId !== null) {
            router.patch(`/admin/hero-section/slides/${editingSlideId}`, values, {
                preserveScroll: true,
                onSuccess: () => {
                    invalidatePublicHome();
                    closeForm();
                },
            });

            return;
        }

        router.post('/admin/hero-section/slides', values, {
            preserveScroll: true,
            onSuccess: () => {
                invalidatePublicHome();
                closeForm();
            },
        });
    };

    const handleDeleteSlide = (row: HeroSlide) => {
        router.delete(`/admin/hero-section/slides/${row.id}`, {
            preserveScroll: true,
            onSuccess: invalidatePublicHome,
        });
    };

    return (
        <>
            <Head title="Hero section" />

            <div className="space-y-4">
                <AdminSectionHeader
                    eyebrow="Public website"
                    title="Hero section"
                    description="Manage the homepage hero carousel — eyebrow label, headline, and supporting subtitle shown to visitors."
                    icon={Image}
                    actions={
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95"
                        >
                            <Plus className="size-4" aria-hidden />
                            New slide
                        </button>
                    }
                />

                <AdminSectionPanel
                    title="Eyebrow label"
                    description="Short label shown above the rotating hero headline on the homepage."
                >
                    <HeroEyebrowEditor key={eyebrow} eyebrow={eyebrow} onSave={handleSaveEyebrow} />
                </AdminSectionPanel>

                <PremiumDataTable
                    title="Hero slides"
                    description={`${publishedCount} published slide${publishedCount === 1 ? '' : 's'} are currently visible in the homepage carousel.`}
                    data={slides}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => row.title}
                    initialPageSize={5}
                    onView={openViewDialog}
                    onEdit={openEditForm}
                    onDelete={handleDeleteSlide}
                />
            </div>

            <ContentRecordViewDialog
                open={viewOpen}
                title="View hero slide"
                description={viewingSlide?.title}
                model={
                    viewingSlide
                        ? buildHeroSlideViewModel({
                              slide: viewingSlide,
                              eyebrow,
                          })
                        : null
                }
                onClose={closeView}
                onEdit={openEditFromView}
            />

            <HeroSlideFormDialog
                open={formOpen}
                mode={editingSlideId !== null ? 'edit' : 'create'}
                resetKey={editingSlideId !== null ? String(editingSlideId) : 'create'}
                initialValues={
                    editingSlide ? heroSlideToFormValues(editingSlide) : undefined
                }
                onClose={closeForm}
                onSubmit={handleSubmitSlide}
            />
        </>
    );
}

HeroSection.layout = withAdminLayout('Hero section');
