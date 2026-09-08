import { router, usePage } from '@inertiajs/react';
import { MessageSquareQuote, Plus, Star } from 'lucide-react';
import { useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { ContentRecordViewDialog } from '@/components/admin/ContentRecordViewDialog';
import { TestimonialFormDialog } from '@/components/admin/TestimonialFormDialog';
import {
    buildTestimonialFormData,
    testimonialToFormValues,
    type TestimonialFormSubmitPayload,
} from '@/components/admin/testimonialForm';
import { buildTestimonialViewModel } from '@/components/admin/testimonialView';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { TranslationLocaleBadges } from '@/components/admin/TranslationLocaleBadges';
import { primaryTranslation } from '@/lib/translations';
import type { Testimonial, TestimonialAvatarSpec } from '@/types/testimonials';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import { cn } from '@/lib/utils';

const statusStyles: Record<Testimonial['status'], string> = {
    Published: 'bg-secondary/10 text-secondary',
    Draft: 'bg-accent/15 text-accent',
};

function StarRatingPreview({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => (
                <Star
                    key={index}
                    className={cn(
                        'size-3.5',
                        index < rating ? 'fill-accent text-accent' : 'text-border',
                    )}
                    aria-hidden
                />
            ))}
        </div>
    );
}

const columns: DataTableColumn<Testimonial>[] = [
    {
        id: 'testimonial',
        header: 'Testimonial',
        accessor: (row) => primaryTranslation(row.name),
        render: (row) => (
            <div className="flex items-center gap-3 max-w-md">
                <img
                    src={row.image}
                    alt=""
                    className="size-10 shrink-0 rounded-full border-2 border-accent/40 bg-surface-muted object-cover object-center"
                />
                <div>
                    <p className="font-medium text-foreground">{primaryTranslation(row.name)}</p>
                    <p className="mt-1 text-xs text-secondary">{primaryTranslation(row.journey)}</p>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {primaryTranslation(row.text)}
                    </p>
                    <TranslationLocaleBadges value={row.name} />
                </div>
            </div>
        ),
    },
    {
        id: 'rating',
        header: 'Rating',
        accessor: (row) => row.rating,
        render: (row) => <StarRatingPreview rating={row.rating} />,
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

interface TestimonialsPageProps {
    testimonials: Testimonial[];
    avatarSpec: TestimonialAvatarSpec;
}

function submitTestimonialForm(
    payload: TestimonialFormSubmitPayload,
    editingTestimonialId: number | null,
): Promise<void> {
    const formData = buildTestimonialFormData(payload);

    return new Promise((resolve, reject) => {
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                router.flush('/testimonials');
                resolve();
            },
            onError: () => reject(),
        };

        if (editingTestimonialId !== null) {
            formData.append('_method', 'patch');
            router.post(`/admin/testimonials/${editingTestimonialId}`, formData, options);

            return;
        }

        router.post('/admin/testimonials', formData, options);
    });
}

export default function Testimonials({ testimonials, avatarSpec }: TestimonialsPageProps) {
    const { flash } = usePage().props;
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);
    const [viewingTestimonialId, setViewingTestimonialId] = useState<number | null>(null);

    const publishedCount = testimonials.filter((item) => item.status === 'Published').length;
    const editingTestimonial =
        editingTestimonialId !== null
            ? testimonials.find((item) => item.id === editingTestimonialId) ?? null
            : null;
    const viewingTestimonial =
        viewingTestimonialId !== null
            ? testimonials.find((item) => item.id === viewingTestimonialId) ?? null
            : null;

    const openCreateForm = () => {
        setEditingTestimonialId(null);
        setFormOpen(true);
    };

    const openEditForm = (row: Testimonial) => {
        setEditingTestimonialId(row.id);
        setFormOpen(true);
    };

    const openViewDialog = (row: Testimonial) => {
        setViewingTestimonialId(row.id);
        setViewOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditingTestimonialId(null);
    };

    const closeView = () => {
        setViewOpen(false);
        setViewingTestimonialId(null);
    };

    const openEditFromView = () => {
        if (viewingTestimonialId === null) {
            return;
        }

        closeView();
        setEditingTestimonialId(viewingTestimonialId);
        setFormOpen(true);
    };

    const handleSubmitTestimonial = async (payload: TestimonialFormSubmitPayload) => {
        await submitTestimonialForm(payload, editingTestimonialId);
        closeForm();
    };

    const handleDeleteTestimonial = (row: Testimonial) => {
        router.delete(`/admin/testimonials/${row.id}`, {
            preserveScroll: true,
            onSuccess: () => router.flush('/testimonials'),
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
                    title="Testimonials"
                    description="Manage traveller quotes shown in the homepage carousel."
                    icon={MessageSquareQuote}
                    actions={
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95"
                        >
                            <Plus className="size-4" aria-hidden />
                            New testimonial
                        </button>
                    }
                />

                <PremiumDataTable
                    title="Traveller quotes"
                    description={`${publishedCount} published testimonial${publishedCount === 1 ? '' : 's'} are currently visible on the public site.`}
                    data={testimonials}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => primaryTranslation(row.name)}
                    initialPageSize={5}
                    onView={openViewDialog}
                    onEdit={openEditForm}
                    onDelete={handleDeleteTestimonial}
                />
            </div>

            <ContentRecordViewDialog
                open={viewOpen}
                title="View testimonial"
                description={viewingTestimonial ? primaryTranslation(viewingTestimonial.name) : undefined}
                model={viewingTestimonial ? buildTestimonialViewModel(viewingTestimonial) : null}
                onClose={closeView}
                onEdit={openEditFromView}
            />

            <TestimonialFormDialog
                open={formOpen}
                mode={editingTestimonialId !== null ? 'edit' : 'create'}
                resetKey={editingTestimonialId !== null ? String(editingTestimonialId) : 'create'}
                initialValues={
                    editingTestimonial ? testimonialToFormValues(editingTestimonial) : undefined
                }
                uploadHint={avatarSpec.hint}
                onClose={closeForm}
                onSubmit={handleSubmitTestimonial}
            />
        </>
    );
}

Testimonials.layout = withAdminLayout('Testimonials');
