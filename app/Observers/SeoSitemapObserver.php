<?php

namespace App\Observers;

use App\Support\Seo\SitemapBuilder;

class SeoSitemapObserver
{
    public function saved(): void
    {
        SitemapBuilder::forget();
    }

    public function deleted(): void
    {
        SitemapBuilder::forget();
    }
}
