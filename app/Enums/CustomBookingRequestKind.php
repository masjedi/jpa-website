<?php

namespace App\Enums;

enum CustomBookingRequestKind: string
{
    case CustomTour = 'custom_tour';
    case SeasonalPackage = 'seasonal_package';

    public function frontendLabel(): string
    {
        return match ($this) {
            self::CustomTour => 'Custom tour',
            self::SeasonalPackage => 'Seasonal package',
        };
    }

    public function isSeasonalPackage(): bool
    {
        return $this === self::SeasonalPackage;
    }
}
