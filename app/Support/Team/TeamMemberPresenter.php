<?php

namespace App\Support\Team;

use App\Models\TeamMember;
use App\Support\Media\PublicDecorativeImage;
use App\Support\Media\TeamAvatarImage;
use App\Support\Translatable;

class TeamMemberPresenter
{
    private const PLACEHOLDER_AVATAR = '/brand/logo-color-h.png';

    /**
     * @return array{members: list<array<string, mixed>>, avatarSpec: array<string, mixed>}
     */
    public static function forAdminIndex(): array
    {
        return [
            'members' => TeamMember::query()
                ->ordered()
                ->get()
                ->map(fn (TeamMember $member): array => self::adminPayload($member))
                ->values()
                ->all(),
            'avatarSpec' => TeamAvatarImage::spec(),
        ];
    }

    /**
     * @return array{members: list<array<string, mixed>>, bandImage: string}
     */
    public static function forPublicTeamPage(): array
    {
        return [
            'members' => TeamMember::query()
                ->published()
                ->ordered()
                ->get()
                ->map(fn (TeamMember $member): array => self::publicPayload($member))
                ->values()
                ->all(),
            'bandImage' => PublicDecorativeImage::resolve(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function adminPayload(TeamMember $member): array
    {
        return [
            'id' => $member->id,
            'name' => Translatable::normalize($member->name),
            'role' => Translatable::normalize($member->role),
            'bio' => Translatable::normalize($member->bio),
            'email' => (string) $member->email,
            'whatsapp' => (string) $member->whatsapp,
            'whatsappHref' => (string) $member->whatsapp_href,
            'image' => self::avatarUrl($member),
            'order' => (int) $member->sort_order,
            'status' => $member->status->frontendLabel(),
            'updated' => $member->updated_at?->timezone(config('app.timezone'))->diffForHumans() ?? '',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicPayload(TeamMember $member): array
    {
        return [
            'id' => (string) $member->id,
            'name' => Translatable::resolve($member->name),
            'role' => Translatable::resolve($member->role),
            'bio' => Translatable::resolve($member->bio),
            'email' => (string) $member->email,
            'whatsapp' => (string) $member->whatsapp,
            'whatsappHref' => (string) $member->whatsapp_href,
            'image' => self::avatarUrl($member),
        ];
    }

    /**
     * @return array{name: string, role: string, avatar?: string}
     */
    public static function authorPayload(TeamMember $member): array
    {
        $payload = [
            'name' => Translatable::resolve($member->name),
            'role' => Translatable::resolve($member->role),
        ];

        $avatar = self::avatarUrl($member);

        if ($avatar !== self::PLACEHOLDER_AVATAR) {
            $payload['avatar'] = $avatar;
        }

        return $payload;
    }

    public static function avatarUrl(TeamMember $member): string
    {
        return $member->avatarAsset()?->cardUrl()
            ?? $member->avatarAsset()?->detailUrl()
            ?? self::PLACEHOLDER_AVATAR;
    }
}
