<?php

namespace App\Models;

use App\Enums\TeamMemberStatus;
use App\Support\Media\MediaAsset;
use App\Support\Media\MediaProcessor;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'status',
    'name',
    'role',
    'bio',
    'email',
    'whatsapp',
    'whatsapp_href',
    'avatar_media',
    'sort_order',
])]
class TeamMember extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => TeamMemberStatus::class,
            'avatar_media' => 'array',
            'sort_order' => 'integer',
        ];
    }

    public function avatarAsset(): ?MediaAsset
    {
        if (! is_array($this->avatar_media) || $this->avatar_media === []) {
            return null;
        }

        return app(MediaProcessor::class)->hydrate($this->avatar_media);
    }

    /**
     * @param  Builder<TeamMember>  $query
     * @return Builder<TeamMember>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', TeamMemberStatus::Published);
    }

    /**
     * @param  Builder<TeamMember>  $query
     * @return Builder<TeamMember>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
