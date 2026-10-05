<?php

namespace App\Jobs;

use App\Mail\CustomBookingRequestReceived;
use App\Mail\CustomBookingSubmittedForTeam;
use App\Models\CustomBooking;
use App\Support\Admin\AdminNotificationRecorder;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ProcessCustomBookingSubmittedJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /**
     * @var list<int>
     */
    public array $backoff = [10, 30, 60];

    public function __construct(public CustomBooking $booking)
    {
        $this->afterCommit();
    }

    public function handle(): void
    {
        AdminNotificationRecorder::forCustomBooking($this->booking);

        Mail::to($this->booking->email)->send(new CustomBookingRequestReceived($this->booking));
        Mail::to((string) config('mail.from.address'))->send(new CustomBookingSubmittedForTeam($this->booking));
    }

    public function failed(?Throwable $exception): void
    {
        Log::error('Failed to process custom booking follow-ups.', [
            'booking_id' => $this->booking->id,
            'reference' => $this->booking->reference,
            'error' => $exception?->getMessage(),
        ]);
    }
}
