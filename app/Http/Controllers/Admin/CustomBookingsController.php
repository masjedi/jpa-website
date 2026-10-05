<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CustomBookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateCustomBookingRequest;
use App\Http\Requests\Admin\UpdateCustomBookingStatusRequest;
use App\Models\CustomBooking;
use App\Support\Booking\CustomBookingPresenter;
use App\Support\Booking\UpdateCustomBookingStatusAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomBookingsController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('admin/Bookings', CustomBookingPresenter::forAdminIndex($request));
    }

    public function show(Request $request, CustomBooking $customBooking): Response|JsonResponse
    {
        $payload = CustomBookingPresenter::forAdminShow($customBooking);

        if ($request->expectsJson() && $request->header('X-Inertia') === null) {
            return response()->json($payload);
        }

        return Inertia::render('admin/BookingDetail', $payload);
    }

    public function update(
        UpdateCustomBookingRequest $request,
        CustomBooking $customBooking,
    ): RedirectResponse {
        $validated = $request->validated();
        $status = $validated['status'] ?? null;
        unset($validated['status']);

        $customBooking->update([
            ...$validated,
            'tourist_genders' => array_values(array_unique($validated['tourist_genders'])),
            'other_requests' => filled($validated['other_requests'] ?? null)
                ? trim((string) $validated['other_requests'])
                : null,
        ]);

        if (is_string($status) && $status !== '') {
            $customBooking->update([
                'status' => CustomBookingStatus::from($status),
            ]);
        }

        return redirect()
            ->route('admin.bookings.show', $customBooking)
            ->with('success', 'Tour request updated.');
    }

    public function updateStatus(
        UpdateCustomBookingStatusRequest $request,
        CustomBooking $customBooking,
        UpdateCustomBookingStatusAction $updateStatus,
    ): RedirectResponse {
        $status = CustomBookingStatus::from($request->validated('status'));
        $updateStatus->handle($customBooking, $status, $request->user());

        return redirect()
            ->route('admin.bookings.show', $customBooking)
            ->with('success', 'Request status updated.');
    }

    public function destroy(CustomBooking $customBooking): RedirectResponse
    {
        $customBooking->delete();

        return redirect()
            ->route('admin.bookings.index')
            ->with('success', 'Tour request deleted.');
    }
}
