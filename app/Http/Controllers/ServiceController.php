<?php

namespace App\Http\Controllers;

use App\Support\Services\ServiceOfferingPresenter;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('public/Services', [
            'offerings' => ServiceOfferingPresenter::forPublicPage(),
        ]);
    }
}
