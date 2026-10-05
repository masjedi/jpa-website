<?php

namespace App\Support;

use App\Models\SiteSetting;
use App\Support\SiteSettings\SiteSettingsDefaults;
use Throwable;

class Brand
{
    public const NAME = SiteSettingsDefaults::BRAND_NAME;

    public static function appName(): string
    {
        try {
            $brandName = trim((string) SiteSetting::current()->brand_name);

            if ($brandName !== '' && strcasecmp($brandName, 'Laravel') !== 0) {
                return $brandName;
            }
        } catch (Throwable) {
            // Fall through when the settings table is not available yet.
        }

        $configured = trim((string) config('app.name'));

        if ($configured === '' || strcasecmp($configured, 'Laravel') === 0) {
            return self::NAME;
        }

        return $configured;
    }
}
