<?php

namespace App\Models;

use App\Enums\AdminNotificationType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'type',
    'title',
    'description',
    'href',
    'read_at',
])]
class AdminNotification extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => AdminNotificationType::class,
            'read_at' => 'datetime',
        ];
    }

    /**
     * @param  Builder<AdminNotification>  $query
     * @return Builder<AdminNotification>
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
