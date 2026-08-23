import type { ContentRecordStatus, ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import {
    articleToFormValues,
    resolveArticleContent,
    type ArticleFormStatus,
} from '@/components/admin/articleForm';
import { isRichTextHtml } from '@/lib/richText';
import type { ArticleDetail } from '@/types/articles';

export type ManagedArticle = ArticleDetail & {
    id: number;
    status: ArticleFormStatus;
    isFeatured?: boolean;
    relatedTourSlugs?: readonly string[];
};

interface BuildArticleViewModelOptions {
    article: ManagedArticle;
    status: ContentRecordStatus;
}

export function buildArticleViewModel({
    article,
    status,
}: BuildArticleViewModelOptions): ContentRecordViewModel {
    const content = resolveArticleContent(article);
    const usesRichContent = isRichTextHtml(content);

    return {
        title: article.title,
        subtitle: article.summary,
        imageUrl: article.image,
        imageAlt: article.title,
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
            { id: 'author', label: 'Author', value: article.author.name },
            {
                id: 'featured',
                label: 'Featured',
                value: article.isFeatured ? 'Yes' : 'No',
            },
            { id: 'status', label: 'Status', value: status },
        ],
        bodyHtml: usesRichContent ? content : undefined,
        sections: usesRichContent
            ? undefined
            : article.sections.map((section) => ({
                  id: section.id,
                  heading: section.heading,
                  paragraphs: section.paragraphs,
              })),
    };
}

export function managedArticleToFormValues(article: ManagedArticle) {
    return articleToFormValues(article, article.status);
}
