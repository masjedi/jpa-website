import { router, usePage } from '@inertiajs/react';
import { Info, Plus } from 'lucide-react';
import { useState } from 'react';

import { AboutContentFormDialog } from '@/components/admin/AboutContentFormDialog';
import { AboutContentSummary } from '@/components/admin/AboutContentSummary';
import { AboutJourneyStepFormDialog } from '@/components/admin/AboutJourneyStepFormDialog';
import {
    buildAboutJourneyStepFormData,
    aboutJourneyStepToFormValues,
    type AboutJourneyStepSubmitPayload,
} from '@/components/admin/aboutJourneyStepForm';
import { buildAboutJourneyStepViewModel } from '@/components/admin/aboutJourneyStepView';
import { buildAboutContentPayload, type AboutContentFormValues } from '@/components/admin/aboutPageForm';
import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { AdminSectionPanel } from '@/components/admin/AdminSectionPanel';
import { ContentRecordViewDialog } from '@/components/admin/ContentRecordViewDialog';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import type {
    AboutIconOption,
    AboutJourneyImageSpec,
    AboutJourneyStep,
    AboutPageContent,
} from '@/types/aboutPage';
import { withAdminLayout } from '@/layouts/withAdminLayout';

interface AboutAdminPageProps {
    content: AboutPageContent;
    journeySteps: AboutJourneyStep[];
    journeyImageSpec: AboutJourneyImageSpec;
    iconOptions: AboutIconOption[];
}

const statusStyles: Record<AboutJourneyStep['status'], string> = {
    Published: 'bg-secondary/10 text-secondary',
    Draft: 'bg-accent/15 text-accent',
};

const columns: DataTableColumn<AboutJourneyStep>[] = [
    {
        id: 'step',
        header: 'Journey step',
        accessor: (row) => row.title,
        render: (row) => (
            <div className="max-w-md">
                <p className="font-medium text-foreground">{row.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {row.description}
                </p>
            </div>
        ),
    },
    { id: 'icon', header: 'Icon', accessor: (row) => row.iconKey },
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

function submitJourneyStepForm(
    payload: AboutJourneyStepSubmitPayload,
    editingStepId: number | null,
): Promise<void> {
    const formData = buildAboutJourneyStepFormData(payload);

    return new Promise((resolve, reject) => {
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                router.flush('/about');
                resolve();
            },
            onError: () => reject(),
        };

        if (editingStepId !== null) {
            formData.append('_method', 'patch');
            router.post(`/admin/about/journey-steps/${editingStepId}`, formData, options);

            return;
        }

        router.post('/admin/about/journey-steps', formData, options);
    });
}

export default function About({
    content,
    journeySteps,
    iconOptions,
}: AboutAdminPageProps) {
    const { flash } = usePage().props;
    const [contentEditorOpen, setContentEditorOpen] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editingStepId, setEditingStepId] = useState<number | null>(null);
    const [viewingStepId, setViewingStepId] = useState<number | null>(null);

    const publishedCount = journeySteps.filter((step) => step.status === 'Published').length;
    const editingStep =
        editingStepId !== null ? journeySteps.find((step) => step.id === editingStepId) ?? null : null;
    const viewingStep =
        viewingStepId !== null ? journeySteps.find((step) => step.id === viewingStepId) ?? null : null;

    const handleSaveContent = (values: AboutContentFormValues) =>
        new Promise<void>((resolve, reject) => {
            router.patch('/admin/about', buildAboutContentPayload(values), {
                preserveScroll: true,
                onSuccess: () => {
                    router.flush('/about');
                    resolve();
                },
                onError: () => reject(),
            });
        });

    const openCreateForm = () => {
        setEditingStepId(null);
        setFormOpen(true);
    };

    const openEditForm = (row: AboutJourneyStep) => {
        setEditingStepId(row.id);
        setFormOpen(true);
    };

    const openViewDialog = (row: AboutJourneyStep) => {
        setViewingStepId(row.id);
        setViewOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditingStepId(null);
    };

    const closeView = () => {
        setViewOpen(false);
        setViewingStepId(null);
    };

    const openEditFromView = () => {
        if (viewingStepId === null) {
            return;
        }

        closeView();
        setEditingStepId(viewingStepId);
        setFormOpen(true);
    };

    const handleSubmitJourneyStep = async (payload: AboutJourneyStepSubmitPayload) => {
        await submitJourneyStepForm(payload, editingStepId);
        closeForm();
    };

    const handleDeleteJourneyStep = (row: AboutJourneyStep) => {
        router.delete(`/admin/about/journey-steps/${row.id}`, {
            preserveScroll: true,
            onSuccess: () => router.flush('/about'),
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
                    title="About page"
                    description="Manage the public About page intro, mission, vision, call to action, and journey timeline."
                    icon={Info}
                    actions={
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="inline-flex items-center gap-2 rounded-xl bg-accent text-accent-foreground transition-opacity hover:opacity-95"
                        >
                            <Plus className="size-4" aria-hidden />
                            New journey step
                        </button>
                    }
                />

                <AdminSectionPanel
                    title="Page content"
                    description="Intro, mission & vision, and closing call to action."
                >
                    <AboutContentSummary
                        content={content}
                        onEdit={() => setContentEditorOpen(true)}
                    />
                </AdminSectionPanel>

                <PremiumDataTable
                    title="Journey timeline"
                    description={`${publishedCount} published step${publishedCount === 1 ? '' : 's'} are currently visible on the public About page.`}
                    data={journeySteps}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => row.title}
                    initialPageSize={5}
                    onView={openViewDialog}
                    onEdit={openEditForm}
                    onDelete={handleDeleteJourneyStep}
                />
            </div>

            <AboutContentFormDialog
                open={contentEditorOpen}
                content={content}
                onClose={() => setContentEditorOpen(false)}
                onSave={handleSaveContent}
            />

            <ContentRecordViewDialog
                open={viewOpen}
                title="View journey step"
                description={viewingStep?.title}
                model={viewingStep ? buildAboutJourneyStepViewModel(viewingStep) : null}
                onClose={closeView}
                onEdit={openEditFromView}
            />

            <AboutJourneyStepFormDialog
                open={formOpen}
                mode={editingStepId !== null ? 'edit' : 'create'}
                resetKey={editingStepId !== null ? String(editingStepId) : 'create'}
                iconOptions={iconOptions}
                initialValues={editingStep ? aboutJourneyStepToFormValues(editingStep) : undefined}
                onClose={closeForm}
                onSubmit={handleSubmitJourneyStep}
            />
        </>
    );
}

About.layout = withAdminLayout('About page');
