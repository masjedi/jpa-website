<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomBookingRequest;
use App\Support\Booking\SubmitCustomBookingAction;
use Illuminate\Http\RedirectResponse;

class BookingController extends Controller
{
    public function store(StoreCustomBookingRequest $request, SubmitCustomBookingAction $submit): RedirectResponse
    {
        $confirmation = $submit->handle($request->validated());

        return back()->with('customBookingSuccess', $confirmation->flashPayload());
    }
}
