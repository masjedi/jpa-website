<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceOfferingRequest;
use App\Http\Requests\Admin\UpdateServiceOfferingRequest;
use App\Models\ServiceOffering;
use App\Support\Services\ServiceOfferingAttributes;
use App\Support\Services\ServiceOfferingPresenter;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServicesController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/Services', ServiceOfferingPresenter::forAdminIndex());
    }

    public function store(StoreServiceOfferingRequest $request): RedirectResponse
    {
        $nextSortOrder = ((int) ServiceOffering::query()->max('sort_order')) + 1;

        ServiceOffering::query()->create(array_merge(
            ServiceOfferingAttributes::fromValidated($request->validated()),
            ['sort_order' => $nextSortOrder],
        ));

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service created.');
    }

    public function update(UpdateServiceOfferingRequest $request, ServiceOffering $serviceOffering): RedirectResponse
    {
        $serviceOffering->update(ServiceOfferingAttributes::fromValidated($request->validated()));

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service updated.');
    }

    public function destroy(ServiceOffering $serviceOffering): RedirectResponse
    {
        $serviceOffering->delete();

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service removed.');
    }
}
