import { Head } from '@inertiajs/react';
import { CircleHelp, Plus } from 'lucide-react';
import { useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { ContentRecordViewDialog } from '@/components/admin/ContentRecordViewDialog';
import { FaqFormDialog } from '@/components/admin/FaqFormDialog';
import {
    faqToFormValues,
    formatFaqUpdatedLabel,
    nextFaqItemId,
    nextFaqItemOrder,
    type FaqFormValues,
} from '@/components/admin/faqForm';
import { buildFaqViewModel } from '@/components/admin/faqView';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { allFaqItems as initialFaqItems } from '@/data/faqData';
import type { FaqItem } from '@/types/faq';
import { withAdminLayout } from '@/layouts/withAdminLayout';

const statusStyles: Record<FaqItem['status'], string> = {
    Published: 'bg-secondary/10 text-secondary',
    Draft: 'bg-accent/15 text-accent',
};

const columns: DataTableColumn<FaqItem>[] = [
    {
        id: 'faq',
        header: 'Question',
        accessor: (row) => row.question,
        render: (row) => (
            <div className="max-w-md">
                <p className="font-medium text-foreground">{row.question}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {row.answer}
                </p>
            </div>
        ),
    },
    { id: 'question', header: 'Question', accessor: (row) => row.question },
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

function buildInitialFaqItems(): FaqItem[] {
    return initialFaqItems.map((item) => ({ ...item }));
}

export default function Faq() {
    const [items, setItems] = useState<FaqItem[]>(buildInitialFaqItems);
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

    const openEditForm = (row: FaqItem) => {
        setEditingItemId(row.id);
        setFormOpen(true);
    };

    const openViewDialog = (row: FaqItem) => {
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

    const handleSubmitFaq = (values: FaqFormValues) => {
        if (editingItemId !== null) {
            setItems((current) =>
                current.map((item) =>
                    item.id === editingItemId
                        ? {
                              ...item,
                              question: values.question,
                              answer: values.answer,
                              status: values.status,
                              updated: formatFaqUpdatedLabel(),
                          }
                        : item,
                ),
            );

            return;
        }

        const item: FaqItem = {
            id: nextFaqItemId(items),
            question: values.question,
            answer: values.answer,
            status: values.status,
            order: nextFaqItemOrder(items),
            updated: formatFaqUpdatedLabel(),
        };

        setItems((current) => [...current, item]);
    };

    return (
        <>
            <Head title="FAQ" />

            <div className="space-y-4">
                <AdminSectionHeader
                    eyebrow="Public website"
                    title="Frequently asked questions"
                    description="Manage travel information Q&A shown on the homepage. Content will be loaded from the database once CMS persistence is connected."
                    icon={CircleHelp}
                    actions={
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95"
                        >
                            <Plus className="size-4" aria-hidden />
                            New FAQ
                        </button>
                    }
                />

                <PremiumDataTable
                    title="FAQ catalog"
                    description={`${publishedCount} published question${publishedCount === 1 ? '' : 's'} are currently visible on the public site.`}
                    data={items}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => row.question}
                    initialPageSize={5}
                    onView={openViewDialog}
                    onEdit={openEditForm}
                />
            </div>

            <ContentRecordViewDialog
                open={viewOpen}
                title="View FAQ"
                description={viewingItem?.question}
                model={viewingItem ? buildFaqViewModel(viewingItem) : null}
                onClose={closeView}
                onEdit={openEditFromView}
            />

            <FaqFormDialog
                open={formOpen}
                mode={editingItemId !== null ? 'edit' : 'create'}
                resetKey={editingItemId !== null ? String(editingItemId) : 'create'}
                initialValues={editingItem ? faqToFormValues(editingItem) : undefined}
                onClose={closeForm}
                onSubmit={handleSubmitFaq}
            />
        </>
    );
}

Faq.layout = withAdminLayout('FAQ');
