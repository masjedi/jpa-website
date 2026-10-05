<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DeactivateEmergencyContactRequest;
use App\Http\Requests\Admin\EmergencyContactIndexRequest;
use App\Http\Requests\Admin\StoreEmergencyContactRequest;
use App\Http\Requests\Admin\UpdateEmergencyContactRequest;
use App\Models\EmergencyContact;
use App\Support\EmergencyContacts\EmergencyContactAttributes;
use App\Support\EmergencyContacts\EmergencyContactPresenter;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EmergencyContactsController extends Controller
{
    public function index(EmergencyContactIndexRequest $request): Response
    {
        return Inertia::render('admin/EmergencyContacts', EmergencyContactPresenter::forAdminIndex($request));
    }

    public function store(StoreEmergencyContactRequest $request): RedirectResponse
    {
        $userId = (int) $request->user()->id;

        EmergencyContact::query()->create(array_merge(
            EmergencyContactAttributes::fromValidated($request->validated()),
            [
                'created_by' => $userId,
                'updated_by' => $userId,
                'verified_by' => $userId,
            ],
        ));

        return redirect()
            ->route('admin.emergency-contacts.index')
            ->with('success', 'Emergency contact created.');
    }

    public function update(UpdateEmergencyContactRequest $request, EmergencyContact $emergencyContact): RedirectResponse
    {
        $userId = (int) $request->user()->id;

        $emergencyContact->update(array_merge(
            EmergencyContactAttributes::fromValidated($request->validated()),
            [
                'updated_by' => $userId,
                'verified_by' => $userId,
            ],
        ));

        return redirect()
            ->route('admin.emergency-contacts.index')
            ->with('success', 'Emergency contact updated.');
    }

    public function deactivate(DeactivateEmergencyContactRequest $request, EmergencyContact $emergencyContact): RedirectResponse
    {
        $emergencyContact->update([
            'is_active' => false,
            'updated_by' => (int) $request->user()->id,
        ]);

        return redirect()
            ->route('admin.emergency-contacts.index')
            ->with('success', 'Emergency contact deactivated.');
    }
}
