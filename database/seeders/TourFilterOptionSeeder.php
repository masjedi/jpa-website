<?php

namespace Database\Seeders;

use App\Enums\TourFilterOptionStatus;
use App\Enums\TourFilterOptionType;
use App\Models\TourFilterOption;
use App\Support\Translatable;
use Illuminate\Database\Seeder;

class TourFilterOptionSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->catalog() as $type => $names) {
            foreach ($names as $index => $name) {
                TourFilterOption::query()->firstOrCreate(
                    [
                        'type' => $type,
                        'value' => $name,
                    ],
                    [
                        'name' => Translatable::normalize($name),
                        'status' => TourFilterOptionStatus::Published,
                        'sort_order' => $index + 1,
                    ],
                );
            }
        }
    }

    /**
     * @return array<string, list<string>>
     */
    private function catalog(): array
    {
        return [
            TourFilterOptionType::Region->value => [
                'Central Highlands',
                'Eastern & Capital',
                'Western Silk Road',
                'Northern Region',
                'Pamir & Badakhshan',
                'Multiple Regions',
                'Southern Plains',
            ],
            TourFilterOptionType::TravelStyle->value => [
                'Cultural & Heritage',
                'Adventure & Trekking',
                'Photography Focus',
                'Silk Road History',
                'Small Group Expedition',
                'Family friendly',
            ],
            TourFilterOptionType::Difficulty->value => [
                'Easy',
                'Moderate',
                'Demanding',
                'Expedition',
            ],
            TourFilterOptionType::Destination->value => [
                'Kabul & around',
                'Bamiyan Valley',
                'Herat',
                'Panjshir Valley',
            ],
            TourFilterOptionType::Season->value => [
                'Spring',
                'Summer',
                'Autumn',
                'Winter',
            ],
            TourFilterOptionType::GroupType->value => [
                'Private tour',
                'Small group',
                'Solo traveler',
            ],
        ];
    }
}
