import { Head, usePage } from '@inertiajs/react';

import type { SharedPageProps } from '@/types/inertia';
import type { SeoDocument, SeoJsonLdNode } from '@/types/seo';

interface PageMetaProps {
    title?: string;
    description?: string;
    image?: string;
    canonical?: string;
    noIndex?: boolean;
    ogType?: string;
    jsonLd?: SeoJsonLdNode[];
}

function toAbsoluteUrl(appUrl: string, value: string): string {
    if (value.startsWith('http://') || value.startsWith('https://')) {
        return value;
    }

    const base = appUrl.replace(/\/$/, '');
    const path = value.startsWith('/') ? value : `/${value}`;

    return `${base}${path}`;
}

export function PageMeta({
    title,
    description,
    image,
    canonical,
    noIndex,
    ogType,
    jsonLd,
}: PageMetaProps) {
    const { url, props } = usePage<SharedPageProps>();
    const seo = props.seo;
    const appUrl = props.appUrl.replace(/\/$/, '');
    const logoColor = props.siteSettings?.logoColor ?? `${appUrl}/brand/logo-color-h.png`;

    const pageTitle = title ?? seo?.title ?? '';
    const pageDescription = description ?? seo?.description ?? '';
    const pageCanonical = canonical ?? seo?.canonical ?? `${appUrl}${url.split('?')[0] || '/'}`;
    const pageImage = toAbsoluteUrl(
        appUrl,
        image ?? seo?.ogImage ?? (logoColor.startsWith('http') ? logoColor : `${appUrl}${logoColor}`),
    );
    const pageType = ogType ?? seo?.ogType ?? 'website';
    const pageLocale =
        seo?.ogLocale ??
        ({ en: 'en_US', fa: 'fa_AF', ps: 'ps_AF', de: 'de_DE', fr: 'fr_FR' }[props.locale] ?? 'en_US');
    const pageNoIndex = noIndex ?? seo?.noIndex ?? false;
    const robots = pageNoIndex ? 'noindex, nofollow, noarchive, nosnippet' : (seo?.robots ?? 'index, follow');
    const graph = jsonLd ?? seo?.jsonLd ?? [];

    return (
        <Head>
            <title head-key="title">{pageTitle}</title>
            <meta head-key="description" name="description" content={pageDescription} />
            <link head-key="canonical" rel="canonical" href={pageCanonical} />
            <meta head-key="robots" name="robots" content={robots} />
            <meta head-key="og:site_name" property="og:site_name" content="Journey to Peace" />
            <meta head-key="og:type" property="og:type" content={pageType} />
            <meta head-key="og:title" property="og:title" content={pageTitle} />
            <meta head-key="og:description" property="og:description" content={pageDescription} />
            <meta head-key="og:url" property="og:url" content={pageCanonical} />
            <meta head-key="og:image" property="og:image" content={pageImage} />
            <meta head-key="og:locale" property="og:locale" content={pageLocale} />
            <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
            <meta head-key="twitter:title" name="twitter:title" content={pageTitle} />
            <meta head-key="twitter:description" name="twitter:description" content={pageDescription} />
            <meta head-key="twitter:image" name="twitter:image" content={pageImage} />
            {graph.length > 0 ? (
                <script type="application/ld+json" head-key="json-ld">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@graph': graph,
                    })}
                </script>
            ) : null}
        </Head>
    );
}

export type { SeoDocument };
