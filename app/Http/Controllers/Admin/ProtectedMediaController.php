<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\Media\MediaProcessor;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProtectedMediaController extends Controller
{
    /**
     * Authenticated download for private media profiles (never public URLs).
     */
    public function show(string $profile, string $id, MediaProcessor $processor): StreamedResponse
    {
        $asset = $processor->findPrivate($profile, $id);

        return $processor->download($asset);
    }
}
