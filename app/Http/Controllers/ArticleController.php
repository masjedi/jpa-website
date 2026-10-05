<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Support\Articles\ArticlePresenter;
use App\Support\Seo\SeoPresenter;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ArticleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('public/Articles', [
            ...ArticlePresenter::forPublicIndex(),
            'seo' => SeoPresenter::page('articles', '/articles'),
        ]);
    }

    public function show(string $articleSlug): Response
    {
        $article = Article::query()
            ->published()
            ->with('teamMember')
            ->where('slug', $articleSlug)
            ->first();

        if ($article === null) {
            throw new NotFoundHttpException;
        }

        return Inertia::render('public/ArticleShow', [
            ...ArticlePresenter::forPublicShow($article),
            'seo' => SeoPresenter::article($article),
        ]);
    }
}
