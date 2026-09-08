import { stripHtml } from '@/lib/richText';
import {
    appendTranslatedStringToFormData,
    createEmptyTranslatedString,
    normalizeTranslatedString,
} from '@/lib/translations';
import { buildTranslatableFieldMap, mapTranslatableServerErrors, validateEnglishRequired } from '@/lib/translatableForm';
import type { AdminArticleListItem, ArticleCategory, ArticleSection } from '@/types/articles';
import type { TranslatedString } from '@/types/locale';

export type ArticleFormStatus = 'Published' | 'Draft';

export interface ArticleFormValues {
    title: TranslatedString;
    summary: TranslatedString;
    category: ArticleCategory;
    image: string;
    content: TranslatedString;
    teamMemberId: number | '';
    authorName: string;
    authorRole: string;
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
    defaultAuthorName = '',
): ArticleFormValues {
    const firstMember = teamMembers[0];

    return {
        title: createEmptyTranslatedString(),
        summary: createEmptyTranslatedString(),
        category: 'Travel tips',
        image: '',
        content: createEmptyTranslatedString(),
        teamMemberId: firstMember?.id ?? '',
        authorName: firstMember?.name ?? defaultAuthorName,
        authorRole: firstMember?.role ?? '',
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

export function resolveArticleContent(article: { content?: TranslatedString | string; sections?: readonly ArticleSection[] }): string {
    const content = normalizeTranslatedString(article.content as TranslatedString | string | undefined);

    if (content.en.trim()) {
        return content.en;
    }

    if (article.sections && article.sections.length > 0) {
        return sectionsToHtml(article.sections);
    }

    return '';
}

export function articleToFormValues(
    article: AdminArticleListItem,
    status: ArticleFormStatus = article.status,
): ArticleFormValues {
    return {
        title: normalizeTranslatedString(article.title),
        summary: normalizeTranslatedString(article.summary),
        category: article.category,
        image: article.image,
        content: normalizeTranslatedString(article.content),
        teamMemberId: article.teamMemberId ?? '',
        authorName: article.author.name,
        authorRole: article.author.role,
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

export type ArticleFormField =
    | 'title'
    | 'summary'
    | 'image'
    | 'content'
    | 'teamMemberId'
    | 'authorName'
    | 'authorRole';

export type ArticleFormErrors = Partial<Record<ArticleFormField, string>>;

export interface ArticleFormSubmitPayload {
    values: ArticleFormValues;
    coverImage: File | null;
}

const serverFieldMap = {
    ...buildTranslatableFieldMap('', ['title', 'summary', 'content']),
    cover_image: 'image',
    team_member_id: 'teamMemberId',
    author_name: 'authorName',
    author_role: 'authorRole',
};

export function mapServerArticleFormErrors(
    errors: Record<string, string | string[] | undefined>,
): ArticleFormErrors {
    return mapTranslatableServerErrors(errors, serverFieldMap);
}

export function buildArticleFormData({
    values,
    coverImage,
}: ArticleFormSubmitPayload): FormData {
    const formData = new FormData();

    appendTranslatedStringToFormData(formData, 'title', values.title);
    appendTranslatedStringToFormData(formData, 'summary', values.summary);
    appendTranslatedStringToFormData(formData, 'content', values.content);
    formData.append('category', values.category);
    formData.append('team_member_id', values.teamMemberId === '' ? '' : String(values.teamMemberId));
    formData.append('author_name', values.authorName.trim());
    formData.append('author_role', values.authorRole.trim());
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

    const titleError = validateEnglishRequired(values.title, 'Title');
    if (titleError) {
        errors.title = titleError;
    }

    const summaryError = validateEnglishRequired(values.summary, 'Summary');
    if (summaryError) {
        errors.summary = summaryError;
    }

    if (!hasImage) {
        errors.image = 'Required';
    }

    if (isArticleContentEmpty(values.content.en)) {
        errors.content = 'English content is required';
    }

    if (values.authorName.trim().length < 2) {
        errors.authorName = 'Enter the author name';
    }

    return errors;
}
