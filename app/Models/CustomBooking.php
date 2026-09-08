<?php

namespace App\Models;

use App\Enums\CustomBookingStatus;
use Database\Factories\CustomBookingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'reference',
    'status',
    'adults',
    'children',
    'traveler_count',
    'group_type',
    'start_date',
    'end_date',
    'flexibility',
    'season',
    'duration_days',
    'other_destination',
    'recommend_destinations',
    'route_preference',
    'visa_status',
    'insurance_status',
    'emergency_name',
    'emergency_relationship',
    'emergency_phone',
    'dietary',
    'dietary_options',
    'dietary_details',
    'medical',
    'medical_details',
    'contact_method',
    'special_requests',
    'accuracy',
    'terms',
    'privacy',
    'marketing',
    'wants_complete',
    'wants_guide',
    'guide_count',
    'guide_gender',
    'wants_transportation',
    'wants_accommodation',
    'wants_airport',
    'wants_domestic',
    'guide_language',
    'guide_languages',
    'guide_language_other',
    'guide_request',
    'vehicle',
    'transport_coverage',
    'transport_notes',
    'accommodation_level',
    'room_preference',
    'room_count',
    'accommodation_notes',
    'arrival_assistance',
    'arrival_details_later',
    'arrival_airport',
    'arrival_date',
    'arrival_time',
    'arrival_flight',
    'departure_assistance',
    'departure_details_later',
    'departure_airport',
    'departure_date',
    'departure_time',
    'departure_flight',
    'domestic_preference',
])]
class CustomBooking extends Model
{
    /** @use HasFactory<CustomBookingFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => CustomBookingStatus::class,
            'start_date' => 'date',
            'end_date' => 'date',
            'recommend_destinations' => 'boolean',
            'accuracy' => 'boolean',
            'terms' => 'boolean',
            'privacy' => 'boolean',
            'marketing' => 'boolean',
            'wants_complete' => 'boolean',
            'wants_guide' => 'boolean',
            'guide_languages' => 'array',
            'dietary_options' => 'array',
            'wants_transportation' => 'boolean',
            'wants_accommodation' => 'boolean',
            'wants_airport' => 'boolean',
            'wants_domestic' => 'boolean',
            'arrival_details_later' => 'boolean',
            'departure_details_later' => 'boolean',
            'arrival_date' => 'date',
            'departure_date' => 'date',
            'emergency_name' => 'encrypted',
            'emergency_relationship' => 'encrypted',
            'emergency_phone' => 'encrypted',
            'medical_details' => 'encrypted',
            'arrival_flight' => 'encrypted',
            'departure_flight' => 'encrypted',
        ];
    }

    /**
     * @return HasMany<CustomBookingTraveler, $this>
     */
    public function travelers(): HasMany
    {
        return $this->hasMany(CustomBookingTraveler::class)->orderBy('sort_order');
    }

    /**
     * @return HasOne<CustomBookingTraveler, $this>
     */
    public function primaryTraveler(): HasOne
    {
        return $this->hasOne(CustomBookingTraveler::class)->where('is_primary', true);
    }

    /**
     * @return HasMany<CustomBookingDocument, $this>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(CustomBookingDocument::class)->orderBy('sort_order');
    }

    /**
     * @return HasMany<CustomBookingAttachment, $this>
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(CustomBookingAttachment::class)->orderBy('sort_order')->orderByDesc('id');
    }

    /**
     * @return HasMany<CustomBookingDestination, $this>
     */
    public function destinations(): HasMany
    {
        return $this->hasMany(CustomBookingDestination::class);
    }

    /**
     * @return HasMany<CustomBookingInterest, $this>
     */
    public function interests(): HasMany
    {
        return $this->hasMany(CustomBookingInterest::class);
    }

    /**
     * @return HasMany<CustomBookingStatusChange, $this>
     */
    public function statusChanges(): HasMany
    {
        return $this->hasMany(CustomBookingStatusChange::class)->orderByDesc('id');
    }

    /**
     * @param  Builder<CustomBooking>  $query
     * @return Builder<CustomBooking>
     */
    public function scopeLatestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('created_at')->orderByDesc('id');
    }
}
