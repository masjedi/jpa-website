<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'custom_booking_id',
    'interest',
])]
class CustomBookingInterest extends Model
{
    /**
     * @return BelongsTo<CustomBooking, $this>
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(CustomBooking::class, 'custom_booking_id');
    }
}
