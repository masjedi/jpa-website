<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomBookingRequest;
use App\Support\Booking\BookingPagePresenter;
use App\Support\Booking\SubmitCustomBookingAction;
use App\Support\Seo\SeoPresenter;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('public/Booking', [
            ...BookingPagePresenter::forPublicForm(),
            'seo' => SeoPresenter::page('booking', '/booking'),
        ]);
    }

    public function store(StoreCustomBookingRequest $request, SubmitCustomBookingAction $submit): RedirectResponse
    {
        $confirmation = $submit->handle($request->validated());

        return back()->with('customBookingSuccess', $confirmation->flashPayload());
    }
}
