<?php

namespace App\Http\Requests\Admin;

use App\Support\Media\TourCoverImage;

class UpdateTourRequest extends TourListingRequest
{
    /**
     * @return array<int, string>
     */
    protected function coverImageRules(): array
    {
        return TourCoverImage::validationRules(required: false);
    }
}
