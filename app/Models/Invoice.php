<?php

namespace App\Models;

use App\Enums\InvoiceStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'number',
    'status',
    'client_name',
    'client_email',
    'client_address',
    'tour_reference',
    'issued_on',
    'due_on',
    'currency',
    'amount',
    'line_items',
    'discount_percent',
    'services_html',
    'notes',
    'verification_token',
    'verification_expires_at',
])]
class Invoice extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => InvoiceStatus::class,
            'issued_on' => 'date',
            'due_on' => 'date',
            'amount' => 'decimal:2',
            'line_items' => 'array',
            'discount_percent' => 'decimal:2',
            'verification_expires_at' => 'datetime',
        ];
    }

    /**
     * @param  Builder<Invoice>  $query
     * @return Builder<Invoice>
     */
    public function scopeLatestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('issued_on')->orderByDesc('id');
    }

    public static function nextNumber(): string
    {
        $year = now()->year;
        $prefix = "INV-{$year}-";
        $latest = self::query()
            ->where('number', 'like', "{$prefix}%")
            ->orderByDesc('number')
            ->value('number');

        $sequence = 1;

        if (is_string($latest) && str_starts_with($latest, $prefix)) {
            $sequence = ((int) substr($latest, strlen($prefix))) + 1;
        }

        return $prefix.str_pad((string) $sequence, 4, '0', STR_PAD_LEFT);
    }
}
