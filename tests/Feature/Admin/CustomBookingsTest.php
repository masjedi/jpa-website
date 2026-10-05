<?php

namespace Tests\Feature\Admin;

use App\Enums\CustomBookingStatus;
use App\Models\CustomBooking;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomBookingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_view_bookings(): void
    {
        $booking = CustomBooking::factory()->create();

        $this->get('/admin/bookings')->assertRedirect(route('admin.login'));
        $this->get('/admin/bookings/'.$booking->id)->assertRedirect(route('admin.login'));
        $this->patch('/admin/bookings/'.$booking->id.'/status', [
            'status' => CustomBookingStatus::UnderReview->value,
        ])->assertRedirect(route('admin.login'));
    }

    public function test_admin_can_list_bookings(): void
    {
        $user = User::factory()->create();
        CustomBooking::factory()->create([
            'full_name' => 'Sara Ahmad',
            'email' => 'sara@example.com',
        ]);

        $this->actingAs($user)
            ->get('/admin/bookings')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/Bookings')
                ->has('bookings.data', 1)
                ->where('bookings.data.0.fullName', 'Sara Ahmad')
                ->where('bookings.data.0.email', 'sara@example.com')
                ->where('bookings.data.0.reference', fn ($value) => str_starts_with((string) $value, 'JTP-'))
                ->missing('bookings.data.0.passportNumber'));
    }

    public function test_admin_can_view_booking_details(): void
    {
        $user = User::factory()->create();
        $booking = CustomBooking::factory()->create([
            'other_requests' => 'Need a slower pace.',
        ]);

        $this->actingAs($user)
            ->get('/admin/bookings/'.$booking->id)
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/BookingDetail')
                ->where('booking.reference', $booking->reference)
                ->where('booking.email', 'sara@example.com')
                ->where('booking.otherRequests', 'Need a slower pace.')
                ->where('booking.passportNumber', 'C01X2Y3Z4'));
    }

    public function test_admin_can_fetch_a_booking_record_as_json_for_printing(): void
    {
        $user = User::factory()->create();
        $booking = CustomBooking::factory()->create();

        $this->actingAs($user)
            ->getJson('/admin/bookings/'.$booking->id)
            ->assertOk()
            ->assertJsonPath('booking.reference', $booking->reference)
            ->assertJsonPath('booking.email', 'sara@example.com')
            ->assertJsonPath('booking.fullName', 'Sara Ahmad');
    }

    public function test_admin_can_advance_status_but_not_skip_ahead(): void
    {
        $user = User::factory()->create();
        $booking = CustomBooking::factory()->create([
            'status' => CustomBookingStatus::Submitted,
        ]);

        $this->actingAs($user)
            ->from('/admin/bookings/'.$booking->id)
            ->patch('/admin/bookings/'.$booking->id.'/status', [
                'status' => CustomBookingStatus::Confirmed->value,
            ])
            ->assertRedirect('/admin/bookings/'.$booking->id)
            ->assertSessionHasErrors('status');

        $this->assertSame(CustomBookingStatus::Submitted, $booking->fresh()->status);

        $this->actingAs($user)
            ->patch('/admin/bookings/'.$booking->id.'/status', [
                'status' => CustomBookingStatus::UnderReview->value,
            ])
            ->assertRedirect('/admin/bookings/'.$booking->id)
            ->assertSessionHas('success');

        $this->assertSame(CustomBookingStatus::UnderReview, $booking->fresh()->status);
    }

    public function test_admin_can_delete_a_booking(): void
    {
        $user = User::factory()->create();
        $booking = CustomBooking::factory()->create();

        $this->actingAs($user)
            ->delete('/admin/bookings/'.$booking->id)
            ->assertRedirect('/admin/bookings')
            ->assertSessionHas('success');

        $this->assertDatabaseCount('custom_bookings', 0);
    }
}
