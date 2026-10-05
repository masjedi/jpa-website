<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreFaqItemRequest;
use App\Http\Requests\Admin\UpdateFaqItemRequest;
use App\Models\FaqItem;
use App\Support\Faq\FaqItemAttributes;
use App\Support\Faq\FaqItemPresenter;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/Faq', FaqItemPresenter::forAdminIndex());
    }

    public function store(StoreFaqItemRequest $request): RedirectResponse
    {
        $nextSortOrder = ((int) FaqItem::query()->max('sort_order')) + 1;

        FaqItem::query()->create(array_merge(
            FaqItemAttributes::fromValidated($request->validated()),
            ['sort_order' => $nextSortOrder],
        ));

        return redirect()
            ->route('admin.faq.index')
            ->with('success', 'FAQ created.');
    }

    public function update(UpdateFaqItemRequest $request, FaqItem $faqItem): RedirectResponse
    {
        $faqItem->update(FaqItemAttributes::fromValidated($request->validated()));

        return redirect()
            ->route('admin.faq.index')
            ->with('success', 'FAQ updated.');
    }

    public function destroy(FaqItem $faqItem): RedirectResponse
    {
        $faqItem->delete();

        return redirect()
            ->route('admin.faq.index')
            ->with('success', 'FAQ removed.');
    }
}
