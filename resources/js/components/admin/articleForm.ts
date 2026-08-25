import { stripHtml } from '@/lib/richText';
import type { ArticleCategory, ArticleDetail, ArticleSection } from '@/types/articles';

export type ArticleFormStatus = 'Published' | 'Draft';

export interface ArticleFormValues {
    title: string;
    summary: string;
    category: ArticleCategory;
    image: string;
    content: string;
    teamMemberId: number | '';
    isFeatured: boolean;
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

export function createEmptyArticleFormValues(
    teamMembers: readonly ArticleTeamMemberOption[] = [],
): ArticleFormValues {
    return {
        title: '',
        summary: '',
        category: 'Travel tips',
        image: '',
        content: '',
        teamMemberId: teamMembers[0]?.id ?? '',
        isFeatured: false,
        status: 'Draft',
    };
}

export interface ArticleTeamMemberOption {
    id: number;
    name: string;
    role: string;
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
    article: ArticleDetail & { teamMemberId?: number | null; isFeatured?: boolean },
    status: ArticleFormStatus,
): ArticleFormValues {
    return {
        title: article.title,
        summary: article.summary,
        category: article.category,
        image: article.image,
        content: resolveArticleContent(article),
        teamMemberId: article.teamMemberId ?? '',
        isFeatured: article.isFeatured ?? false,
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

export type ArticleFormField = 'title' | 'summary' | 'image' | 'content' | 'teamMemberId';

export type ArticleFormErrors = Partial<Record<ArticleFormField, string>>;

export interface ArticleFormSubmitPayload {
    values: ArticleFormValues;
    coverImage: File | null;
}

const serverFieldMap: Record<string, ArticleFormField> = {
    title: 'title',
    summary: 'summary',
    cover_image: 'image',
    content: 'content',
    team_member_id: 'teamMemberId',
};

export function mapServerArticleFormErrors(
    errors: Record<string, string | string[] | undefined>,
): ArticleFormErrors {
    const mapped: ArticleFormErrors = {};

    for (const [key, message] of Object.entries(errors)) {
        const field = serverFieldMap[key];

        if (!field || message === undefined) {
            continue;
        }

        mapped[field] = Array.isArray(message) ? message[0] : message;
    }

    return mapped;
}

export function buildArticleFormData({
    values,
    coverImage,
}: ArticleFormSubmitPayload): FormData {
    const formData = new FormData();

    formData.append('title', values.title);
    formData.append('summary', values.summary);
    formData.append('category', values.category);
    formData.append('content', values.content);
    formData.append('team_member_id', values.teamMemberId === '' ? '' : String(values.teamMemberId));
    formData.append('is_featured', values.isFeatured ? '1' : '0');
    formData.append('status', values.status);

    if (coverImage) {
        formData.append('cover_image', coverImage);
    }

    return formData;
}

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

    if (values.teamMemberId === '') {
        errors.teamMemberId = 'Required';
    }

    return errors;
}
