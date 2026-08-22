import { resolveArticleContent } from '@/components/admin/articleForm';
import type { ContentRecordStatus, ContentRecordViewModel } from '@/components/admin/contentRecordViewModel';
import { isRichTextHtml } from '@/lib/richText';
import { getTourBySlug } from '@/lib/travelOfferMappers';
import type { ArticleDetail } from '@/types/articles';

interface BuildArticleViewModelOptions {
    article: ArticleDetail;
    status: ContentRecordStatus;
}

export function buildArticleViewModel({
    article,
    status,
}: BuildArticleViewModelOptions): ContentRecordViewModel {
    const relatedTours = (article.relatedTourSlugs ?? [])
        .map((slug) => getTourBySlug(slug))
        .filter((tour): tour is NonNullable<typeof tour> => Boolean(tour));
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
        relatedItems:
            relatedTours.length > 0
                ? relatedTours.map((tour) => ({
                      id: tour.id,
                      title: tour.title,
                      meta: tour.duration,
                  }))
                : undefined,
        relatedItemsTitle: 'Related tours',
    };
}
