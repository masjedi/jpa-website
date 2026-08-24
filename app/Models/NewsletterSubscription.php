<?php

namespace App\Models;

use App\Enums\NewsletterSubscriptionSource;
use App\Enums\NewsletterSubscriptionStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'email',
    'source',
    'status',
])]
class NewsletterSubscription extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'source' => NewsletterSubscriptionSource::class,
            'status' => NewsletterSubscriptionStatus::class,
        ];
    }

    /**
     * @param  Builder<NewsletterSubscription>  $query
     * @return Builder<NewsletterSubscription>
     */
    public function scopeLatestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('created_at')->orderByDesc('id');
    }
}
