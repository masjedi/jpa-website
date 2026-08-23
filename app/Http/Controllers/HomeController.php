<?php

namespace App\Http\Controllers;

use App\Models\HeroSection;
use App\Support\Gallery\GalleryPhotoPresenter;
use App\Support\HeroSectionPresenter;
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
            'galleryPreview' => GalleryPhotoPresenter::forPublicHomePreview(6),
        ]);
    }
}
