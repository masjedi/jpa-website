import { Head } from '@inertiajs/react';
import { BookOpen, Plus } from 'lucide-react';
import { useState } from 'react';

import { ArticleFormDialog } from '@/components/admin/ArticleFormDialog';
import {
    articleToFormValues,
    defaultArticleAuthor,
    estimateReadingTimeMinutes,
    formatArticleDate,
    slugifyArticleTitle,
    type ArticleFormValues,
} from '@/components/admin/articleForm';
import { buildArticleViewModel } from '@/components/admin/articleView';
import { ContentRecordViewDialog } from '@/components/admin/ContentRecordViewDialog';
import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { allArticles } from '@/data/articlesData';
import type { ArticleDetail } from '@/types/articles';
import { withAdminLayout } from '@/layouts/withAdminLayout';

type ArticleStatus = 'Published' | 'Draft';

interface ManagedArticle extends ArticleDetail {
    status: ArticleStatus;
}

interface ArticleRow {
    id: string;
    title: string;
    slug: string;
    category: string;
    summary: string;
    date: string;
    status: ArticleStatus;
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

function buildInitialArticles(): ManagedArticle[] {
    return allArticles.map((article) => ({
        ...article,
        status: article.isFeatured ? 'Published' : 'Published',
    }));
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

export default function Articles() {
    const [articles, setArticles] = useState<ManagedArticle[]>(buildInitialArticles);
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
    const [viewingArticleId, setViewingArticleId] = useState<string | null>(null);

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

    const handleSubmitArticle = (values: ArticleFormValues) => {
        if (editingArticleId) {
            setArticles((current) =>
                current.map((article) =>
                    article.id === editingArticleId
                        ? {
                              ...article,
                              title: values.title,
                              summary: values.summary,
                              category: values.category,
                              image: values.image,
                              content: values.content,
                              sections: [],
                              status: values.status,
                              readingTimeMinutes: estimateReadingTimeMinutes(values.content),
                          }
                        : article,
                ),
            );

            return;
        }

        const slug = slugifyArticleTitle(values.title);

        const article: ManagedArticle = {
            id: slug,
            slug,
            title: values.title,
            summary: values.summary,
            category: values.category,
            image: values.image,
            content: values.content,
            sections: [],
            date: formatArticleDate(),
            readingTimeMinutes: estimateReadingTimeMinutes(values.content),
            author: defaultArticleAuthor,
            status: values.status,
        };

        setArticles((current) => [article, ...current]);
    };

    return (
        <>
            <Head title="Articles" />

            <div className="space-y-4">
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
                />
            </div>

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

            <ArticleFormDialog
                open={formOpen}
                mode={editingArticleId ? 'edit' : 'create'}
                resetKey={editingArticleId ?? 'create'}
                initialValues={
                    editingArticle
                        ? articleToFormValues(editingArticle, editingArticle.status)
                        : undefined
                }
                onClose={closeForm}
                onSubmit={handleSubmitArticle}
            />
        </>
    );
}

Articles.layout = withAdminLayout('Articles');
