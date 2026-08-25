<?php

namespace App\Http\Controllers;

use App\Support\About\AboutPagePresenter;
use Inertia\Inertia;
use Inertia\Response;

class AboutPageController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('public/About', AboutPagePresenter::forPublic());
    }
}
