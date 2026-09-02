<?php

namespace App\Models;

use App\Support\Media\MediaAsset;
use App\Support\Media\MediaProcessor;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'custom_booking_id',
    'original_name',
    'mime_type',
    'size_bytes',
    'media',
    'uploaded_by',
    'sort_order',
])]
class CustomBookingAttachment extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'media' => 'array',
            'size_bytes' => 'integer',
            'sort_order' => 'integer',
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
    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function mediaAsset(): ?MediaAsset
    {
        if (! is_array($this->media) || $this->media === []) {
            return null;
        }

        return app(MediaProcessor::class)->hydrate($this->media);
    }
}
