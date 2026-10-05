<?php

namespace App\Http\Controllers;

use App\Support\Seo\SitemapBuilder;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        return response(SitemapBuilder::xml(), 200)
            ->header('Content-Type', 'application/xml; charset=utf-8');
    }
}
