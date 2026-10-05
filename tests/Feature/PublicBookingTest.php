<?php

namespace Tests\Feature;

use App\Enums\CustomBookingRequestKind;
use App\Enums\CustomBookingStatus;
use App\Mail\CustomBookingRequestReceived;
use App\Mail\CustomBookingSubmittedForTeam;
use App\Models\CustomBooking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PublicBookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_booking_page_opens_the_custom_request_on_the_homepage(): void
    {
        $this->get('/booking')
            ->assertRedirect('/?custom_tour=1');
    }

    public function test_visitor_can_submit_a_custom_booking_request(): void
    {
        Mail::fake();

        $this->from('/')
            ->post('/booking', $this->validPayload())
            ->assertRedirect('/')
            ->assertSessionHas('customBookingSuccess', function (array $payload): bool {
                return $payload['email'] === 'sara@example.com'
                    && $payload['fullName'] === 'Sara Ahmad'
                    && $payload['status'] === 'submitted'
                    && $payload['numberOfTourists'] === 2
                    && str_starts_with((string) $payload['reference'], 'JTP-');
            });

        $booking = CustomBooking::query()->first();

        $this->assertNotNull($booking);
        $this->assertSame(CustomBookingStatus::Submitted, $booking->status);
        $this->assertSame(CustomBookingRequestKind::CustomTour, $booking->request_kind);
        $this->assertSame('Sara Ahmad', $booking->full_name);
        $this->assertSame('sara@example.com', $booking->email);
        $this->assertSame('+491776687088', $booking->phone);
        $this->assertSame(['female'], $booking->tourist_genders);
        $this->assertSame('Bamiyan', $booking->preferred_destinations);
        $this->assertNull($booking->package_title);

        Mail::assertQueued(CustomBookingRequestReceived::class, function (CustomBookingRequestReceived $mail) use ($booking): bool {
            return $mail->booking->is($booking);
        });
        Mail::assertQueued(CustomBookingSubmittedForTeam::class, function (CustomBookingSubmittedForTeam $mail) use ($booking): bool {
            return $mail->booking->is($booking);
        });
    }

    public function test_custom_booking_requires_a_date_and_a_valid_phone(): void
    {
        Mail::fake();

        $this->from('/')
            ->post('/booking', [
                ...$this->validPayload(),
                'preferred_date' => '',
                'preferred_date_end' => '',
                'alternative_date' => '',
                'phone' => 'not-a-phone',
            ])
            ->assertRedirect('/')
            ->assertSessionHasErrors(['preferred_date', 'phone']);

        $this->assertDatabaseCount('custom_bookings', 0);
        Mail::assertNothingQueued();
    }

    /**
     * @return array<string, mixed>
     */
    private function validPayload(): array
    {
        $start = now()->addMonth()->toDateString();
        $end = now()->addMonth()->addDays(4)->toDateString();

        return [
            'request_kind' => CustomBookingRequestKind::CustomTour->value,
            'full_name' => 'Sara Ahmad',
            'email' => 'sara@example.com',
            'phone' => '+49 177 668 7088',
            'passport_number' => 'C01X2Y3Z4',
            'country' => 'Germany',
            'tour_type' => 'group',
            'number_of_tourists' => 2,
            'tourist_genders' => ['female'],
            'guide_preference' => 'no_preference',
            'preferred_date' => $start,
            'preferred_date_end' => $end,
            'preferred_destinations' => 'Bamiyan',
            'other_requests' => 'Slow pace',
        ];
    }
}
