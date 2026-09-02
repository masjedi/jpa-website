<?php

namespace App\Models;

use App\Enums\CustomBookingStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'custom_booking_id',
    'from_status',
    'to_status',
    'user_id',
])]
class CustomBookingStatusChange extends Model
{
    public const UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'from_status' => CustomBookingStatus::class,
            'to_status' => CustomBookingStatus::class,
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
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
