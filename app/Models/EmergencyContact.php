<?php

namespace App\Models;

use App\Enums\EmergencyContactVerificationAge;
use App\Enums\EmergencyType;
use Database\Factories\EmergencyContactFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'province_id',
    'full_name',
    'position',
    'organization',
    'emergency_type',
    'primary_phone',
    'secondary_phone',
    'whatsapp',
    'availability_notes',
    'last_verified_at',
    'verified_by',
    'is_customer_shareable',
    'is_active',
    'internal_notes',
    'created_by',
    'updated_by',
])]
class EmergencyContact extends Model
{
    /** @use HasFactory<EmergencyContactFactory> */
    use HasFactory;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'is_customer_shareable' => false,
        'is_active' => true,
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'emergency_type' => EmergencyType::class,
            'last_verified_at' => 'date',
            'is_customer_shareable' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Province, $this>
     */
    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * @param  Builder<EmergencyContact>  $query
     * @return Builder<EmergencyContact>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<EmergencyContact>  $query
     * @return Builder<EmergencyContact>
     */
    public function scopeShareableWithCustomers(Builder $query): Builder
    {
        return $query->where('is_active', true)->where('is_customer_shareable', true);
    }

    /**
     * @param  Builder<EmergencyContact>  $query
     * @return Builder<EmergencyContact>
     */
    public function scopeLatestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('id');
    }

    public function verificationAge(): EmergencyContactVerificationAge
    {
        return EmergencyContactVerificationAge::fromVerifiedAt($this->last_verified_at ?? now());
    }

    public function isEligibleForCustomerSharing(): bool
    {
        return $this->is_active && $this->is_customer_shareable;
    }
}
