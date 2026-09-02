<?php

namespace Tests\Unit\Mail;

use App\Mail\CustomBookingRequestReceived;
use App\Models\CustomBooking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomBookingRequestReceivedTest extends TestCase
{
    use RefreshDatabase;

    public function test_confirmation_email_is_addressed_to_the_primary_traveler(): void
    {
        $booking = $this->booking();
        $mailable = new CustomBookingRequestReceived($booking);

        $mailable->assertHasTo('sara@example.com');
        $mailable->assertFrom((string) config('mail.from.address'), 'Journey to Peace Afghanistan Tours');
        $mailable->assertHasReplyTo('info@journey-to-afghanistan.com');
        $mailable->assertHasSubject('Your custom tour request '.$booking->reference.' has been received');
    }

    public function test_confirmation_email_contains_the_request_summary_without_sensitive_details(): void
    {
        $booking = $this->booking();
        $mailable = new CustomBookingRequestReceived($booking);

        $mailable->assertSeeInHtml('Dear Sara Ahmad');
        $mailable->assertSeeInHtml('sara@example.com');
        $mailable->assertSeeInHtml($booking->reference);
        $mailable->assertSeeInHtml('Bamiyan, Band-e Amir');
        $mailable->assertSeeInHtml('Complete custom package');
        $mailable->assertSeeInHtml('not an instant booking');
        $mailable->assertDontSeeInHtml('passport');
        $mailable->assertDontSeeInHtml('emergency');
        $mailable->assertSeeInText('Confirmation sent to: sara@example.com');
        $mailable->assertSeeInText('Reference: '.$booking->reference);
    }

    public function test_confirmation_email_embeds_the_brand_logo(): void
    {
        config(['app.url' => 'https://example.test']);
        $this->assertFileExists(public_path('brand/logo-white-h.png'));

        $mailable = new CustomBookingRequestReceived($this->booking());

        $mailable->assertSeeInHtml('data:image/png;base64,');
        $mailable->assertDontSeeInHtml('localhost');
        $mailable->assertDontSeeInHtml('/brand/logo-white-h.png');
    }

    private function booking(): CustomBooking
    {
        $booking = CustomBooking::factory()->create([
            'reference' => 'JTP-2026-00001',
            'wants_complete' => true,
            'flexibility' => 'exact',
            'route_preference' => 'know',
            'season' => 'Autumn',
        ]);

        $booking->destinations()->createMany([
            ['name' => 'Bamiyan'],
            ['name' => 'Band-e Amir'],
        ]);

        $booking->interests()->createMany([
            ['interest' => 'culture'],
            ['interest' => 'nature'],
        ]);

        return $booking->fresh(['primaryTraveler', 'destinations', 'interests']);
    }
}
