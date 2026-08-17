@php
    $locale = app()->getLocale();
    $direction = \App\Support\Locale::direction($locale);
@endphp
<!DOCTYPE html>
<html lang="{{ \App\Support\Locale::htmlLang($locale) }}" dir="{{ $direction }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <script>
            (function () {
                var storageKey = 'appearance';
                var stored = localStorage.getItem(storageKey);
                var preference = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
                var isDark = preference === 'dark' || (preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

                document.documentElement.classList.toggle('dark', isDark);
                document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
            })();
        </script>
        <style>
            html { background-color: #f7fafc; }
            html.dark { background-color: #071722; }
            body { margin: 0; min-height: 100vh; background-color: inherit; }
        </style>

        <x-inertia::head />
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    </head>
    <body>
        <x-inertia::app />
    </body>
</html>
