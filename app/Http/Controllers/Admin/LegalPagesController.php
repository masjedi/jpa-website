<?php

namespace App\Http\Controllers\Admin;

use App\Enums\LegalPageKey;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateLegalPageRequest;
use App\Models\LegalPage;
use App\Support\Legal\LegalPagePresenter;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LegalPagesController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/LegalPages', [
            'pages' => LegalPagePresenter::forAdminIndex(),
        ]);
    }

    public function edit(string $key): Response
    {
        $pageKey = LegalPageKey::tryFrom($key) ?? abort(404);

        return Inertia::render('admin/LegalPageEdit', [
            ...LegalPagePresenter::forAdminEdit($pageKey),
        ]);
    }

    public function update(UpdateLegalPageRequest $request, string $key): RedirectResponse
    {
        $pageKey = LegalPageKey::tryFrom($key) ?? abort(404);
        $page = LegalPage::forKey($pageKey);

        $page->update(LegalPagePresenter::attributesFromValidated($request->validated()));

        return redirect()
            ->route('admin.legal-pages.edit', $pageKey->value)
            ->with('success', $pageKey->label().' updated.');
    }
}
