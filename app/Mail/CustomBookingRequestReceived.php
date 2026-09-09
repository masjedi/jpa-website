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

class CustomBookingRequestReceived extends Mailable implements ShouldQueue
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
                new Address($confirmation->email, $confirmation->fullName),
            ],
            subject: "Your custom tour request {$confirmation->reference} has been received",
            replyTo: [
                new Address($confirmation->contactEmail, $confirmation->brandName),
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.custom-booking-received',
            text: 'emails.custom-booking-received-text',
            with: [
                'confirmation' => $this->confirmation(),
            ],
        );
    }

    private function confirmation(): CustomBookingConfirmation
    {
        return CustomBookingConfirmation::fromBooking($this->booking);
    }
}
