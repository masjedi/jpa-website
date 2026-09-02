<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'custom_booking_id',
    'custom_booking_traveler_id',
    'sort_order',
    'issuing_country',
    'expiry_date',
])]
class CustomBookingDocument extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'expiry_date' => 'date',
        ];
    }

    /**
     * @return BelongsTo<CustomBooking, $this>
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(CustomBooking::class, 'custom_booking_id');
    }

    /**
     * @return BelongsTo<CustomBookingTraveler, $this>
     */
    public function traveler(): BelongsTo
    {
        return $this->belongsTo(CustomBookingTraveler::class, 'custom_booking_traveler_id');
    }
}
