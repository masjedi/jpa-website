<?php

namespace App\Http\Controllers;

use App\Enums\TourListingType;
use App\Models\Tour;
use App\Support\Tours\TourPresenter;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class TourController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('public/Tours', TourPresenter::forPublicIndex());
    }

    public function show(string $tourSlug): Response
    {
        $tour = $this->findPublishedListing($tourSlug, TourListingType::Tour);

        return Inertia::render('public/TourShow', [
            'offer' => TourPresenter::travelOfferFromTour(
                $tour,
                TourPresenter::relatedTours($tour),
            ),
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
        ]);
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
