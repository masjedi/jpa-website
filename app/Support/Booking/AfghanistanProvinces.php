<?php

namespace App\Support\Booking;

final class AfghanistanProvinces
{
    /**
     * @return list<array{zone: string, provinces: list<string>}>
     */
    public static function zones(): array
    {
        return [
            [
                'zone' => 'Central Afghanistan',
                'provinces' => ['Kabul', 'Kapisa', 'Parwan', 'Panjshir', 'Wardak', 'Logar'],
            ],
            [
                'zone' => 'East Afghanistan',
                'provinces' => ['Nangarhar', 'Kunar', 'Laghman', 'Nuristan'],
            ],
            [
                'zone' => 'Southeast Afghanistan',
                'provinces' => ['Paktia', 'Paktika', 'Khost', 'Ghazni'],
            ],
            [
                'zone' => 'South Afghanistan',
                'provinces' => ['Kandahar', 'Helmand', 'Zabul', 'Uruzgan', 'Nimroz'],
            ],
            [
                'zone' => 'West Afghanistan',
                'provinces' => ['Herat', 'Farah', 'Badghis'],
            ],
            [
                'zone' => 'Northwest Afghanistan',
                'provinces' => ['Faryab', 'Jowzjan', 'Sar-e Pol'],
            ],
            [
                'zone' => 'North Afghanistan',
                'provinces' => ['Balkh', 'Samangan', 'Kunduz', 'Baghlan', 'Takhar'],
            ],
            [
                'zone' => 'Northeast Afghanistan',
                'provinces' => ['Badakhshan'],
            ],
            [
                'zone' => 'Central Highlands',
                'provinces' => ['Bamyan', 'Daykundi', 'Ghor'],
            ],
        ];
    }

    /**
     * @return list<string>
     */
    public static function names(): array
    {
        return collect(self::zones())
            ->flatMap(fn (array $zone): array => $zone['provinces'])
            ->values()
            ->all();
    }
}
