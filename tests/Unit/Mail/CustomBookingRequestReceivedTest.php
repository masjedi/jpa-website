<?php

namespace Tests\Unit\Mail;

use App\Mail\CustomBookingRequestReceived;
use App\Models\CustomBooking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomBookingRequestReceivedTest extends TestCase
{
    use RefreshDatabase;

    public function test_confirmation_email_is_addressed_to_the_traveler(): void
    {
        $booking = $this->booking();
        $mailable = new CustomBookingRequestReceived($booking);

        $mailable->assertHasTo('sara@example.com');
        $mailable->assertFrom((string) config('mail.from.address'), 'Journey to Peace Afghanistan Tours');
        $mailable->assertHasReplyTo('info@journey-to-afghanistan.com');
        $mailable->assertHasSubject('Your custom tour request '.$booking->reference.' has been received');
    }

    public function test_confirmation_email_contains_the_request_summary_without_passport_details(): void
    {
        $booking = $this->booking();
        $mailable = new CustomBookingRequestReceived($booking);

        $mailable->assertSeeInHtml('Dear Sara');
        $mailable->assertSeeInHtml($booking->reference);
        $mailable->assertSeeInHtml('Bamiyan, Band-e Amir');
        $mailable->assertSeeInHtml('not an instant booking');
        $mailable->assertDontSeeInHtml('C01X2Y3Z4');
        $mailable->assertSeeInText('Reference: '.$booking->reference);
        $mailable->assertSeeInText('Destinations: Bamiyan, Band-e Amir');
    }

    public function test_confirmation_email_embeds_the_brand_logo(): void
    {
        $this->assertFileExists(public_path('brand/logo-white-h.png'));

        $mailable = new CustomBookingRequestReceived($this->booking());

        $mailable->assertSeeInHtml('data:image/png;base64,');
        $mailable->assertDontSeeInHtml('localhost');
        $mailable->assertDontSeeInHtml('/brand/logo-white-h.png');
    }

    private function booking(): CustomBooking
    {
        return CustomBooking::factory()->create([
            'reference' => 'JTP-2026-00001',
            'preferred_destinations' => 'Bamiyan, Band-e Amir',
        ]);
    }
}
