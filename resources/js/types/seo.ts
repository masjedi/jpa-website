export interface SeoJsonLdNode {
    [key: string]: unknown;
}

export interface SeoDocument {
    title: string;
    documentTitle: string;
    description: string;
    canonical: string;
    robots: string;
    noIndex: boolean;
    ogType: string;
    ogTitle: string;
    ogDescription: string;
    ogUrl: string;
    ogImage: string;
    ogLocale: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
    jsonLd: SeoJsonLdNode[];
}
