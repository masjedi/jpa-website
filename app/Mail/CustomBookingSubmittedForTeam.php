<?php

namespace App\Mail;

use App\Models\CustomBooking;
use App\Support\Booking\CustomBookingConfirmation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CustomBookingSubmittedForTeam extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public CustomBooking $booking)
    {
        $this->afterCommit();
    }

    public function envelope(): Envelope
    {
        $confirmation = $this->confirmation();

        return new Envelope(
            from: new Address((string) config('mail.from.address'), $confirmation->brandName),
            to: [
                new Address($confirmation->contactEmail, $confirmation->brandName),
            ],
            subject: "New custom tour request {$confirmation->reference}",
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.custom-booking-submitted-team',
            text: 'emails.custom-booking-submitted-team-text',
            with: [
                'confirmation' => $this->confirmation(),
            ],
        );
    }

    private function confirmation(): CustomBookingConfirmation
    {
        $this->booking->loadMissing(['primaryTraveler', 'destinations', 'interests']);

        return CustomBookingConfirmation::fromBooking($this->booking);
    }
}
