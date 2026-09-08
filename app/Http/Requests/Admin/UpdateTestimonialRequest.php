<?php

namespace App\Http\Requests\Admin;

use App\Support\Media\TestimonialAvatarImage;

class UpdateTestimonialRequest extends TestimonialListingRequest
{
    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return array_merge(
            parent::rules(),
            [
                'avatar_image' => TestimonialAvatarImage::validationRules(required: false),
            ],
        );
    }
}
