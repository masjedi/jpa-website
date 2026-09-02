import { router, usePage } from '@inertiajs/react';
import { BookOpen, Plus } from 'lucide-react';
import { Suspense, lazy, useState } from 'react';

import {
    buildArticleFormData,
    type ArticleFormSubmitPayload,
    type ArticleTeamMemberOption,
} from '@/components/admin/articleForm';
import {
    buildArticleViewModel,
    managedArticleToFormValues,
    type ManagedArticle,
} from '@/components/admin/articleView';
import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { withAdminLayout } from '@/layouts/withAdminLayout';

const ArticleFormDialog = lazy(() =>
    import('@/components/admin/ArticleFormDialog').then((module) => ({
        default: module.ArticleFormDialog,
    })),
);

const ContentRecordViewDialog = lazy(() =>
    import('@/components/admin/ContentRecordViewDialog').then((module) => ({
        default: module.ContentRecordViewDialog,
    })),
);

type ArticleStatus = 'Published' | 'Draft';

interface ArticleRow {
    id: number;
    title: string;
    slug: string;
    category: string;
    summary: string;
    date: string;
    status: ArticleStatus;
}

interface ArticlesPageProps {
    articles: ManagedArticle[];
    teamMembers: ArticleTeamMemberOption[];
}

function buildArticleRow(article: ManagedArticle): ArticleRow {
    return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        category: article.category,
        summary: article.summary,
        date: article.date,
        status: article.status,
    };
}

const statusStyles: Record<ArticleStatus, string> = {
    Published: 'bg-secondary/10 text-secondary',
    Draft: 'bg-accent/15 text-accent',
};

const columns: DataTableColumn<ArticleRow>[] = [
    {
        id: 'article',
        header: 'Article',
        accessor: (row) => row.title,
        render: (row) => (
            <div className="max-w-sm">
                <p className="font-medium text-foreground">{row.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {row.summary}
                </p>
            </div>
        ),
    },
    { id: 'category', header: 'Category', accessor: (row) => row.category },
    { id: 'slug', header: 'Slug', accessor: (row) => row.slug },
    { id: 'date', header: 'Published', accessor: (row) => row.date },
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

function submitArticleForm(
    payload: ArticleFormSubmitPayload,
    editingArticleId: number | null,
): Promise<void> {
    const formData = buildArticleFormData(payload);

    return new Promise((resolve, reject) => {
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                router.flush('/articles');
                resolve();
            },
            onError: () => reject(),
        };

        if (editingArticleId !== null) {
            formData.append('_method', 'patch');
            router.post(`/admin/articles/${editingArticleId}`, formData, options);

            return;
        }

        router.post('/admin/articles', formData, options);
    });
}

export default function Articles({ articles, teamMembers }: ArticlesPageProps) {
    const { flash } = usePage().props;
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
    const [viewingArticleId, setViewingArticleId] = useState<number | null>(null);

    const rows = articles.map(buildArticleRow);
    const publishedCount = articles.filter((article) => article.status === 'Published').length;
    const editingArticle = editingArticleId
        ? articles.find((article) => article.id === editingArticleId) ?? null
        : null;
    const viewingArticle = viewingArticleId
        ? articles.find((article) => article.id === viewingArticleId) ?? null
        : null;

    const openCreateForm = () => {
        setEditingArticleId(null);
        setFormOpen(true);
    };

    const openEditForm = (row: ArticleRow) => {
        setEditingArticleId(row.id);
        setFormOpen(true);
    };

    const openViewDialog = (row: ArticleRow) => {
        setViewingArticleId(row.id);
        setViewOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditingArticleId(null);
    };

    const closeView = () => {
        setViewOpen(false);
        setViewingArticleId(null);
    };

    const openEditFromView = () => {
        if (!viewingArticleId) {
            return;
        }

        closeView();
        setEditingArticleId(viewingArticleId);
        setFormOpen(true);
    };

    const handleSubmitArticle = async (payload: ArticleFormSubmitPayload) => {
        await submitArticleForm(payload, editingArticleId);
        closeForm();
    };

    const handleDeleteArticle = (row: ArticleRow) => {
        router.delete(`/admin/articles/${row.id}`, {
            preserveScroll: true,
            onSuccess: () => router.flush('/articles'),
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
                    title="Articles"
                    description="Publish travel stories, cultural guides, and practical information for visitors exploring Afghanistan."
                    icon={BookOpen}
                    actions={
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95"
                        >
                            <Plus className="size-4" aria-hidden />
                            New article
                        </button>
                    }
                />

                <PremiumDataTable
                    title="Editorial library"
                    description={`${publishedCount} published article${publishedCount === 1 ? '' : 's'} are currently visible on the public site.`}
                    data={rows}
                    columns={columns}
                    rowKey={(row) => row.id}
                    selectionLabel={(row) => row.title}
                    initialPageSize={5}
                    onView={openViewDialog}
                    onEdit={openEditForm}
                    onDelete={handleDeleteArticle}
                />
            </div>

            {viewOpen ? (
                <Suspense fallback={null}>
                    <ContentRecordViewDialog
                        open={viewOpen}
                        title="View article"
                        description={viewingArticle?.title}
                        model={
                            viewingArticle
                                ? buildArticleViewModel({
                                      article: viewingArticle,
                                      status: viewingArticle.status,
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
                    <ArticleFormDialog
                        open={formOpen}
                        mode={editingArticleId ? 'edit' : 'create'}
                        resetKey={editingArticleId ? String(editingArticleId) : 'create'}
                        teamMembers={teamMembers}
                        initialValues={
                            editingArticle
                                ? managedArticleToFormValues(editingArticle)
                                : undefined
                        }
                        onClose={closeForm}
                        onSubmit={handleSubmitArticle}
                    />
                </Suspense>
            ) : null}
        </>
    );
}

Articles.layout = withAdminLayout('Articles');
