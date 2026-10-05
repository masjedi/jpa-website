<?php

namespace App\Http\Controllers\Admin;

use App\Enums\HeroSlideStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreHeroSlideRequest;
use App\Http\Requests\Admin\UpdateHeroSectionRequest;
use App\Http\Requests\Admin\UpdateHeroSlideRequest;
use App\Models\HeroSection;
use App\Models\HeroSlide;
use App\Support\HeroSectionPresenter;
use App\Support\Media\HeroSlideImage;
use App\Support\Media\MediaValidationException;
use App\Support\Translatable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class HeroSectionController extends Controller
{
    public function index(): Response
    {
        $section = HeroSection::current()->load([
            'slides' => fn ($query) => $query->latestFirst(),
        ]);

        return Inertia::render('admin/HeroSection', HeroSectionPresenter::forAdmin($section));
    }

    public function update(UpdateHeroSectionRequest $request): RedirectResponse
    {
        $section = HeroSection::current();
        $section->update([
            'eyebrow' => Translatable::sanitize($request->validated('eyebrow')),
        ]);

        return redirect()
            ->route('admin.hero-section.index')
            ->with('success', 'Hero eyebrow updated.');
    }

    public function storeSlide(StoreHeroSlideRequest $request): RedirectResponse
    {
        $section = HeroSection::current();
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($section, $validated, $request): void {
                $image = app(HeroSlideImage::class)->store($request->file('hero_image'));
                $nextSortOrder = (int) $section->slides()->max('sort_order') + 1;

                $section->slides()->create([
                    'title' => Translatable::sanitize($validated['title']),
                    'subtitle' => Translatable::sanitize($validated['subtitle']),
                    'image_media' => $image->toArray(),
                    'status' => HeroSlideStatus::fromFrontend($validated['status']),
                    'sort_order' => $nextSortOrder,
                ]);
            });
        } catch (MediaValidationException $exception) {
            return back()
                ->withErrors(['hero_image' => $exception->getMessage()])
                ->withInput();
        } catch (\Throwable $exception) {
            report($exception);

            return back()
                ->withErrors([
                    'hero_image' => 'The hero image could not be processed. Try a smaller JPG/WEBP file (under 8 MB).',
                ])
                ->withInput();
        }

        return redirect()
            ->route('admin.hero-section.index')
            ->with('success', 'Hero slide created.');
    }

    public function updateSlide(UpdateHeroSlideRequest $request, HeroSlide $heroSlide): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $request, $heroSlide): void {
                $attributes = [
                    'title' => Translatable::sanitize($validated['title']),
                    'subtitle' => Translatable::sanitize($validated['subtitle']),
                    'status' => HeroSlideStatus::fromFrontend($validated['status']),
                ];

                if ($request->hasFile('hero_image')) {
                    $existing = $heroSlide->imageAsset();
                    $image = app(HeroSlideImage::class)->replace(
                        $request->file('hero_image'),
                        $existing,
                    );
                    $attributes['image_media'] = $image->toArray();
                }

                $heroSlide->update($attributes);
            });
        } catch (MediaValidationException $exception) {
            return back()
                ->withErrors(['hero_image' => $exception->getMessage()])
                ->withInput();
        } catch (\Throwable $exception) {
            report($exception);

            return back()
                ->withErrors([
                    'hero_image' => 'The hero image could not be processed. Try a smaller JPG/WEBP file (under 8 MB).',
                ])
                ->withInput();
        }

        return redirect()
            ->route('admin.hero-section.index')
            ->with('success', 'Hero slide updated.');
    }

    public function destroySlide(HeroSlide $heroSlide): RedirectResponse
    {
        DB::transaction(function () use ($heroSlide): void {
            $image = $heroSlide->imageAsset();

            if ($image !== null) {
                app(HeroSlideImage::class)->delete($image);
            }

            $heroSlide->delete();
        });

        return redirect()
            ->route('admin.hero-section.index')
            ->with('success', 'Hero slide deleted.');
    }
}
