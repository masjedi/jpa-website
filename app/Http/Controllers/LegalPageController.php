<?php

namespace App\Http\Controllers;

use App\Enums\LegalPageKey;
use App\Support\Legal\LegalPagePresenter;
use App\Support\Seo\SeoPresenter;
use Inertia\Inertia;
use Inertia\Response;

class LegalPageController extends Controller
{
    public function privacy(): Response
    {
        return Inertia::render('public/Privacy', [
            ...LegalPagePresenter::forPublic(LegalPageKey::Privacy),
            'seo' => SeoPresenter::page('privacy', '/privacy'),
        ]);
    }

    public function terms(): Response
    {
        return Inertia::render('public/Terms', [
            ...LegalPagePresenter::forPublic(LegalPageKey::Terms),
            'seo' => SeoPresenter::page('terms', '/terms'),
        ]);
    }
}
