<?php

namespace App\Http\Requests\Admin;

use App\Support\Media\TeamAvatarImage;

class StoreTeamMemberRequest extends TeamMemberListingRequest
{
    /**
     * @return array<int, string>
     */
    protected function avatarImageRules(): array
    {
        return TeamAvatarImage::validationRules(required: true);
    }
}
