import { Head, usePage } from '@inertiajs/react';

interface PageMetaProps {
    title: string;
    description: string;
    image?: string;
    noIndex?: boolean;
}

export function PageMeta({ title, description, image, noIndex = false }: PageMetaProps) {
    const { url, props } = usePage();
    const appUrl = props.appUrl.replace(/\/$/, '');
    const appName = props.appName;
    const canonical = `${appUrl}${url.split('?')[0] || '/'}`;
    const ogImage = image ?? `${appUrl}/brand/logo-color.png`;

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonical} />
            {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}
            <meta property="og:site_name" content={appName} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={ogImage} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
        </Head>
    );
}
