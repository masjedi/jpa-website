import type { TranslatedString } from '@/types/locale';

export type ArticleCategory =
    | 'Travel tips'
    | 'Culture'
    | 'Itineraries'
    | 'Safety'
    | 'Heritage'
    | 'Photography';

export interface ArticleAuthor {
    name: string;
    role: string;
    avatar?: string;
}

export interface ArticleSection {
    id: string;
    heading: string;
    paragraphs: readonly string[];
}

export interface ArticleListItem {
    id: string;
    slug: string;
    title: string;
    summary: string;
    category: ArticleCategory;
    image: string;
    date: string;
    readingTimeMinutes: number;
    author: ArticleAuthor;
    isFeatured?: boolean;
}

export interface ArticleDetail extends ArticleListItem {
    sections: readonly ArticleSection[];
    content?: string;
    relatedTourSlugs?: readonly string[];
}

export interface ArticleRelatedTour {
    id: string;
    slug: string;
    title: string;
    duration: string;
    href: string;
}

export interface AdminArticleListItem {
    id: number;
    slug: string;
    status: 'Published' | 'Draft';
    title: TranslatedString;
    summary: TranslatedString;
    category: ArticleCategory;
    image: string;
    content: TranslatedString;
    date: string;
    readingTimeMinutes: number;
    teamMemberId: number | null;
    author: ArticleAuthor;
    isFeatured: boolean;
    relatedTourSlugs?: readonly string[];
}
