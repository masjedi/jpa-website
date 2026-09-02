<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'custom_booking_id',
    'destination_id',
    'name',
])]
class CustomBookingDestination extends Model
{
    /**
     * @return BelongsTo<CustomBooking, $this>
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(CustomBooking::class, 'custom_booking_id');
    }

    /**
     * @return BelongsTo<Destination, $this>
     */
    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }
}
