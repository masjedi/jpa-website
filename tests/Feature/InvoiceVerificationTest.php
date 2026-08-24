<?php

namespace Tests\Feature;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;
use App\Support\Invoices\InvoiceVerification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class InvoiceVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_invoice_receives_verification_credentials_on_create(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/admin/invoices', [
            'client_name' => 'Sarah Mitchell',
            'client_email' => 'sarah@example.com',
            'issued_on' => '2026-08-24',
            'currency' => 'USD',
            'discount_percent' => '0',
            'amount' => '750.00',
            'status' => InvoiceStatus::Draft->value,
            'line_items' => [
                [
                    'name' => 'Guiding fee',
                    'rate' => '750.00',
                    'days' => '1',
                ],
            ],
        ])->assertRedirect(route('admin.invoices.index'));

        $invoice = Invoice::query()->first();

        $this->assertNotNull($invoice);
        $this->assertNotEmpty($invoice->verification_token);
        $this->assertSame(
            '2026-09-23 23:59:59',
            $invoice->verification_expires_at?->format('Y-m-d H:i:s'),
        );
    }

    public function test_active_verification_link_shows_confirmation_page(): void
    {
        Carbon::setTestNow('2026-08-24 12:00:00');

        $invoice = Invoice::query()->create([
            'number' => 'INV-2026-0099',
            'status' => InvoiceStatus::Paid,
            'client_name' => 'Kristen Haney',
            'client_email' => 'client@example.com',
            'issued_on' => '2026-08-24',
            'currency' => 'USD',
            'amount' => '240.00',
            'discount_percent' => 0,
            'line_items' => [
                ['name' => 'Guiding', 'rate' => 80, 'days' => 1],
            ],
            ...InvoiceVerification::credentialsForIssueDate('2026-08-24'),
        ]);

        $this->get(route('invoices.verify', ['token' => $invoice->verification_token]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/InvoiceVerify')
                ->where('state', 'confirmed')
                ->where('invoiceNumber', 'INV-2026-0099')
                ->where('clientName', 'Kristen Haney'));
    }

    public function test_expired_verification_link_shows_expired_state(): void
    {
        Carbon::setTestNow('2026-10-01 12:00:00');

        $invoice = Invoice::query()->create([
            'number' => 'INV-2026-0100',
            'status' => InvoiceStatus::Paid,
            'client_name' => 'Kristen Haney',
            'client_email' => 'client@example.com',
            'issued_on' => '2026-08-24',
            'currency' => 'USD',
            'amount' => '240.00',
            'discount_percent' => 0,
            'line_items' => [
                ['name' => 'Guiding', 'rate' => 80, 'days' => 1],
            ],
            ...InvoiceVerification::credentialsForIssueDate('2026-08-24'),
        ]);

        $this->get(route('invoices.verify', ['token' => $invoice->verification_token]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/InvoiceVerify')
                ->where('state', 'expired'));
    }

    public function test_unknown_verification_token_returns_not_found(): void
    {
        $this->get(route('invoices.verify', ['token' => 'invalid-token']))
            ->assertNotFound();
    }

    public function test_admin_invoice_payload_includes_verification_url(): void
    {
        $user = User::factory()->create();

        $invoice = Invoice::query()->create([
            'number' => 'INV-2026-0101',
            'status' => InvoiceStatus::Sent,
            'client_name' => 'Daniel Weber',
            'client_email' => 'daniel@example.com',
            'issued_on' => '2026-08-24',
            'currency' => 'USD',
            'amount' => '400.00',
            'discount_percent' => 0,
            'line_items' => [
                ['name' => 'Vehicle', 'rate' => 400, 'days' => 1],
            ],
            ...InvoiceVerification::credentialsForIssueDate('2026-08-24'),
        ]);

        $this->actingAs($user)
            ->get('/admin/invoices')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/Invoices')
                ->has('invoices', 1)
                ->where('invoices.0.id', $invoice->id)
                ->where('invoices.0.verificationActive', true)
                ->where('invoices.0.verificationUrl', route('invoices.verify', [
                    'token' => $invoice->verification_token,
                ], absolute: true)));
    }
}
