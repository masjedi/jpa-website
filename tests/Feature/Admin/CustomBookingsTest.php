<?php

namespace Tests\Feature\Admin;

use App\Enums\CustomBookingStatus;
use App\Models\CustomBooking;
use App\Models\CustomBookingAttachment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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
        $this->post('/admin/bookings/'.$booking->id.'/attachments')->assertRedirect(route('admin.login'));
    }

    public function test_admin_can_list_bookings_without_sensitive_fields(): void
    {
        $user = User::factory()->create();
        CustomBooking::factory()->create([
            'medical_details' => 'Requires wheelchair access on long drives.',
            'emergency_phone' => '+49 177 9999999',
        ]);

        $this->actingAs($user)
            ->get('/admin/bookings')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/Bookings')
                ->has('bookings.data', 1)
                ->has('attachmentUpload.hint')
                ->where('bookings.data.0.reference', fn ($value) => str_starts_with((string) $value, 'JTP-'))
                ->missing('bookings.data.0.medicalDetails')
                ->missing('bookings.data.0.emergencyPhone')
                ->missing('bookings.data.0.arrivalFlight'));
    }

    public function test_admin_can_view_booking_details(): void
    {
        $user = User::factory()->create();
        $booking = CustomBooking::factory()->create([
            'medical_details' => 'Requires wheelchair access on long drives.',
        ]);

        $this->actingAs($user)
            ->get('/admin/bookings/'.$booking->id)
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/BookingDetail')
                ->where('booking.reference', $booking->reference)
                ->where('booking.medicalDetails', 'Requires wheelchair access on long drives.')
                ->where('booking.email', 'sara@example.com')
                ->has('booking.attachments', 0)
                ->has('attachmentUpload.hint')
                ->missing('booking.attachments.0.media'));
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
        $this->assertDatabaseHas('custom_booking_status_changes', [
            'custom_booking_id' => $booking->id,
            'to_status' => CustomBookingStatus::UnderReview->value,
            'user_id' => $user->id,
        ]);
    }

    public function test_admin_can_attach_download_and_remove_booking_files(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();
        $booking = CustomBooking::factory()->create();

        $this->actingAs($user)
            ->post('/admin/bookings/'.$booking->id.'/attachments', [
                'attachments' => [
                    $this->makePdfUpload('passport-scan.pdf'),
                    $this->makePdfUpload('itinerary.pdf'),
                ],
            ])
            ->assertRedirect(route('admin.bookings.show', $booking))
            ->assertSessionHas('success');

        $this->assertSame(2, $booking->attachments()->count());

        $attachment = $booking->attachments()->orderBy('id')->firstOrFail();

        $this->assertSame('passport-scan.pdf', $attachment->original_name);
        $this->assertSame($user->id, $attachment->uploaded_by);
        $this->assertNotNull($attachment->mediaAsset()?->path('default'));
        Storage::disk('local')->assertExists((string) $attachment->mediaAsset()?->path('default'));

        $this->actingAs($user)
            ->get('/admin/bookings/'.$booking->id)
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('booking.attachments', 2)
                ->where('booking.attachments.0.name', 'passport-scan.pdf')
                ->missing('booking.attachments.0.media')
                ->missing('booking.attachments.0.directory'));

        $this->actingAs($user)
            ->get('/admin/bookings/'.$booking->id.'/attachments/'.$attachment->id.'/download')
            ->assertOk()
            ->assertHeader('content-disposition');

        $path = (string) $attachment->mediaAsset()?->path('default');

        $this->actingAs($user)
            ->delete('/admin/bookings/'.$booking->id.'/attachments/'.$attachment->id)
            ->assertRedirect(route('admin.bookings.show', $booking));

        $this->assertModelMissing($attachment);
        Storage::disk('local')->assertMissing($path);
        $this->assertSame(1, $booking->attachments()->count());
    }

    public function test_admin_cannot_attach_an_invalid_file_type(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();
        $booking = CustomBooking::factory()->create();

        $this->actingAs($user)
            ->from('/admin/bookings/'.$booking->id)
            ->post('/admin/bookings/'.$booking->id.'/attachments', [
                'attachments' => [
                    UploadedFile::fake()->create('notes.txt', 20, 'text/plain'),
                ],
            ])
            ->assertRedirect('/admin/bookings/'.$booking->id)
            ->assertSessionHasErrors('attachments.0');

        $this->assertSame(0, $booking->attachments()->count());
    }

    public function test_admin_cannot_download_an_attachment_from_another_booking(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();
        $booking = CustomBooking::factory()->create();
        $other = CustomBooking::factory()->create();

        $this->actingAs($user)
            ->post('/admin/bookings/'.$booking->id.'/attachments', [
                'attachments' => [$this->makePdfUpload('passport-scan.pdf')],
            ])
            ->assertRedirect();

        $attachment = CustomBookingAttachment::query()->firstOrFail();

        $this->actingAs($user)
            ->get('/admin/bookings/'.$other->id.'/attachments/'.$attachment->id.'/download')
            ->assertNotFound();
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
        $this->assertDatabaseCount('custom_booking_travelers', 0);
    }

    private function makePdfUpload(string $name): UploadedFile
    {
        $path = tempnam(sys_get_temp_dir(), 'booking-doc-');
        $this->assertNotFalse($path);
        $pdfPath = $path.'.pdf';
        file_put_contents($pdfPath, '%PDF-1.4 booking-file');

        return new UploadedFile($pdfPath, $name, 'application/pdf', null, true);
    }
}
