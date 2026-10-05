<?php

use App\Http\Controllers\Admin\AboutPageController as AdminAboutPageController;
use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\AdminFeedController;
use App\Http\Controllers\Admin\ArticlesController;
use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\Admin\ChatConversationsController;
use App\Http\Controllers\Admin\CustomBookingsController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DestinationsController;
use App\Http\Controllers\Admin\EmergencyContactsController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\FilterPlacementController;
use App\Http\Controllers\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\Admin\HeroSectionController;
use App\Http\Controllers\Admin\HomeFinderController;
use App\Http\Controllers\Admin\InquiriesController;
use App\Http\Controllers\Admin\InvoicesController;
use App\Http\Controllers\Admin\LegalPagesController;
use App\Http\Controllers\Admin\ProtectedMediaController;
use App\Http\Controllers\Admin\ServicesController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\SubscriptionsController;
use App\Http\Controllers\Admin\TeamsController;
use App\Http\Controllers\Admin\TestimonialsController;
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
        Route::post('login', [LoginController::class, 'store'])
            ->middleware('throttle:5,1')
            ->name('login.store');
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
        Route::get('services', [ServicesController::class, 'index'])->name('services.index');
        Route::post('services', [ServicesController::class, 'store'])->name('services.store');
        Route::patch('services/{serviceOffering}', [ServicesController::class, 'update'])->name('services.update');
        Route::delete('services/{serviceOffering}', [ServicesController::class, 'destroy'])->name('services.destroy');
        Route::get('filter-placement', [FilterPlacementController::class, 'index'])->name('filter-placement.index');
        Route::post('filter-placement', [FilterPlacementController::class, 'store'])->name('filter-placement.store');
        Route::patch('filter-placement/{tourFilterOption}', [FilterPlacementController::class, 'update'])->name('filter-placement.update');
        Route::delete('filter-placement/{tourFilterOption}', [FilterPlacementController::class, 'destroy'])->name('filter-placement.destroy');
        Route::get('home-finder', [HomeFinderController::class, 'index'])->name('home-finder.index');
        Route::get('emergency-contacts', [EmergencyContactsController::class, 'index'])->name('emergency-contacts.index');
        Route::post('emergency-contacts', [EmergencyContactsController::class, 'store'])->name('emergency-contacts.store');
        Route::patch('emergency-contacts/{emergencyContact}', [EmergencyContactsController::class, 'update'])->name('emergency-contacts.update');
        Route::patch('emergency-contacts/{emergencyContact}/deactivate', [EmergencyContactsController::class, 'deactivate'])->name('emergency-contacts.deactivate');
        Route::get('about', [AdminAboutPageController::class, 'index'])->name('about.index');
        Route::patch('about', [AdminAboutPageController::class, 'update'])->name('about.update');
        Route::post('about/journey-steps', [AdminAboutPageController::class, 'storeJourneyStep'])->name('about.journey-steps.store');
        Route::patch('about/journey-steps/{aboutJourneyStep}', [AdminAboutPageController::class, 'updateJourneyStep'])->name('about.journey-steps.update');
        Route::delete('about/journey-steps/{aboutJourneyStep}', [AdminAboutPageController::class, 'destroyJourneyStep'])->name('about.journey-steps.destroy');
        Route::get('legal-pages', [LegalPagesController::class, 'index'])->name('legal-pages.index');
        Route::get('legal-pages/{key}/edit', [LegalPagesController::class, 'edit'])->name('legal-pages.edit');
        Route::patch('legal-pages/{key}', [LegalPagesController::class, 'update'])->name('legal-pages.update');
        Route::get('teams', [TeamsController::class, 'index'])->name('teams.index');
        Route::post('teams', [TeamsController::class, 'store'])->name('teams.store');
        Route::patch('teams/{teamMember}', [TeamsController::class, 'update'])->name('teams.update');
        Route::delete('teams/{teamMember}', [TeamsController::class, 'destroy'])->name('teams.destroy');
        Route::get('testimonials', [TestimonialsController::class, 'index'])->name('testimonials.index');
        Route::post('testimonials', [TestimonialsController::class, 'store'])->name('testimonials.store');
        Route::patch('testimonials/{testimonial}', [TestimonialsController::class, 'update'])->name('testimonials.update');
        Route::delete('testimonials/{testimonial}', [TestimonialsController::class, 'destroy'])->name('testimonials.destroy');
        Route::get('subscriptions', [SubscriptionsController::class, 'index'])->name('subscriptions.index');
        Route::delete('subscriptions/{newsletterSubscription}', [SubscriptionsController::class, 'destroy'])->name('subscriptions.destroy');
        Route::post('feed/notifications/read', [AdminFeedController::class, 'markNotificationsRead'])->name('feed.notifications.read');
        Route::post('feed/messages/read', [AdminFeedController::class, 'markMessagesRead'])->name('feed.messages.read');
        Route::get('inquiries', [InquiriesController::class, 'index'])->name('inquiries.index');
        Route::delete('inquiries/{inquiry}', [InquiriesController::class, 'destroy'])->name('inquiries.destroy');
        Route::get('chat', [ChatConversationsController::class, 'index'])->name('chat.index');
        Route::get('chat/{chatConversation}', [ChatConversationsController::class, 'show'])->name('chat.show');
        Route::post('chat/{chatConversation}/messages', [ChatConversationsController::class, 'storeMessage'])->name('chat.messages.store');
        Route::post('chat/{chatConversation}/typing', [ChatConversationsController::class, 'typing'])
            ->middleware('throttle:30,1')
            ->name('chat.typing');
        Route::patch('chat/{chatConversation}/read', [ChatConversationsController::class, 'markRead'])->name('chat.read');
        Route::patch('chat/{chatConversation}', [ChatConversationsController::class, 'update'])->name('chat.update');
        Route::get('invoices', [InvoicesController::class, 'index'])->name('invoices.index');
        Route::post('invoices', [InvoicesController::class, 'store'])->name('invoices.store');
        Route::patch('invoices/{invoice}', [InvoicesController::class, 'update'])->name('invoices.update');
        Route::delete('invoices/{invoice}', [InvoicesController::class, 'destroy'])->name('invoices.destroy');
        Route::get('bookings', [CustomBookingsController::class, 'index'])->name('bookings.index');
        Route::get('bookings/{customBooking}', [CustomBookingsController::class, 'show'])->name('bookings.show');
        Route::patch('bookings/{customBooking}', [CustomBookingsController::class, 'update'])->name('bookings.update');
        Route::patch('bookings/{customBooking}/status', [CustomBookingsController::class, 'updateStatus'])->name('bookings.status');
        Route::delete('bookings/{customBooking}', [CustomBookingsController::class, 'destroy'])->name('bookings.destroy');
        Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::patch('settings', [SettingsController::class, 'update'])->name('settings.update');
        Route::get('account', [AccountController::class, 'index'])->name('account.index');
        Route::patch('account/email', [AccountController::class, 'updateEmail'])->name('account.email.update');
        Route::patch('account/password', [AccountController::class, 'updatePassword'])->name('account.password.update');
        Route::get('media/{profile}/{id}', [ProtectedMediaController::class, 'show'])
            ->where('profile', '[a-z_]+')
            ->whereUuid('id')
            ->name('media.show');
        Route::post('logout', [LoginController::class, 'destroy'])->name('logout');
    });
});
