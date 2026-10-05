<?php

namespace App\Http\Requests\Admin;

use App\Support\Media\AboutJourneyImage;

class StoreAboutJourneyStepRequest extends AboutJourneyStepListingRequest
{
    protected function imageRules(): array
    {
        return AboutJourneyImage::validationRules(required: true);
    }
}
