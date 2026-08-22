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
