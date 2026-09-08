<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'custom_booking_id',
    'sort_order',
    'is_primary',
    'first_name',
    'last_name',
    'date_of_birth',
    'nationality',
    'email',
    'phone',
    'country_of_residence',
    'is_first_visit',
])]
class CustomBookingTraveler extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'is_first_visit' => 'boolean',
            'date_of_birth' => 'date',
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
     * @return HasOne<CustomBookingDocument, $this>
     */
    public function document(): HasOne
    {
        return $this->hasOne(CustomBookingDocument::class);
    }

    public function displayName(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }
}
