<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreInvoiceRequest;
use App\Http\Requests\Admin\UpdateInvoiceRequest;
use App\Models\Invoice;
use App\Support\Invoices\InvoicePresenter;
use App\Support\Invoices\InvoiceVerification;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InvoicesController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/Invoices', InvoicePresenter::forAdminIndex());
    }

    public function store(StoreInvoiceRequest $request): RedirectResponse
    {
        $invoice = Invoice::query()->create(array_merge(
            InvoicePresenter::attributesFromValidated($request->validated()),
            InvoiceVerification::credentialsForIssueDate($request->validated()['issued_on']),
            ['number' => Invoice::nextNumber()],
        ));

        InvoiceVerification::ensureCredentials($invoice);

        return redirect()
            ->route('admin.invoices.index')
            ->with('success', 'Invoice created.');
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice): RedirectResponse
    {
        $invoice->update(InvoicePresenter::attributesFromValidated($request->validated()));

        InvoiceVerification::syncExpiryFromIssueDate($invoice->refresh());
        InvoiceVerification::ensureCredentials($invoice);

        return redirect()
            ->route('admin.invoices.index')
            ->with('success', 'Invoice updated.');
    }

    public function destroy(Invoice $invoice): RedirectResponse
    {
        $invoice->delete();

        return redirect()
            ->route('admin.invoices.index')
            ->with('success', 'Invoice removed.');
    }
}
