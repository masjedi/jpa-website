<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTestimonialRequest;
use App\Http\Requests\Admin\UpdateTestimonialRequest;
use App\Models\Testimonial;
use App\Support\Testimonials\TestimonialAttributes;
use App\Support\Testimonials\TestimonialPresenter;
use Illuminate\Http\RedirectResponse;
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
        $nextSortOrder = ((int) Testimonial::query()->max('sort_order')) + 1;

        Testimonial::query()->create(array_merge(
            TestimonialAttributes::fromValidated($request->validated()),
            ['sort_order' => $nextSortOrder],
        ));

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', 'Testimonial created.');
    }

    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update(TestimonialAttributes::fromValidated($request->validated()));

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', 'Testimonial updated.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', 'Testimonial removed.');
    }
}
