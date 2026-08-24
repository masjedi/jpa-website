<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSiteSettingsRequest;
use App\Models\SiteSetting;
use App\Support\Media\BrandLogoImage;
use App\Support\Media\MediaValidationException;
use App\Support\SiteSettings\SiteSettingsPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/Settings', SiteSettingsPresenter::forAdmin());
    }

    public function update(UpdateSiteSettingsRequest $request): RedirectResponse
    {
        $settings = SiteSetting::current();
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($request, $settings, $validated): void {
                $attributes = SiteSettingsPresenter::attributesFromValidated($validated);
                $logos = app(BrandLogoImage::class);

                if ($request->hasFile('logo_color')) {
                    $attributes['logo_color_media'] = $logos
                        ->replace($request->file('logo_color'), $settings->logoColorAsset())
                        ->toArray();
                }

                if ($request->hasFile('logo_white')) {
                    $attributes['logo_white_media'] = $logos
                        ->replace($request->file('logo_white'), $settings->logoWhiteAsset())
                        ->toArray();
                }

                $settings->update($attributes);
            });
        } catch (MediaValidationException $exception) {
            $field = $request->hasFile('logo_color') ? 'logo_color' : 'logo_white';

            return back()
                ->withErrors([$field => $exception->getMessage()])
                ->withInput();
        }

        return redirect()
            ->route('admin.settings.index')
            ->with('success', 'Site identity settings saved.');
    }
}
