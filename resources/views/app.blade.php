@php
    $rtlLocales = ['fa', 'fa_AF', 'ps', 'ps_AF', 'ar'];
    $direction = in_array(str_replace('-', '_', app()->getLocale()), $rtlLocales, true) ? 'rtl' : 'ltr';
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ $direction }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <x-inertia::head />
        @viteReactRefresh
        @vite('resources/js/app.tsx')
    </head>
    <body>
        <x-inertia::app />
    </body>
</html>
