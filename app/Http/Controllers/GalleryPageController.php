<?php

namespace App\Http\Controllers;

use App\Support\Gallery\GalleryPhotoPresenter;
use App\Support\Seo\SeoPresenter;
use Inertia\Inertia;
use Inertia\Response;

class GalleryPageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('public/Gallery', [
            ...GalleryPhotoPresenter::forPublicIndex(),
            'seo' => SeoPresenter::page('gallery', '/gallery'),
        ]);
    }
}
