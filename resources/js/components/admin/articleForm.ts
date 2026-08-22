import { stripHtml } from '@/lib/richText';
import type { ArticleCategory, ArticleDetail, ArticleSection } from '@/types/articles';

export type ArticleFormStatus = 'Published' | 'Draft';

export interface ArticleFormValues {
    title: string;
    summary: string;
    category: ArticleCategory;
    image: string;
    content: string;
    status: ArticleFormStatus;
}

export const articleCategoryOptions: readonly ArticleCategory[] = [
    'Travel tips',
    'Culture',
    'Itineraries',
    'Safety',
    'Heritage',
    'Photography',
] as const;

export const defaultArticleAuthor = {
    name: 'Sara Ahmad',
    role: 'Lead travel editor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
} as const;

export function createEmptyArticleFormValues(): ArticleFormValues {
    return {
        title: '',
        summary: '',
        category: 'Travel tips',
        image: '',
        content: '',
        status: 'Draft',
    };
}

export function slugifyArticleTitle(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function escapeHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}

export function sectionsToHtml(sections: readonly ArticleSection[]): string {
    return sections
        .map((section) => {
            const heading = `<h2>${escapeHtml(section.heading)}</h2>`;
            const paragraphs = section.paragraphs
                .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
                .join('');

            return `${heading}${paragraphs}`;
        })
        .join('');
}

export function resolveArticleContent(article: ArticleDetail): string {
    if (article.content?.trim()) {
        return article.content;
    }

    if (article.sections.length > 0) {
        return sectionsToHtml(article.sections);
    }

    return '';
}

export function articleToFormValues(
    article: ArticleDetail,
    status: ArticleFormStatus,
): ArticleFormValues {
    return {
        title: article.title,
        summary: article.summary,
        category: article.category,
        image: article.image,
        content: resolveArticleContent(article),
        status,
    };
}

export function estimateReadingTimeMinutes(html: string): number {
    const words = stripHtml(html).split(/\s+/).filter(Boolean).length;

    return Math.max(1, Math.round(words / 200));
}

export function formatArticleDate(date: Date = new Date()): string {
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export type ArticleFormField = 'title' | 'summary' | 'image' | 'content';

export type ArticleFormErrors = Partial<Record<ArticleFormField, string>>;

export function isArticleContentEmpty(html: string): boolean {
    return stripHtml(html).length === 0;
}

export function validateArticleFormValues(
    values: ArticleFormValues,
    hasImage: boolean,
): ArticleFormErrors {
    const errors: ArticleFormErrors = {};

    if (!values.title.trim()) {
        errors.title = 'Required';
    }

    if (!values.summary.trim()) {
        errors.summary = 'Required';
    }

    if (!hasImage) {
        errors.image = 'Required';
    }

    if (isArticleContentEmpty(values.content)) {
        errors.content = 'Required';
    }

    return errors;
}
