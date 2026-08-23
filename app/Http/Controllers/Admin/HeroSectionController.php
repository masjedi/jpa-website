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
use Illuminate\Http\RedirectResponse;
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
        $section->update($request->validated());

        return redirect()
            ->route('admin.hero-section.index')
            ->with('success', 'Hero eyebrow updated.');
    }

    public function storeSlide(StoreHeroSlideRequest $request): RedirectResponse
    {
        $section = HeroSection::current();
        $validated = $request->validated();

        $nextSortOrder = (int) $section->slides()->max('sort_order') + 1;

        $section->slides()->create([
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'],
            'status' => HeroSlideStatus::fromFrontend($validated['status']),
            'sort_order' => $nextSortOrder,
        ]);

        return redirect()
            ->route('admin.hero-section.index')
            ->with('success', 'Hero slide created.');
    }

    public function updateSlide(UpdateHeroSlideRequest $request, HeroSlide $heroSlide): RedirectResponse
    {
        $validated = $request->validated();

        $heroSlide->update([
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'],
            'status' => HeroSlideStatus::fromFrontend($validated['status']),
        ]);

        return redirect()
            ->route('admin.hero-section.index')
            ->with('success', 'Hero slide updated.');
    }

    public function destroySlide(HeroSlide $heroSlide): RedirectResponse
    {
        $heroSlide->delete();

        return redirect()
            ->route('admin.hero-section.index')
            ->with('success', 'Hero slide deleted.');
    }
}
