<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTestimonialRequest;
use App\Http\Requests\Admin\UpdateTestimonialRequest;
use App\Models\Testimonial;
use App\Support\Media\MediaValidationException;
use App\Support\Media\TestimonialAvatarImage;
use App\Support\Testimonials\TestimonialAttributes;
use App\Support\Testimonials\TestimonialPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/Testimonials', TestimonialPresenter::forAdminIndex());
    }

    public function store(StoreTestimonialRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $request): void {
                $avatar = app(TestimonialAvatarImage::class)->store($request->file('avatar_image'));
                $nextSortOrder = ((int) Testimonial::query()->max('sort_order')) + 1;

                Testimonial::query()->create(array_merge(
                    TestimonialAttributes::fromValidated($validated),
                    [
                        'avatar_media' => $avatar->toArray(),
                        'sort_order' => $nextSortOrder,
                    ],
                ));
            });
        } catch (MediaValidationException $exception) {
            return back()
                ->withErrors(['avatar_image' => $exception->getMessage()])
                ->withInput();
        }

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', 'Testimonial created.');
    }

    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $request, $testimonial): void {
                $attributes = TestimonialAttributes::fromValidated($validated);

                if ($request->hasFile('avatar_image')) {
                    $existing = $testimonial->avatarAsset();
                    $avatar = app(TestimonialAvatarImage::class)->replace(
                        $request->file('avatar_image'),
                        $existing,
                    );
                    $attributes['avatar_media'] = $avatar->toArray();
                }

                $testimonial->update($attributes);
            });
        } catch (MediaValidationException $exception) {
            return back()
                ->withErrors(['avatar_image' => $exception->getMessage()])
                ->withInput();
        }

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', 'Testimonial updated.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        DB::transaction(function () use ($testimonial): void {
            $avatar = $testimonial->avatarAsset();

            if ($avatar !== null) {
                app(TestimonialAvatarImage::class)->delete($avatar);
            }

            $testimonial->delete();
        });

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', 'Testimonial removed.');
    }
}
