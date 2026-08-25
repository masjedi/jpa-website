import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Users } from 'lucide-react';
import { useState } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { ContentRecordViewDialog } from '@/components/admin/ContentRecordViewDialog';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { TeamFormDialog } from '@/components/admin/TeamFormDialog';
import {
    buildTeamFormData,
    teamMemberToFormValues,
    type TeamFormSubmitPayload,
} from '@/components/admin/teamForm';
import { buildTeamViewModel } from '@/components/admin/teamView';
import { withAdminLayout } from '@/layouts/withAdminLayout';
import type { TeamAvatarSpec, TeamMember } from '@/types/team';

const statusStyles: Record<TeamMember['status'], string> = {
    Published: 'bg-secondary/10 text-secondary',
    Draft: 'bg-accent/15 text-accent',
};

const columns: DataTableColumn<TeamMember>[] = [
    {
        id: 'member',
        header: 'Team member',
        accessor: (row) => row.name,
        render: (row) => (
            <div className="flex items-center gap-3">
                <img
                    src={row.image}
                    alt=""
                    className="size-10 rounded-full bg-surface-muted object-contain object-center"
                />
                <div className="max-w-md">
                    <p className="font-medium text-foreground">{row.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{row.role}</p>
                </div>
            </div>
        ),
    },
    { id: 'name', header: 'Name', accessor: (row) => row.name },
    { id: 'role', header: 'Role', accessor: (row) => row.role },
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

interface TeamsPageProps {
    members: TeamMember[];
    avatarSpec: TeamAvatarSpec;
}

function submitTeamForm(
    payload: TeamFormSubmitPayload,
    editingMemberId: number | null,
): Promise<void> {
    const formData = buildTeamFormData(payload);

    return new Promise((resolve, reject) => {
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                router.flush('/teams');
                resolve();
            },
            onError: () => reject(),
        };

        if (editingMemberId !== null) {
            formData.append('_method', 'patch');
            router.post(`/admin/teams/${editingMemberId}`, formData, options);

            return;
        }

        router.post('/admin/teams', formData, options);
    });
}

export default function Teams({ members }: TeamsPageProps) {
    const { flash } = usePage().props;
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
    const [viewingMemberId, setViewingMemberId] = useState<number | null>(null);

    const publishedCount = members.filter((member) => member.status === 'Published').length;
    const editingMember =
        editingMemberId !== null ? members.find((member) => member.id === editingMemberId) ?? null : null;
    const viewingMember =
        viewingMemberId !== null ? members.find((member) => member.id === viewingMemberId) ?? null : null;

    const openCreateForm = () => {
        setEditingMemberId(null);
        setFormOpen(true);
    };

    const openEditForm = (row: TeamMember) => {
        setEditingMemberId(row.id);
        setFormOpen(true);
    };

    const openViewDialog = (row: TeamMember) => {
        setViewingMemberId(row.id);
        setViewOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditingMemberId(null);
    };

    const closeView = () => {
        setViewOpen(false);
        setViewingMemberId(null);
    };

    const openEditFromView = () => {
        if (viewingMemberId === null) {
            return;
        }

        closeView();
        setEditingMemberId(viewingMemberId);
        setFormOpen(true);
    };

    const handleSubmitTeam = async (payload: TeamFormSubmitPayload) => {
        await submitTeamForm(payload, editingMemberId);
        closeForm();
    };

    const handleDeleteTeam = (row: TeamMember) => {
        router.delete(`/admin/teams/${row.id}`, {
            preserveScroll: true,
            onSuccess: () => router.flush('/teams'),
        });
    };

    return (
        <>
            <Head title="Teams" />

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
                    title="Team members"
                    description="Manage profiles shown on the public Our Team page."
                    icon={Users}
                    actions={
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95"
                        >
                            <Plus className="size-4" aria-hidden />
                            New team member
                        </button>
                    }
                />

                <PremiumDataTable
                    title="Team catalog"
                    description={`${publishedCount} published member${publishedCount === 1 ? '' : 's'} are currently visible on the public site.`}
                    data={members}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => row.name}
                    initialPageSize={5}
                    onView={openViewDialog}
                    onEdit={openEditForm}
                    onDelete={handleDeleteTeam}
                />
            </div>

            <ContentRecordViewDialog
                open={viewOpen}
                title="View team member"
                description={viewingMember?.name}
                model={viewingMember ? buildTeamViewModel(viewingMember) : null}
                onClose={closeView}
                onEdit={openEditFromView}
            />

            <TeamFormDialog
                open={formOpen}
                mode={editingMember ? 'edit' : 'create'}
                resetKey={editingMember ? `edit-${editingMember.id}` : 'create'}
                initialValues={
                    editingMember ? teamMemberToFormValues(editingMember) : undefined
                }
                onClose={closeForm}
                onSubmit={handleSubmitTeam}
            />
        </>
    );
}

Teams.layout = withAdminLayout('Teams');
