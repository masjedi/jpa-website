<?php

namespace Tests\Feature\Admin;

use App\Enums\EmergencyContactVerificationAge;
use App\Enums\EmergencyType;
use App\Models\EmergencyContact;
use App\Models\Province;
use App\Models\User;
use App\Support\EmergencyContacts\EmergencyContactOptions;
use App\Support\EmergencyContacts\EmergencyContactPresenter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmergencyContactsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_manage_emergency_contacts(): void
    {
        $contact = EmergencyContact::factory()->create();

        $this->get('/admin/emergency-contacts')->assertRedirect(route('admin.login'));
        $this->post('/admin/emergency-contacts', $this->payload(Province::factory()->create()))
            ->assertRedirect(route('admin.login'));
        $this->patch("/admin/emergency-contacts/{$contact->id}", $this->payload($contact->province))
            ->assertRedirect(route('admin.login'));
        $this->patch("/admin/emergency-contacts/{$contact->id}/deactivate")
            ->assertRedirect(route('admin.login'));
    }

    public function test_authenticated_admin_can_view_paginated_index(): void
    {
        $user = User::factory()->create();
        $province = Province::factory()->create(['name' => 'Kabul']);
        EmergencyContact::factory()
            ->count(16)
            ->recycle([$user, $province])
            ->create();

        $this->actingAs($user)
            ->get('/admin/emergency-contacts')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/EmergencyContacts')
                ->has('contacts.data', 15)
                ->has('provinces')
                ->has('emergencyTypes')
                ->missing('contacts.data.0.createdBy')
                ->missing('contacts.data.0.updatedBy')
                ->missing('contacts.data.0.verifiedBy'));
    }

    public function test_admin_can_create_an_emergency_contact_with_server_controlled_audit_fields(): void
    {
        $user = User::factory()->create();
        $province = Province::factory()->create(['name' => 'Herat']);

        $this->actingAs($user)
            ->post('/admin/emergency-contacts', $this->payload($province, [
                'created_by' => 999,
                'updated_by' => 999,
                'verified_by' => 888,
                'is_active' => '0',
            ]))
            ->assertSessionHasErrors(['created_by', 'updated_by', 'verified_by', 'is_active']);

        $this->actingAs($user)
            ->post('/admin/emergency-contacts', $this->payload($province, [
                'internal_notes' => 'Do not share this number with customers.',
            ]))
            ->assertRedirect(route('admin.emergency-contacts.index'))
            ->assertSessionHas('success');

        $contact = EmergencyContact::query()->first();

        $this->assertNotNull($contact);
        $this->assertSame('Ahmad Karimi', $contact->full_name);
        $this->assertSame($province->id, $contact->province_id);
        $this->assertSame(EmergencyType::TourismInformation, $contact->emergency_type);
        $this->assertTrue($contact->is_active);
        $this->assertTrue($contact->is_customer_shareable);
        $this->assertSame($user->id, $contact->created_by);
        $this->assertSame($user->id, $contact->updated_by);
        $this->assertSame($user->id, $contact->verified_by);
        $this->assertSame('Do not share this number with customers.', $contact->internal_notes);
    }

    public function test_create_requires_valid_fields(): void
    {
        $user = User::factory()->create();
        $province = Province::factory()->create();

        $this->actingAs($user)
            ->post('/admin/emergency-contacts', $this->payload($province, [
                'full_name' => '',
                'position' => '',
                'organization' => '',
                'primary_phone' => '0700000000',
                'last_verified_at' => now()->addDay()->toDateString(),
            ]))
            ->assertSessionHasErrors(['full_name', 'position', 'organization', 'primary_phone', 'last_verified_at']);
    }

    public function test_create_rejects_invalid_province_and_emergency_type(): void
    {
        $user = User::factory()->create();
        $province = Province::factory()->create();

        $this->actingAs($user)
            ->post('/admin/emergency-contacts', $this->payload($province, [
                'province_id' => 999999,
            ]))
            ->assertSessionHasErrors('province_id');

        $this->actingAs($user)
            ->post('/admin/emergency-contacts', $this->payload($province, [
                'emergency_type' => 'not-a-type',
            ]))
            ->assertSessionHasErrors('emergency_type');
    }

    public function test_admin_can_update_an_emergency_contact_and_restamp_verifier(): void
    {
        $creator = User::factory()->create();
        $editor = User::factory()->create();
        $province = Province::factory()->create(['name' => 'Balkh']);
        $contact = EmergencyContact::factory()->recycle($creator)->create([
            'province_id' => $province->id,
            'full_name' => 'Original Name',
            'is_customer_shareable' => false,
        ]);

        $this->actingAs($editor)
            ->patch("/admin/emergency-contacts/{$contact->id}", $this->payload($province, [
                'full_name' => 'Updated Liaison',
                'emergency_type' => EmergencyType::HospitalMedical->value,
                'is_customer_shareable' => '0',
                'verified_by' => $creator->id,
            ]))
            ->assertSessionHasErrors('verified_by');

        $this->actingAs($editor)
            ->patch("/admin/emergency-contacts/{$contact->id}", $this->payload($province, [
                'full_name' => 'Updated Liaison',
                'emergency_type' => EmergencyType::HospitalMedical->value,
                'is_customer_shareable' => '0',
            ]))
            ->assertRedirect(route('admin.emergency-contacts.index'));

        $contact->refresh();

        $this->assertSame('Updated Liaison', $contact->full_name);
        $this->assertSame(EmergencyType::HospitalMedical, $contact->emergency_type);
        $this->assertFalse($contact->is_customer_shareable);
        $this->assertSame($creator->id, $contact->created_by);
        $this->assertSame($editor->id, $contact->updated_by);
        $this->assertSame($editor->id, $contact->verified_by);
    }

    public function test_admin_can_deactivate_instead_of_deleting(): void
    {
        $user = User::factory()->create();
        $contact = EmergencyContact::factory()->recycle($user)->shareable()->create();

        $this->actingAs($user)
            ->patch("/admin/emergency-contacts/{$contact->id}/deactivate")
            ->assertRedirect(route('admin.emergency-contacts.index'))
            ->assertSessionHas('success');

        $contact->refresh();

        $this->assertModelExists($contact);
        $this->assertFalse($contact->is_active);
        $this->assertSame($user->id, $contact->updated_by);
    }

    public function test_index_filters_by_search_shareable_status_and_type(): void
    {
        $user = User::factory()->create();
        $kabul = Province::factory()->create(['name' => 'Kabul']);
        $herat = Province::factory()->create(['name' => 'Herat']);

        EmergencyContact::factory()->recycle([$user, $kabul])->shareable()->create([
            'full_name' => 'Kabul Police Desk',
            'organization' => 'Provincial Police HQ',
            'emergency_type' => EmergencyType::PoliceSecurity,
        ]);
        EmergencyContact::factory()->recycle([$user, $herat])->inactive()->create([
            'full_name' => 'Herat Hospital',
            'organization' => 'Regional Hospital',
            'emergency_type' => EmergencyType::HospitalMedical,
            'is_customer_shareable' => true,
        ]);

        $this->actingAs($user)
            ->get('/admin/emergency-contacts?search=Police')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('contacts.data', 1)
                ->where('contacts.data.0.fullName', 'Kabul Police Desk'));

        $this->actingAs($user)
            ->get('/admin/emergency-contacts?shareable=yes&status=active')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('contacts.data', 1)
                ->where('contacts.data.0.fullName', 'Kabul Police Desk')
                ->where('contacts.data.0.isEligibleForCustomerSharing', true));

        $this->actingAs($user)
            ->get('/admin/emergency-contacts?emergency_type='.EmergencyType::HospitalMedical->value)
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('contacts.data', 1)
                ->where('contacts.data.0.fullName', 'Herat Hospital')
                ->where('contacts.data.0.isEligibleForCustomerSharing', false));
    }

    public function test_stale_verification_age_is_exposed_on_the_list(): void
    {
        $user = User::factory()->create();
        EmergencyContact::factory()->recycle($user)->stale()->create([
            'full_name' => 'Overdue contact',
        ]);

        $this->actingAs($user)
            ->get('/admin/emergency-contacts')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('contacts.data.0.verificationAge', EmergencyContactVerificationAge::Stale->value)
                ->where('contacts.data.0.verificationAgeLabel', EmergencyContactVerificationAge::Stale->frontendLabel()));
    }

    public function test_customer_directory_excludes_inactive_and_internal_fields(): void
    {
        $user = User::factory()->create();
        $province = Province::factory()->create(['name' => 'Kabul']);

        EmergencyContact::factory()->recycle([$user, $province])->shareable()->create([
            'full_name' => 'Shareable desk',
            'internal_notes' => 'Never show this.',
            'availability_notes' => '24-hour desk',
        ]);
        EmergencyContact::factory()->recycle([$user, $province])->shareable()->inactive()->create([
            'full_name' => 'Inactive shareable flag',
            'internal_notes' => 'Internal only',
        ]);
        EmergencyContact::factory()->recycle([$user, $province])->create([
            'full_name' => 'Active internal only',
            'is_customer_shareable' => false,
        ]);

        $this->assertSame(1, EmergencyContact::query()->shareableWithCustomers()->count());

        $directory = EmergencyContactPresenter::forCustomerDirectory($province->id);

        $this->assertCount(1, $directory);
        $this->assertSame('Shareable desk', $directory[0]['fullName']);
        $this->assertSame('24-hour desk', $directory[0]['availabilityNotes']);
        $this->assertArrayNotHasKey('internalNotes', $directory[0]);
        $this->assertArrayNotHasKey('internal_notes', $directory[0]);
        $this->assertArrayNotHasKey('verifiedBy', $directory[0]);
        $this->assertArrayNotHasKey('createdBy', $directory[0]);
    }

    public function test_public_pages_do_not_expose_emergency_contacts(): void
    {
        EmergencyContact::factory()->shareable()->create([
            'internal_notes' => 'Staff only',
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Home')
                ->missing('emergencyContacts')
                ->missing('contacts'));
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(Province $province, array $overrides = []): array
    {
        return array_merge([
            'province_id' => $province->id,
            'full_name' => 'Ahmad Karimi',
            'position' => 'Provincial tourism liaison',
            'organization' => 'Department of Information and Culture',
            'emergency_type' => EmergencyType::TourismInformation->value,
            'primary_phone' => '+93 70 123 4567',
            'secondary_phone' => '',
            'whatsapp' => '',
            'availability_notes' => '',
            'last_verified_at' => now()->toDateString(),
            'status' => EmergencyContactOptions::STATUS_ACTIVE,
            'is_customer_shareable' => '1',
            'internal_notes' => '',
        ], $overrides);
    }
}
