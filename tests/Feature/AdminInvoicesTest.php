<?php

namespace Tests\Feature;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminInvoicesTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return list<array<string, mixed>>
     */
    private function sampleLineItems(): array
    {
        return [
            [
                'name' => 'Guiding fee',
                'rate' => '750.00',
                'days' => '2',
            ],
            [
                'name' => 'Transport planning',
                'rate' => '400.00',
                'days' => '1',
            ],
        ];
    }

    public function test_authenticated_admin_can_view_invoices_index(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/admin/invoices')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/Invoices'));
    }

    public function test_admin_can_create_invoice_with_line_items(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/admin/invoices', [
            'client_name' => 'Sarah Mitchell',
            'client_email' => 'sarah@example.com',
            'client_address' => 'Berlin, Germany',
            'tour_reference' => 'Bamiyan Heritage Journey',
            'issued_on' => '2026-08-24',
            'due_on' => '2026-09-07',
            'currency' => 'USD',
            'discount_percent' => '5',
            'amount' => '1805.00',
            'status' => InvoiceStatus::Draft->value,
            'line_items' => $this->sampleLineItems(),
            'notes' => 'Payment due before departure.',
        ]);

        $response
            ->assertRedirect(route('admin.invoices.index'))
            ->assertSessionHas('success');

        $invoice = Invoice::query()->first();

        $this->assertNotNull($invoice);
        $this->assertSame('Sarah Mitchell', $invoice->client_name);
        $this->assertStringStartsWith('INV-2026-', $invoice->number);
        $this->assertSame('1805.00', (string) $invoice->amount);
        $this->assertSame('5.00', (string) $invoice->discount_percent);
        $this->assertCount(2, $invoice->line_items);
        $this->assertSame('Guiding fee', $invoice->line_items[0]['name']);
        $this->assertSame(2.0, (float) $invoice->line_items[0]['days']);
    }

    public function test_admin_can_update_and_delete_invoice(): void
    {
        $user = User::factory()->create();

        $invoice = Invoice::query()->create([
            'number' => 'INV-2026-0001',
            'status' => InvoiceStatus::Draft,
            'client_name' => 'Daniel Weber',
            'client_email' => 'daniel@example.com',
            'issued_on' => '2026-08-01',
            'currency' => 'USD',
            'amount' => '1500.00',
            'discount_percent' => 0,
            'line_items' => [
                [
                    'name' => 'Initial service',
                    'rate' => '1500.00',
                    'days' => '1',
                ],
            ],
        ]);

        $this->actingAs($user)
            ->patch("/admin/invoices/{$invoice->id}", [
                'client_name' => 'Daniel Weber',
                'client_email' => 'daniel@example.com',
                'client_address' => '',
                'tour_reference' => 'Herat Art and Heritage',
                'issued_on' => '2026-08-01',
                'due_on' => '',
                'currency' => 'USD',
                'discount_percent' => '0',
                'amount' => '1200.00',
                'status' => InvoiceStatus::Sent->value,
                'line_items' => [
                    [
                        'name' => 'Updated services list',
                        'rate' => '400.00',
                        'days' => '3',
                    ],
                ],
                'notes' => '',
            ])
            ->assertRedirect(route('admin.invoices.index'));

        $invoice->refresh();

        $this->assertSame(InvoiceStatus::Sent, $invoice->status);
        $this->assertSame('1200.00', (string) $invoice->amount);
        $this->assertSame('Updated services list', $invoice->line_items[0]['name']);

        $this->actingAs($user)
            ->delete("/admin/invoices/{$invoice->id}")
            ->assertRedirect(route('admin.invoices.index'));

        $this->assertDatabaseMissing('invoices', ['id' => $invoice->id]);
    }

    public function test_line_items_are_required(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/invoices', [
                'client_name' => 'Sarah Mitchell',
                'client_email' => 'sarah@example.com',
                'issued_on' => '2026-08-24',
                'currency' => 'USD',
                'discount_percent' => '0',
                'amount' => '100.00',
                'status' => InvoiceStatus::Draft->value,
                'line_items' => [],
            ])
            ->assertSessionHasErrors('line_items');
    }

    public function test_amount_must_match_calculated_total(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/invoices', [
                'client_name' => 'Sarah Mitchell',
                'client_email' => 'sarah@example.com',
                'issued_on' => '2026-08-24',
                'currency' => 'USD',
                'discount_percent' => '0',
                'amount' => '999.00',
                'status' => InvoiceStatus::Draft->value,
                'line_items' => $this->sampleLineItems(),
            ])
            ->assertSessionHasErrors('amount');
    }
}
