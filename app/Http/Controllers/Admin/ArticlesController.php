<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreArticleRequest;
use App\Http\Requests\Admin\UpdateArticleRequest;
use App\Models\Article;
use App\Support\Articles\ArticleAttributes;
use App\Support\Articles\ArticlePresenter;
use App\Support\Articles\ArticleSlug;
use App\Support\Media\ArticleCoverImage;
use App\Support\Media\MediaValidationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ArticlesController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/Articles', ArticlePresenter::forAdminIndex());
    }

    public function store(StoreArticleRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $request): void {
                $cover = app(ArticleCoverImage::class)->store($request->file('cover_image'));

                Article::query()->create(array_merge(
                    ArticleAttributes::fromValidated($validated),
                    [
                        'slug' => ArticleSlug::unique((string) $validated['title']),
                        'cover_media' => $cover->toArray(),
                    ],
                ));
            });
        } catch (MediaValidationException $exception) {
            return back()
                ->withErrors(['cover_image' => $exception->getMessage()])
                ->withInput();
        }

        return redirect()
            ->route('admin.articles.index')
            ->with('success', 'Article created.');
    }

    public function update(UpdateArticleRequest $request, Article $article): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $request, $article): void {
                $attributes = array_merge(
                    ArticleAttributes::fromValidated($validated, $article),
                    ['slug' => ArticleSlug::unique((string) $validated['title'], $article->id)],
                );

                if ($request->hasFile('cover_image')) {
                    $existing = $article->coverAsset();
                    $cover = app(ArticleCoverImage::class)->replace(
                        $request->file('cover_image'),
                        $existing,
                    );
                    $attributes['cover_media'] = $cover->toArray();
                }

                $article->update($attributes);
            });
        } catch (MediaValidationException $exception) {
            return back()
                ->withErrors(['cover_image' => $exception->getMessage()])
                ->withInput();
        }

        return redirect()
            ->route('admin.articles.index')
            ->with('success', 'Article updated.');
    }

    public function destroy(Article $article): RedirectResponse
    {
        DB::transaction(function () use ($article): void {
            $cover = $article->coverAsset();

            if ($cover !== null) {
                app(ArticleCoverImage::class)->delete($cover);
            }

            $article->delete();
        });

        return redirect()
            ->route('admin.articles.index')
            ->with('success', 'Article deleted.');
    }
}
