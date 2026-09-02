<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\Tours\TourFilterOptionPresenter;
use Inertia\Inertia;
use Inertia\Response;

class HomeFinderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/HomeFinder', TourFilterOptionPresenter::forHomeFinderIndex());
    }
}
