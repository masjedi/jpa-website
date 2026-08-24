<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscription;
use App\Support\Newsletter\NewsletterSubscriptionPresenter;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/Subscriptions', NewsletterSubscriptionPresenter::forAdminIndex());
    }

    public function destroy(NewsletterSubscription $newsletterSubscription): RedirectResponse
    {
        $newsletterSubscription->delete();

        return redirect()
            ->route('admin.subscriptions.index')
            ->with('success', 'Subscriber removed.');
    }
}
