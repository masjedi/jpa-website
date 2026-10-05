<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Support\Invoices\InvoiceVerification;
use App\Support\Invoices\InvoiceVerificationPresenter;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceVerificationController extends Controller
{
    public function show(string $token): Response
    {
        $invoice = Invoice::query()
            ->where('verification_token', $token)
            ->firstOrFail();

        InvoiceVerification::ensureCredentials($invoice);

        return Inertia::render('public/InvoiceVerify', InvoiceVerificationPresenter::forPublicPage($invoice));
    }
}
