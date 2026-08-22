<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('public/Home');
})->name('home');

Route::get('/tours', function () {
    return Inertia::render('public/Tours');
})->name('tours.index');

Route::get('/tours/{tourSlug}', function (string $tourSlug) {
    return Inertia::render('public/TourShow', [
        'tourSlug' => $tourSlug,
    ]);
})->name('tours.show');

Route::get('/packages/{packageSlug}', function (string $packageSlug) {
    return Inertia::render('public/PackageShow', [
        'packageSlug' => $packageSlug,
    ]);
})->name('packages.show');

Route::get('/destinations', function () {
    return Inertia::render('public/Destinations');
})->name('destinations.index');

Route::get('/destinations/{destinationSlug}', function (string $destinationSlug) {
    return Inertia::render('public/DestinationShow', [
        'destinationSlug' => $destinationSlug,
    ]);
})->name('destinations.show');

Route::get('/services', function () {
    return Inertia::render('public/Services');
})->name('services.index');

Route::get('/articles', function () {
    return Inertia::render('public/Articles');
})->name('articles.index');

Route::get('/articles/{articleSlug}', function (string $articleSlug) {
    return Inertia::render('public/ArticleShow', [
        'articleSlug' => $articleSlug,
    ]);
})->name('articles.show');

Route::get('/about', function () {
    return Inertia::render('public/About');
})->name('about');

Route::get('/gallery', function () {
    return Inertia::render('public/Gallery');
})->name('gallery');

Route::get('/contact', function () {
    return Inertia::render('public/Contact');
})->name('contact');

Route::get('/privacy', function () {
    return Inertia::render('public/Privacy');
})->name('privacy');

Route::get('/terms', function () {
    return Inertia::render('public/Terms');
})->name('terms');

Route::get('/sitemap.xml', function () {
    $base = rtrim((string) config('app.url'), '/');
    $paths = [
        '/',
        '/tours',
        '/destinations',
        '/services',
        '/articles',
        '/about',
        '/gallery',
        '/contact',
        '/privacy',
        '/terms',
    ];

    $urls = collect($paths)
        ->map(function (string $path) use ($base): string {
            $loc = htmlspecialchars($base.$path, ENT_XML1);

            return "    <url>\n        <loc>{$loc}</loc>\n        <changefreq>weekly</changefreq>\n    </url>";
        })
        ->implode("\n");

    $xml = <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{$urls}
</urlset>
XML;

    return response($xml, 200)->header('Content-Type', 'application/xml');
})->name('sitemap');

require __DIR__.'/admin.php';
