<?php

namespace App\Http\Controllers;

use App\Models\HeroSection;
use App\Support\Articles\ArticlePresenter;
use App\Support\Destinations\DestinationPresenter;
use App\Support\Faq\FaqItemPresenter;
use App\Support\Gallery\GalleryPhotoPresenter;
use App\Support\HeroSectionPresenter;
use App\Support\Services\ServiceOfferingPresenter;
use App\Support\Testimonials\TestimonialPresenter;
use App\Support\Tours\TourFilterOptionPresenter;
use App\Support\Tours\TourPresenter;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $section = HeroSection::current()->load([
            'slides' => fn ($query) => $query->forPublicHero(3),
        ]);

        return Inertia::render('public/Home', [
            'hero' => HeroSectionPresenter::forPublicHome($section),
            'finderOptions' => TourFilterOptionPresenter::forPublicHomeFinder(),
            'homeServices' => ServiceOfferingPresenter::forPublicHomePreview(),
            'featuredTours' => Inertia::defer(fn () => TourPresenter::forPublicHomePreview(3)),
            'featuredDestinations' => Inertia::defer(fn () => DestinationPresenter::forPublicHomePreview(4)),
            'galleryPreview' => Inertia::defer(fn () => GalleryPhotoPresenter::forPublicHomePreview(6)),
            'latestArticles' => Inertia::defer(fn () => ArticlePresenter::forPublicHomePreview(3)),
            'faqItems' => Inertia::defer(fn () => FaqItemPresenter::forPublicHomePreview()),
            'testimonials' => Inertia::defer(fn () => TestimonialPresenter::forPublicHome()),
        ]);
    }
}
