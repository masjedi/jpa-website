<?php

use App\Http\Controllers\AboutPageController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\GalleryPageController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\InvoiceVerificationController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\NewsletterSubscriptionController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TeamPageController;
use App\Http\Controllers\TourController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::post('/locale', [LocaleController::class, 'update'])
    ->middleware('throttle:20,1')
    ->name('locale.update');

Route::post('/newsletter/subscribe', [NewsletterSubscriptionController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('newsletter.subscribe');

Route::post('/inquiries/contact', [InquiryController::class, 'storeContact'])
    ->middleware('throttle:10,1')
    ->name('inquiries.contact');

Route::post('/inquiries/tour', [InquiryController::class, 'storeTour'])
    ->middleware('throttle:10,1')
    ->name('inquiries.tour');

Route::get('/tours', [TourController::class, 'index'])->name('tours.index');

Route::get('/tours/{tourSlug}', [TourController::class, 'show'])->name('tours.show');

Route::get('/packages/{packageSlug}', [TourController::class, 'showPackage'])->name('packages.show');

Route::get('/destinations', [DestinationController::class, 'index'])->name('destinations.index');

Route::get('/destinations/{destinationSlug}', [DestinationController::class, 'show'])->name('destinations.show');

Route::get('/services', [ServiceController::class, 'index'])->name('services.index');

Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');

Route::get('/articles/{articleSlug}', [ArticleController::class, 'show'])->name('articles.show');

Route::get('/about', [AboutPageController::class, 'show'])->name('about');

Route::get('/about/team', [TeamPageController::class, 'index'])->name('about.team');

Route::get('/gallery', [GalleryPageController::class, 'index'])->name('gallery');

Route::get('/booking', [BookingController::class, 'index'])->name('booking');

Route::post('/booking', [BookingController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('booking.store');

Route::get('/contact', function () {
    return Inertia::render('public/Contact');
})->name('contact');

Route::get('/privacy', function () {
    return Inertia::render('public/Privacy');
})->name('privacy');

Route::get('/terms', function () {
    return Inertia::render('public/Terms');
})->name('terms');

Route::get('/invoices/verify/{token}', [InvoiceVerificationController::class, 'show'])
    ->name('invoices.verify');

Route::get('/sitemap.xml', function () {
    $base = rtrim((string) config('app.url'), '/');
    $paths = [
        '/',
        '/tours',
        '/destinations',
        '/services',
        '/articles',
        '/about',
        '/about/team',
        '/gallery',
        '/booking',
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
