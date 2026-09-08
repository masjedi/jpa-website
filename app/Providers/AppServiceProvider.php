<?php

namespace App\Providers;

use App\Models\Article;
use App\Models\Destination;
use App\Models\Tour;
use App\Observers\SeoSitemapObserver;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $publicHtml = dirname(base_path()).'/public_html';

        if (
            is_file($publicHtml.'/index.php')
            && is_file($publicHtml.'/build/manifest.json')
        ) {
            $this->app->usePublicPath($publicHtml);
        }

        if ($this->app->isProduction()) {
            $this->app['config']->set('boost.enabled', false);
            $this->app['config']->set('inertia.ssr.enabled', false);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->isProduction()) {
            URL::forceScheme('https');
        }

        Tour::observe(SeoSitemapObserver::class);
        Article::observe(SeoSitemapObserver::class);
        Destination::observe(SeoSitemapObserver::class);

        Authenticate::redirectUsing(
            fn (Request $request): string => route('admin.login'),
        );

        RedirectIfAuthenticated::redirectUsing(
            fn (): string => route('admin.dashboard'),
        );
    }
}
