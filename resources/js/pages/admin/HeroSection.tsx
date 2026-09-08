import { router, usePage } from '@inertiajs/react';
import { Image, Plus } from 'lucide-react';
import { useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { AdminSectionPanel } from '@/components/admin/AdminSectionPanel';
import { ContentRecordViewDialog } from '@/components/admin/ContentRecordViewDialog';
import { HeroEyebrowEditor } from '@/components/admin/HeroEyebrowEditor';
import type { HeroEyebrowFormValues } from '@/components/admin/heroEyebrowForm';
import { HeroSlideFormDialog } from '@/components/admin/HeroSlideFormDialog';
import {
    buildHeroSlideFormData,
    heroSlideToFormValues,
    type HeroSlideSubmitPayload,
} from '@/components/admin/heroSlideForm';
import { buildHeroSlideViewModel } from '@/components/admin/heroSlideView';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { primaryTranslation, translationCompletion } from '@/lib/translations';
import type { AdminHeroSection, HeroSlide } from '@/types/heroSection';
import { withAdminLayout } from '@/layouts/withAdminLayout';

interface HeroSectionPageProps extends AdminHeroSection {}

const statusStyles: Record<HeroSlide['status'], string> = {
    Published: 'bg-secondary/10 text-secondary',
    Draft: 'bg-accent/15 text-accent',
};

function submitHeroSlideForm(
    payload: HeroSlideSubmitPayload,
    editingSlideId: number | null,
): Promise<void> {
    const formData = buildHeroSlideFormData(payload);

    return new Promise((resolve, reject) => {
        const options = {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            only: ['slides', 'flash', 'errors'],
            onSuccess: () => {
                router.flush('/');
                resolve();
            },
            onError: () => reject(),
        };

        if (editingSlideId !== null) {
            formData.append('_method', 'patch');
            router.post(`/admin/hero-section/slides/${editingSlideId}`, formData, options);

            return;
        }

        router.post('/admin/hero-section/slides', formData, options);
    });
}

const columns: DataTableColumn<HeroSlide>[] = [
    {
        id: 'preview',
        header: 'Image',
        accessor: (row) => row.imageThumbUrl ?? '',
        render: (row) =>
            row.imageThumbUrl ? (
                <img
                    src={row.imageThumbUrl}
                    alt=""
                    className="size-14 rounded-lg object-cover"
                />
            ) : (
                <span className="text-xs text-muted-foreground">No image</span>
            ),
    },
    {
        id: 'slide',
        header: 'Slide',
        accessor: (row) => primaryTranslation(row.title),
        render: (row) => (
            <div className="max-w-md">
                <p className="font-medium text-foreground">{primaryTranslation(row.title)}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {primaryTranslation(row.subtitle)}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(translationCompletion(row.title)).map(([locale, complete]) => (
                        <span
                            key={locale}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                                complete
                                    ? 'bg-secondary/10 text-secondary'
                                    : 'bg-surface-muted text-muted-foreground'
                            }`}
                        >
                            {locale}
                        </span>
                    ))}
                </div>
            </div>
        ),
    },
    { id: 'title', header: 'Title (EN)', accessor: (row) => row.title.en },
    { id: 'subtitle', header: 'Subtitle (EN)', accessor: (row) => row.subtitle.en },
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
    const { flash } = usePage().props;
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

    const handleSubmitSlide = async (payload: HeroSlideSubmitPayload) => {
        try {
            await submitHeroSlideForm(payload, editingSlideId);
            closeForm();
        } catch {
            // Keep the dialog open; server validation errors sync from page props.
        }
    };

    const handleSaveEyebrow = (values: HeroEyebrowFormValues) => {
        router.patch('/admin/hero-section', values, {
            preserveScroll: true,
            onSuccess: () => router.flush('/'),
        });
    };

    const handleDeleteSlide = (row: HeroSlide) => {
        router.delete(`/admin/hero-section/slides/${row.id}`, {
            preserveScroll: true,
            onSuccess: () => router.flush('/'),
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
                    title="Hero section"
                    description="Manage the homepage hero carousel — eyebrow label, full-screen background images, headlines, and subtitles."
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
                    <HeroEyebrowEditor
                        key={JSON.stringify(eyebrow)}
                        eyebrow={eyebrow}
                        onSave={handleSaveEyebrow}
                    />
                </AdminSectionPanel>

                <PremiumDataTable
                    title="Hero slides"
                    description={`${publishedCount} published slide${publishedCount === 1 ? '' : 's'} in total. The homepage carousel always shows the latest 5 published slides that include a hero image.`}
                    data={slides}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => primaryTranslation(row.title)}
                    initialPageSize={5}
                    onView={openViewDialog}
                    onEdit={openEditForm}
                    onDelete={handleDeleteSlide}
                />
            </div>

            <ContentRecordViewDialog
                open={viewOpen}
                title="View hero slide"
                description={viewingSlide ? primaryTranslation(viewingSlide.title) : undefined}
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
