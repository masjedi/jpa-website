<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAboutJourneyStepRequest;
use App\Http\Requests\Admin\UpdateAboutJourneyStepRequest;
use App\Http\Requests\Admin\UpdateAboutPageRequest;
use App\Models\AboutJourneyStep;
use App\Models\AboutPage;
use App\Support\About\AboutJourneyStepAttributes;
use App\Support\About\AboutPagePresenter;
use App\Support\Media\AboutJourneyImage;
use App\Support\Media\MediaValidationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AboutPageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/About', AboutPagePresenter::forAdmin());
    }

    public function update(UpdateAboutPageRequest $request): RedirectResponse
    {
        AboutPage::current()->update(
            AboutPagePresenter::contentAttributesFromValidated($request->validated()),
        );

        return redirect()
            ->route('admin.about.index')
            ->with('success', 'About page content updated.');
    }

    public function storeJourneyStep(StoreAboutJourneyStepRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $request): void {
                $image = app(AboutJourneyImage::class)->store($request->file('image'));
                $nextSortOrder = ((int) AboutJourneyStep::query()->max('sort_order')) + 1;

                AboutJourneyStep::query()->create(array_merge(
                    AboutJourneyStepAttributes::fromValidated($validated),
                    [
                        'image_media' => $image->toArray(),
                        'sort_order' => $nextSortOrder,
                    ],
                ));
            });
        } catch (MediaValidationException $exception) {
            return back()
                ->withErrors(['image' => $exception->getMessage()])
                ->withInput();
        }

        return redirect()
            ->route('admin.about.index')
            ->with('success', 'Journey step created.');
    }

    public function updateJourneyStep(
        UpdateAboutJourneyStepRequest $request,
        AboutJourneyStep $aboutJourneyStep,
    ): RedirectResponse {
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $request, $aboutJourneyStep): void {
                $attributes = AboutJourneyStepAttributes::fromValidated($validated);

                if ($request->hasFile('image')) {
                    $existing = $aboutJourneyStep->imageAsset();
                    $image = app(AboutJourneyImage::class)->replace(
                        $request->file('image'),
                        $existing,
                    );
                    $attributes['image_media'] = $image->toArray();
                }

                $aboutJourneyStep->update($attributes);
            });
        } catch (MediaValidationException $exception) {
            return back()
                ->withErrors(['image' => $exception->getMessage()])
                ->withInput();
        }

        return redirect()
            ->route('admin.about.index')
            ->with('success', 'Journey step updated.');
    }

    public function destroyJourneyStep(AboutJourneyStep $aboutJourneyStep): RedirectResponse
    {
        DB::transaction(function () use ($aboutJourneyStep): void {
            $image = $aboutJourneyStep->imageAsset();

            if ($image !== null) {
                app(AboutJourneyImage::class)->delete($image);
            }

            $aboutJourneyStep->delete();
        });

        return redirect()
            ->route('admin.about.index')
            ->with('success', 'Journey step removed.');
    }
}
