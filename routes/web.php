<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('public/Home');
})->name('home');

Route::get('/tours', function () {
    return Inertia::render('public/Tours');
})->name('tours.index');
