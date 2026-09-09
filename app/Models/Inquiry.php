<?php

namespace App\Models;

use App\Enums\InquirySource;
use App\Enums\InquiryStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'source',
    'status',
    'name',
    'email',
    'subject',
    'message',
    'phone',
    'nationality',
    'preferred_date',
    'traveler_count',
    'package_price',
    'request_kind',
    'read_at',
])]
class Inquiry extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'source' => InquirySource::class,
            'status' => InquiryStatus::class,
            'read_at' => 'datetime',
        ];
    }

    /**
     * @param  Builder<Inquiry>  $query
     * @return Builder<Inquiry>
     */
    public function scopeLatestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('created_at')->orderByDesc('id');
    }

    public function isUnread(): bool
    {
        return $this->read_at === null;
    }
}
