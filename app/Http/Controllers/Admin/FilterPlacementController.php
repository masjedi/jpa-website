<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTourFilterOptionRequest;
use App\Http\Requests\Admin\UpdateTourFilterOptionRequest;
use App\Models\TourFilterOption;
use App\Support\Tours\TourFilterOptionAttributes;
use App\Support\Tours\TourFilterOptionPresenter;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FilterPlacementController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/FilterPlacement', TourFilterOptionPresenter::forAdminIndex());
    }

    public function store(StoreTourFilterOptionRequest $request): RedirectResponse
    {
        $attributes = TourFilterOptionAttributes::fromValidated($request->validated());
        $nextSortOrder = ((int) TourFilterOption::query()
            ->ofType($attributes['type'])
            ->max('sort_order')) + 1;

        TourFilterOption::query()->create(array_merge($attributes, [
            'sort_order' => $nextSortOrder,
        ]));

        return redirect()
            ->route($attributes['type']->adminIndexRouteName())
            ->with('success', $this->savedMessage($attributes['type']->label(), created: true));
    }

    public function update(UpdateTourFilterOptionRequest $request, TourFilterOption $tourFilterOption): RedirectResponse
    {
        $attributes = TourFilterOptionAttributes::fromValidated($request->validated());
        $attributes['type'] = $tourFilterOption->type;

        $previousName = (string) $tourFilterOption->name;

        $tourFilterOption->update($attributes);

        TourFilterOptionAttributes::syncRenamedValue(
            $tourFilterOption->type,
            $previousName,
            (string) $tourFilterOption->name,
        );

        return redirect()
            ->route($tourFilterOption->type->adminIndexRouteName())
            ->with('success', $this->savedMessage($tourFilterOption->type->label(), created: false));
    }

    public function destroy(TourFilterOption $tourFilterOption): RedirectResponse
    {
        if ($tourFilterOption->isUsedByTours()) {
            return redirect()
                ->route($tourFilterOption->type->adminIndexRouteName())
                ->with('error', "{$tourFilterOption->name} is used by existing tours. Reassign those listings before removing it.");
        }

        $label = $tourFilterOption->type->label();
        $indexRoute = $tourFilterOption->type->adminIndexRouteName();
        $tourFilterOption->delete();

        return redirect()
            ->route($indexRoute)
            ->with('success', "{$label} option removed.");
    }

    private function savedMessage(string $label, bool $created): string
    {
        return $created
            ? "{$label} option created."
            : "{$label} option updated.";
    }
}
