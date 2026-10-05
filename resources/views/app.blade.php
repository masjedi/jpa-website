@php
    $locale = app()->getLocale();
    $htmlLanguage = \App\Support\Locale::htmlLang($locale);
    $direction = \App\Support\Locale::direction($locale);

    $isAdmin = request()->routeIs('admin.*')
        || request()->is('admin', 'admin/*');
@endphp

<!DOCTYPE html>
<html
    lang="{{ $htmlLanguage }}"
    dir="{{ $direction }}"
    @if ($isAdmin) data-secure-chrome="true" @endif
>
<head>
    <meta charset="utf-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
    >

    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="color-scheme" content="light dark">

    <meta
        name="theme-color"
        content="#f7fafc"
        media="(prefers-color-scheme: light)"
    >

    <meta
        name="theme-color"
        content="#071722"
        media="(prefers-color-scheme: dark)"
    >

    @if ($isAdmin)
        {{-- Prevent administration pages from appearing in search results. --}}
        <meta
            name="robots"
            content="noindex, nofollow, noarchive, nosnippet"
        >
        <meta name="referrer" content="no-referrer">
    @else
        <meta
            name="referrer"
            content="strict-origin-when-cross-origin"
        >
    @endif

    {{-- Website icons --}}
    <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="{{ asset('favicon-32.png') }}"
    >

    <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="{{ asset('apple-touch-icon.png') }}"
    >

    {{-- Apply the saved theme before React loads to prevent flashing. --}}
    <script>
        (function () {
            const storageKey = 'appearance';
            const supportedModes = ['light', 'dark', 'system'];

            try {
                const storedMode = localStorage.getItem(storageKey);
                const appearance = supportedModes.includes(storedMode)
                    ? storedMode
                    : 'light';

                const systemPrefersDark = window.matchMedia(
                    '(prefers-color-scheme: dark)'
                ).matches;

                const useDarkMode =
                    appearance === 'dark'
                    || (appearance === 'system' && systemPrefersDark);

                document.documentElement.classList.toggle(
                    'dark',
                    useDarkMode
                );

                document.documentElement.style.colorScheme =
                    useDarkMode ? 'dark' : 'light';
            } catch {
                document.documentElement.style.colorScheme = 'light';
            }
        })();
    </script>

    <style>
        html {
            min-height: 100%;
            overflow-x: clip;
            background-color: #f7fafc;
        }

        html.dark {
            background-color: #071722;
        }

        body {
            min-height: 100vh;
            margin: 0;
            background-color: inherit;
        }
    </style>

    @php
        $seo = is_array($page['props']['seo'] ?? null) ? $page['props']['seo'] : null;
    @endphp

    {{--
        Blade SEO lives in the Inertia head slot so crawlers see tags without
        JavaScript. If Node SSR is enabled later, this slot is unused and the
        SSR head is the only copy. Matching inertia="" / head-key values keep
        hydration from duplicating tags.
    --}}
    <x-inertia::head>
        @if (! $isAdmin && is_array($seo))
            <x-seo-head :seo="$seo" />
        @endif
    </x-inertia::head>

    @viteReactRefresh
    @vite([
        'resources/css/app.css',
        'resources/js/app.tsx',
    ])
</head>

<body>
    <noscript>
        JavaScript is required to use this website.
    </noscript>

    <x-inertia::app />
</body>
</html>