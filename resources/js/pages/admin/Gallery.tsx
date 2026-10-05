import { router, usePage } from '@inertiajs/react';
import { Images, Plus } from 'lucide-react';
import { Suspense, lazy, useState } from 'react';

import {
    buildGalleryBulkFormData,
    buildGalleryEditFormData,
    galleryPhotoToEditFormValues,
    type GalleryBulkFormSubmitPayload,
    type GalleryEditFormSubmitPayload,
} from '@/components/admin/galleryForm';
import {
    buildGalleryViewModel,
} from '@/components/admin/galleryView';
import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { TranslationLocaleBadges } from '@/components/admin/TranslationLocaleBadges';
import { primaryTranslation } from '@/lib/translations';
import type { ManagedGalleryPhoto } from '@/types/gallery';
import { withAdminLayout } from '@/layouts/withAdminLayout';

const GalleryFormDialog = lazy(() =>
    import('@/components/admin/GalleryFormDialog').then((module) => ({
        default: module.GalleryFormDialog,
    })),
);

const ContentRecordViewDialog = lazy(() =>
    import('@/components/admin/ContentRecordViewDialog').then((module) => ({
        default: module.ContentRecordViewDialog,
    })),
);

type GalleryStatus = 'Published' | 'Draft';

interface GalleryPageProps {
    photos: ManagedGalleryPhoto[];
}

const statusStyles: Record<GalleryStatus, string> = {
    Published: 'bg-secondary/10 text-secondary',
    Draft: 'bg-accent/15 text-accent',
};

const columns: DataTableColumn<ManagedGalleryPhoto>[] = [
    {
        id: 'preview',
        header: 'Preview',
        accessor: (row) => primaryTranslation(row.caption),
        sortable: false,
        searchable: false,
        render: (row) => (
            <div className="size-14 overflow-hidden rounded-lg border border-border bg-surface-muted">
                {row.thumbSrc ? (
                    <img src={row.thumbSrc} alt="" className="size-full object-cover" />
                ) : null}
            </div>
        ),
    },
    {
        id: 'photo',
        header: 'Photo',
        accessor: (row) => primaryTranslation(row.caption),
        render: (row) => (
            <div className="max-w-sm">
                <p className="font-medium text-foreground">{primaryTranslation(row.caption)}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {primaryTranslation(row.alt)}
                </p>
                <TranslationLocaleBadges value={row.caption} />
            </div>
        ),
    },
    { id: 'sort', header: 'Sort', accessor: (row) => row.sortOrder },
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

function submitGalleryBulkForm(payload: GalleryBulkFormSubmitPayload): Promise<void> {
    const formData = buildGalleryBulkFormData(payload);

    return new Promise((resolve, reject) => {
        router.post('/admin/gallery', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                router.flush('/gallery');
                router.flush('/');
                resolve();
            },
            onError: () => reject(),
        });
    });
}

function submitGalleryEditForm(
    payload: GalleryEditFormSubmitPayload,
    editingPhotoId: number,
): Promise<void> {
    const formData = buildGalleryEditFormData(payload);
    formData.append('_method', 'patch');

    return new Promise((resolve, reject) => {
        router.post(`/admin/gallery/${editingPhotoId}`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                router.flush('/gallery');
                router.flush('/');
                resolve();
            },
            onError: () => reject(),
        });
    });
}

export default function Gallery({ photos }: GalleryPageProps) {
    const { flash } = usePage().props;
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [editingPhotoId, setEditingPhotoId] = useState<number | null>(null);
    const [viewingPhotoId, setViewingPhotoId] = useState<number | null>(null);

    const publishedCount = photos.filter((photo) => photo.status === 'Published').length;
    const editingPhoto = editingPhotoId
        ? photos.find((photo) => photo.id === editingPhotoId) ?? null
        : null;
    const viewingPhoto = viewingPhotoId
        ? photos.find((photo) => photo.id === viewingPhotoId) ?? null
        : null;

    const openCreateForm = () => {
        setFormMode('create');
        setEditingPhotoId(null);
        setFormOpen(true);
    };

    const openEditForm = (row: ManagedGalleryPhoto) => {
        setFormMode('edit');
        setEditingPhotoId(row.id);
        setFormOpen(true);
    };

    const openViewDialog = (row: ManagedGalleryPhoto) => {
        setViewingPhotoId(row.id);
        setViewOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditingPhotoId(null);
    };

    const closeView = () => {
        setViewOpen(false);
        setViewingPhotoId(null);
    };

    const openEditFromView = () => {
        if (!viewingPhotoId) {
            return;
        }

        closeView();
        setFormMode('edit');
        setEditingPhotoId(viewingPhotoId);
        setFormOpen(true);
    };

    const handleSubmitBulk = async (payload: GalleryBulkFormSubmitPayload) => {
        await submitGalleryBulkForm(payload);
        closeForm();
    };

    const handleSubmitEdit = async (payload: GalleryEditFormSubmitPayload) => {
        if (editingPhotoId === null) {
            return;
        }

        await submitGalleryEditForm(payload, editingPhotoId);
        closeForm();
    };

    const handleDeletePhoto = (row: ManagedGalleryPhoto) => {
        router.delete(`/admin/gallery/${row.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                router.flush('/gallery');
                router.flush('/');
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
                    eyebrow="Content"
                    title="Gallery"
                    description="Manage travel photography shown on the public gallery page and home preview."
                    icon={Images}
                    actions={
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95"
                        >
                            <Plus className="size-4" aria-hidden />
                            Upload photos
                        </button>
                    }
                />

                <PremiumDataTable
                    title="Photo library"
                    description={`${publishedCount} published photo${publishedCount === 1 ? '' : 's'} are currently visible on the public site.`}
                    data={photos}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => primaryTranslation(row.caption)}
                    initialPageSize={8}
                    onView={openViewDialog}
                    onEdit={openEditForm}
                    onDelete={handleDeletePhoto}
                />
            </div>

            {viewOpen ? (
                <Suspense fallback={null}>
                    <ContentRecordViewDialog
                        open={viewOpen}
                        title="View gallery photo"
                        description={
                            viewingPhoto ? primaryTranslation(viewingPhoto.caption) : undefined
                        }
                        model={
                            viewingPhoto
                                ? buildGalleryViewModel({
                                      photo: viewingPhoto,
                                      status: viewingPhoto.status,
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
                    <GalleryFormDialog
                        open={formOpen}
                        mode={formMode}
                        resetKey={
                            formMode === 'edit' && editingPhotoId
                                ? String(editingPhotoId)
                                : 'create'
                        }
                        initialEditValues={
                            editingPhoto ? galleryPhotoToEditFormValues(editingPhoto) : undefined
                        }
                        onClose={closeForm}
                        onSubmitBulk={handleSubmitBulk}
                        onSubmitEdit={handleSubmitEdit}
                    />
                </Suspense>
            ) : null}
        </>
    );
}

Gallery.layout = withAdminLayout('Gallery');
