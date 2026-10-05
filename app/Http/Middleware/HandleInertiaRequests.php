<?php

namespace App\Http\Middleware;

use App\Support\Admin\AdminFeedPresenter;
use App\Support\Brand;
use App\Support\Locale;
use App\Support\SiteSettings\SiteSettingsPresenter;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = app()->getLocale();

        $user = $request->user();

        return [
            ...parent::share($request),
            'locale' => $locale,
            'direction' => Locale::direction($locale),
            'locales' => Locale::supported(),
            'translations' => fn () => Locale::publicTranslations($locale),
            'appName' => Brand::appName(),
            'appUrl' => rtrim((string) config('app.url'), '/'),
            'siteSettings' => fn () => SiteSettingsPresenter::forShared(),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'customBookingSuccess' => fn () => $request->session()->pull('customBookingSuccess'),
            ],
            'adminFeed' => fn () => $user !== null && $request->is('admin', 'admin/*')
                ? AdminFeedPresenter::forNavbar()
                : null,
        ];
    }
}
