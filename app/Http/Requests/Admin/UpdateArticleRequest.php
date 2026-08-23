<?php

namespace App\Http\Requests\Admin;

use App\Support\Media\ArticleCoverImage;

class UpdateArticleRequest extends ArticleListingRequest
{
    /**
     * @return array<int, string>
     */
    protected function coverImageRules(): array
    {
        return ArticleCoverImage::validationRules(required: false);
    }
}
