<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Support\Destinations\DestinationPresenter;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DestinationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('public/Destinations', DestinationPresenter::forPublicIndex());
    }

    public function show(string $destinationSlug): Response
    {
        $destination = Destination::query()
            ->published()
            ->where('slug', $destinationSlug)
            ->first();

        if ($destination === null) {
            throw new NotFoundHttpException;
        }

        return Inertia::render(
            'public/DestinationShow',
            DestinationPresenter::forPublicShow($destination),
        );
    }
}
