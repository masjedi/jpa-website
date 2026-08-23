<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TourListingType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTourRequest;
use App\Http\Requests\Admin\UpdateTourRequest;
use App\Models\Tour;
use App\Support\Media\MediaValidationException;
use App\Support\Media\TourCoverImage;
use App\Support\Tours\TourAttributes;
use App\Support\Tours\TourPresenter;
use App\Support\Tours\TourSlug;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ToursController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/Tours', TourPresenter::forAdminIndex());
    }

    public function store(StoreTourRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $listingType = TourListingType::fromFrontend((string) $validated['listing_type']);

        try {
            DB::transaction(function () use ($validated, $listingType, $request): void {
                $cover = app(TourCoverImage::class)->store($request->file('cover_image'));

                Tour::query()->create(array_merge(
                    TourAttributes::fromValidated($validated, $listingType),
                    [
                        'slug' => TourSlug::unique((string) $validated['title']),
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
            ->route('admin.tours.index')
            ->with('success', $listingType === TourListingType::Package
                ? 'Travel package created.'
                : 'Tour created.');
    }

    public function update(UpdateTourRequest $request, Tour $tour): RedirectResponse
    {
        $validated = $request->validated();
        $listingType = TourListingType::fromFrontend((string) $validated['listing_type']);
        TourAttributes::assertListingTypeUnchanged($tour, $listingType);

        try {
            DB::transaction(function () use ($validated, $listingType, $request, $tour): void {
                $attributes = array_merge(
                    TourAttributes::fromValidated($validated, $listingType),
                    ['slug' => TourSlug::unique((string) $validated['title'], $tour->id)],
                );

                if ($request->hasFile('cover_image')) {
                    $existing = $tour->coverAsset();
                    $cover = app(TourCoverImage::class)->replace(
                        $request->file('cover_image'),
                        $existing,
                    );
                    $attributes['cover_media'] = $cover->toArray();
                }

                $tour->update($attributes);
            });
        } catch (MediaValidationException $exception) {
            return back()
                ->withErrors(['cover_image' => $exception->getMessage()])
                ->withInput();
        }

        return redirect()
            ->route('admin.tours.index')
            ->with('success', $listingType === TourListingType::Package
                ? 'Travel package updated.'
                : 'Tour updated.');
    }

    public function destroy(Tour $tour): RedirectResponse
    {
        DB::transaction(function () use ($tour): void {
            $cover = $tour->coverAsset();

            if ($cover !== null) {
                app(TourCoverImage::class)->delete($cover);
            }

            $tour->delete();
        });

        return redirect()
            ->route('admin.tours.index')
            ->with('success', $tour->isPackage()
                ? 'Travel package deleted.'
                : 'Tour deleted.');
    }
}
