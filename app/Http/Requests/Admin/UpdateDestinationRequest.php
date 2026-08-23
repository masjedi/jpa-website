<?php

namespace App\Http\Requests\Admin;

use App\Support\Media\DestinationCoverImage;

class UpdateDestinationRequest extends DestinationListingRequest
{
    /**
     * @return array<int, string>
     */
    protected function coverImageRules(): array
    {
        return DestinationCoverImage::validationRules(required: false);
    }
}
