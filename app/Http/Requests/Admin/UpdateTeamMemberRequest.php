<?php

namespace App\Http\Requests\Admin;

use App\Support\Media\TeamAvatarImage;

class UpdateTeamMemberRequest extends TeamMemberListingRequest
{
    /**
     * @return array<int, string>
     */
    protected function avatarImageRules(): array
    {
        return TeamAvatarImage::validationRules(required: false);
    }
}
