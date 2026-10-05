@props([
    'seo' => [],
])

@php
    $title = (string) ($seo['documentTitle'] ?? $seo['title'] ?? '');
    $description = (string) ($seo['description'] ?? '');
    $canonical = (string) ($seo['canonical'] ?? '');
    $robots = (string) ($seo['robots'] ?? 'index, follow');
    $ogType = (string) ($seo['ogType'] ?? 'website');
    $ogTitle = (string) ($seo['ogTitle'] ?? $title);
    $ogDescription = (string) ($seo['ogDescription'] ?? $description);
    $ogUrl = (string) ($seo['ogUrl'] ?? $canonical);
    $ogImage = (string) ($seo['ogImage'] ?? '');
    $ogLocale = (string) ($seo['ogLocale'] ?? 'en_US');
    $jsonLd = $seo['jsonLd'] ?? [];
    $jsonLdDocument = is_array($jsonLd) && $jsonLd !== []
        ? \App\Support\Seo\SeoJsonLd::document($jsonLd)
        : [];
@endphp

@if ($title !== '')
    <title inertia="title">{{ $title }}</title>
@endif

@if ($description !== '')
    <meta inertia="description" name="description" content="{{ $description }}">
@endif

@if ($canonical !== '')
    <link inertia="canonical" rel="canonical" href="{{ $canonical }}">
@endif

<meta inertia="robots" name="robots" content="{{ $robots }}">
<meta inertia="og:site_name" property="og:site_name" content="{{ config('seo.title_suffix', 'Journey to Peace') }}">
<meta inertia="og:type" property="og:type" content="{{ $ogType }}">
<meta inertia="og:title" property="og:title" content="{{ $ogTitle }}">
<meta inertia="og:description" property="og:description" content="{{ $ogDescription }}">
<meta inertia="og:url" property="og:url" content="{{ $ogUrl }}">
<meta inertia="og:image" property="og:image" content="{{ $ogImage }}">
<meta inertia="og:locale" property="og:locale" content="{{ $ogLocale }}">
<meta inertia="twitter:card" name="twitter:card" content="summary_large_image">
<meta inertia="twitter:title" name="twitter:title" content="{{ $ogTitle }}">
<meta inertia="twitter:description" name="twitter:description" content="{{ $ogDescription }}">
<meta inertia="twitter:image" name="twitter:image" content="{{ $ogImage }}">

@if ($jsonLdDocument !== [])
    <script type="application/ld+json" inertia="json-ld">{!! json_encode($jsonLdDocument, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR) !!}</script>
@endif
