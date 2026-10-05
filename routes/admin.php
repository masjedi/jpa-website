<?php

use App\Http\Controllers\Admin\AdminFeedController;
use App\Http\Controllers\Admin\ArticlesController;
use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DestinationsController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\Admin\HeroSectionController;
use App\Http\Controllers\Admin\InquiriesController;
use App\Http\Controllers\Admin\InvoicesController;
use App\Http\Controllers\Admin\ProtectedMediaController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\SubscriptionsController;
use App\Http\Controllers\Admin\ToursController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/', function () {
        return auth()->check()
            ? redirect()->route('admin.dashboard')
            : redirect()->route('admin.login');
    })->name('index');

    Route::middleware('guest')->group(function (): void {
        Route::get('login', [LoginController::class, 'create'])->name('login');
        Route::post('login', [LoginController::class, 'store'])->name('login.store');
    });

    Route::middleware('auth')->group(function (): void {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('hero-section', [HeroSectionController::class, 'index'])->name('hero-section.index');
        Route::patch('hero-section', [HeroSectionController::class, 'update'])->name('hero-section.update');
        Route::post('hero-section/slides', [HeroSectionController::class, 'storeSlide'])->name('hero-section.slides.store');
        Route::patch('hero-section/slides/{heroSlide}', [HeroSectionController::class, 'updateSlide'])->name('hero-section.slides.update');
        Route::delete('hero-section/slides/{heroSlide}', [HeroSectionController::class, 'destroySlide'])->name('hero-section.slides.destroy');
        Route::get('tours', [ToursController::class, 'index'])->name('tours.index');
        Route::post('tours', [ToursController::class, 'store'])->name('tours.store');
        Route::patch('tours/{tour}', [ToursController::class, 'update'])->name('tours.update');
        Route::delete('tours/{tour}', [ToursController::class, 'destroy'])->name('tours.destroy');
        Route::get('destinations', [DestinationsController::class, 'index'])->name('destinations.index');
        Route::post('destinations', [DestinationsController::class, 'store'])->name('destinations.store');
        Route::patch('destinations/{destination}', [DestinationsController::class, 'update'])->name('destinations.update');
        Route::delete('destinations/{destination}', [DestinationsController::class, 'destroy'])->name('destinations.destroy');
        Route::get('gallery', [AdminGalleryController::class, 'index'])->name('gallery.index');
        Route::post('gallery', [AdminGalleryController::class, 'store'])->name('gallery.store');
        Route::patch('gallery/{galleryPhoto}', [AdminGalleryController::class, 'update'])->name('gallery.update');
        Route::delete('gallery/{galleryPhoto}', [AdminGalleryController::class, 'destroy'])->name('gallery.destroy');
        Route::get('articles', [ArticlesController::class, 'index'])->name('articles.index');
        Route::post('articles', [ArticlesController::class, 'store'])->name('articles.store');
        Route::patch('articles/{article}', [ArticlesController::class, 'update'])->name('articles.update');
        Route::delete('articles/{article}', [ArticlesController::class, 'destroy'])->name('articles.destroy');
        Route::get('faq', [FaqController::class, 'index'])->name('faq.index');
        Route::post('faq', [FaqController::class, 'store'])->name('faq.store');
        Route::patch('faq/{faqItem}', [FaqController::class, 'update'])->name('faq.update');
        Route::delete('faq/{faqItem}', [FaqController::class, 'destroy'])->name('faq.destroy');
        Route::get('subscriptions', [SubscriptionsController::class, 'index'])->name('subscriptions.index');
        Route::delete('subscriptions/{newsletterSubscription}', [SubscriptionsController::class, 'destroy'])->name('subscriptions.destroy');
        Route::post('feed/notifications/read', [AdminFeedController::class, 'markNotificationsRead'])->name('feed.notifications.read');
        Route::post('feed/messages/read', [AdminFeedController::class, 'markMessagesRead'])->name('feed.messages.read');
        Route::get('inquiries', [InquiriesController::class, 'index'])->name('inquiries.index');
        Route::delete('inquiries/{inquiry}', [InquiriesController::class, 'destroy'])->name('inquiries.destroy');
        Route::get('invoices', [InvoicesController::class, 'index'])->name('invoices.index');
        Route::post('invoices', [InvoicesController::class, 'store'])->name('invoices.store');
        Route::patch('invoices/{invoice}', [InvoicesController::class, 'update'])->name('invoices.update');
        Route::delete('invoices/{invoice}', [InvoicesController::class, 'destroy'])->name('invoices.destroy');
        Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::patch('settings', [SettingsController::class, 'update'])->name('settings.update');
        Route::get('media/{profile}/{id}', [ProtectedMediaController::class, 'show'])
            ->where('profile', '[a-z_]+')
            ->whereUuid('id')
            ->name('media.show');
        Route::post('logout', [LoginController::class, 'destroy'])->name('logout');
    });
});
