<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDestinationRequest;
use App\Http\Requests\Admin\UpdateDestinationRequest;
use App\Models\Destination;
use App\Support\Destinations\DestinationAttributes;
use App\Support\Destinations\DestinationPresenter;
use App\Support\Destinations\DestinationSlug;
use App\Support\Media\DestinationCoverImage;
use App\Support\Media\MediaValidationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DestinationsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/Destinations', DestinationPresenter::forAdminIndex());
    }

    public function store(StoreDestinationRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $request): void {
                $cover = app(DestinationCoverImage::class)->store($request->file('cover_image'));

                Destination::query()->create(array_merge(
                    DestinationAttributes::fromValidated($validated),
                    [
                        'slug' => DestinationSlug::unique((string) $validated['name']),
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
            ->route('admin.destinations.index')
            ->with('success', 'Destination created.');
    }

    public function update(UpdateDestinationRequest $request, Destination $destination): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $request, $destination): void {
                $attributes = array_merge(
                    DestinationAttributes::fromValidated($validated),
                    ['slug' => DestinationSlug::unique((string) $validated['name'], $destination->id)],
                );

                if ($request->hasFile('cover_image')) {
                    $existing = $destination->coverAsset();
                    $cover = app(DestinationCoverImage::class)->replace(
                        $request->file('cover_image'),
                        $existing,
                    );
                    $attributes['cover_media'] = $cover->toArray();
                }

                $destination->update($attributes);
            });
        } catch (MediaValidationException $exception) {
            return back()
                ->withErrors(['cover_image' => $exception->getMessage()])
                ->withInput();
        }

        return redirect()
            ->route('admin.destinations.index')
            ->with('success', 'Destination updated.');
    }

    public function destroy(Destination $destination): RedirectResponse
    {
        DB::transaction(function () use ($destination): void {
            $cover = $destination->coverAsset();

            if ($cover !== null) {
                app(DestinationCoverImage::class)->delete($cover);
            }

            $destination->delete();
        });

        return redirect()
            ->route('admin.destinations.index')
            ->with('success', 'Destination deleted.');
    }
}
