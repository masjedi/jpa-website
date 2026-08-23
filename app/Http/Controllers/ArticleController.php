<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Support\Articles\ArticlePresenter;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ArticleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('public/Articles', ArticlePresenter::forPublicIndex());
    }

    public function show(string $articleSlug): Response
    {
        $article = Article::query()
            ->published()
            ->where('slug', $articleSlug)
            ->first();

        if ($article === null) {
            throw new NotFoundHttpException;
        }

        return Inertia::render(
            'public/ArticleShow',
            ArticlePresenter::forPublicShow($article),
        );
    }
}
