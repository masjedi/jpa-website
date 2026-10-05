<?php

namespace App\Models;

use App\Enums\CustomBookingRequestKind;
use App\Enums\CustomBookingStatus;
use Database\Factories\CustomBookingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'reference',
    'status',
    'request_kind',
    'package_title',
    'package_price',
    'full_name',
    'email',
    'phone',
    'passport_number',
    'country',
    'tour_type',
    'number_of_tourists',
    'tourist_genders',
    'guide_preference',
    'preferred_date',
    'preferred_date_end',
    'alternative_date',
    'preferred_destinations',
    'other_requests',
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
            'request_kind' => CustomBookingRequestKind::class,
            'tourist_genders' => 'array',
            'number_of_tourists' => 'integer',
            'preferred_date' => 'date',
            'preferred_date_end' => 'date',
            'alternative_date' => 'date',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        $term = trim((string) $search);

        if ($term === '') {
            return $query;
        }

        return $query->where(function (Builder $builder) use ($term): void {
            $builder
                ->where('reference', 'like', "%{$term}%")
                ->orWhere('full_name', 'like', "%{$term}%")
                ->orWhere('email', 'like', "%{$term}%")
                ->orWhere('phone', 'like', "%{$term}%")
                ->orWhere('country', 'like', "%{$term}%")
                ->orWhere('package_title', 'like', "%{$term}%")
                ->orWhere('preferred_destinations', 'like', "%{$term}%");
        });
    }
}
