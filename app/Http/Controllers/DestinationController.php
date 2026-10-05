<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Support\Destinations\DestinationPresenter;
use App\Support\Seo\SeoPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DestinationController extends Controller
{
    public function index(Request $request): RedirectResponse
    {
        $query = $request->query();
        unset($query['view']);
        $query['view'] = 'destinations';

        return redirect()->to('/tours?'.http_build_query($query), 301);
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

        return Inertia::render('public/DestinationShow', [
            ...DestinationPresenter::forPublicShow($destination),
            'seo' => SeoPresenter::destination($destination),
        ]);
    }
}
