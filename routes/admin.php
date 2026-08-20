<?php

use App\Http\Controllers\Admin\ArticlesController;
use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DestinationsController;
use App\Http\Controllers\Admin\InquiriesController;
use App\Http\Controllers\Admin\InvoicesController;
use App\Http\Controllers\Admin\SettingsController;
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
        Route::get('tours', [ToursController::class, 'index'])->name('tours.index');
        Route::get('destinations', [DestinationsController::class, 'index'])->name('destinations.index');
        Route::get('articles', [ArticlesController::class, 'index'])->name('articles.index');
        Route::get('inquiries', [InquiriesController::class, 'index'])->name('inquiries.index');
        Route::get('invoices', [InvoicesController::class, 'index'])->name('invoices.index');
        Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::post('logout', [LoginController::class, 'destroy'])->name('logout');
    });
});
