<?php

namespace App\Http\Controllers;

use App\Enums\TourListingType;
use App\Models\Tour;
use App\Support\Seo\SeoPresenter;
use App\Support\Tours\TourPresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class TourController extends Controller
{
    public function index(Request $request): Response
    {
        $view = $this->resolveDiscoveryView($request->query('view'));

        return Inertia::render('public/Tours', [
            ...TourPresenter::forPublicDiscovery($view),
            'seo' => SeoPresenter::discovery($view),
        ]);
    }

    public function show(string $tourSlug): Response
    {
        $tour = $this->findPublishedListing($tourSlug, TourListingType::Tour);

        return Inertia::render('public/TourShow', [
            'offer' => TourPresenter::travelOfferFromTour(
                $tour,
                TourPresenter::relatedTours($tour),
            ),
            'seo' => SeoPresenter::tour($tour),
        ]);
    }

    public function showPackage(string $packageSlug): Response
    {
        $package = $this->findPublishedListing($packageSlug, TourListingType::Package);

        return Inertia::render('public/PackageShow', [
            'offer' => TourPresenter::travelOfferFromPackage(
                $package,
                TourPresenter::relatedPackages($package),
            ),
            'seo' => SeoPresenter::package($package),
        ]);
    }

    private function resolveDiscoveryView(mixed $view): string
    {
        return match ($view) {
            'packages', 'destinations' => $view,
            default => 'tours',
        };
    }

    private function findPublishedListing(string $slug, TourListingType $type): Tour
    {
        $listing = Tour::query()
            ->published()
            ->where('listing_type', $type)
            ->where('slug', $slug)
            ->first();

        if ($listing === null) {
            throw new NotFoundHttpException;
        }

        return $listing;
    }
}
