import type { ContentRecordStatus, ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import {
    articleToFormValues,
    resolveArticleContent,
    type ArticleFormStatus,
} from '@/components/admin/articleForm';
import { isRichTextHtml } from '@/lib/richText';
import { primaryTranslation } from '@/lib/translations';
import type { AdminArticleListItem } from '@/types/articles';

export type ManagedArticle = AdminArticleListItem;

interface BuildArticleViewModelOptions {
    article: ManagedArticle;
    status: ContentRecordStatus;
}

export function buildArticleViewModel({
    article,
    status,
}: BuildArticleViewModelOptions): ContentRecordViewModel {
    const title = primaryTranslation(article.title);
    const summary = primaryTranslation(article.summary);
    const content = resolveArticleContent(article);
    const usesRichContent = isRichTextHtml(content);

    return {
        title,
        subtitle: summary,
        imageUrl: article.image,
        imageAlt: title,
        badgeLabel: article.category,
        status,
        cardEyebrow: article.category,
        cardCtaLabel: 'Read article',
        metaFields: [
            { id: 'category', label: 'Category', value: article.category },
            { id: 'slug', label: 'Slug', value: article.slug },
            { id: 'date', label: 'Published', value: article.date },
            {
                id: 'reading-time',
                label: 'Reading time',
                value: `${article.readingTimeMinutes} min`,
            },
            {
                id: 'author',
                label: 'Author',
                value: `${article.author.name} · ${article.author.role}`,
            },
            {
                id: 'featured',
                label: 'Featured',
                value: article.isFeatured ? 'Yes' : 'No',
            },
            { id: 'status', label: 'Status', value: status },
        ],
        bodyHtml: usesRichContent ? content : undefined,
    };
}

export function managedArticleToFormValues(article: ManagedArticle) {
    return articleToFormValues(article, article.status);
}
