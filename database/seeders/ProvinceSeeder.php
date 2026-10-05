<?php

namespace Database\Seeders;

use App\Models\Province;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProvinceSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->catalog() as $index => $name) {
            Province::query()->firstOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'sort_order' => $index + 1,
                ],
            );
        }
    }

    /**
     * @return list<string>
     */
    private function catalog(): array
    {
        return [
            'Badakhshan',
            'Badghis',
            'Baghlan',
            'Balkh',
            'Bamyan',
            'Daykundi',
            'Farah',
            'Faryab',
            'Ghazni',
            'Ghor',
            'Helmand',
            'Herat',
            'Jowzjan',
            'Kabul',
            'Kandahar',
            'Kapisa',
            'Khost',
            'Kunar',
            'Kunduz',
            'Laghman',
            'Logar',
            'Nangarhar',
            'Nimroz',
            'Nuristan',
            'Paktia',
            'Paktika',
            'Panjshir',
            'Parwan',
            'Samangan',
            'Sar-e Pol',
            'Takhar',
            'Uruzgan',
            'Wardak',
            'Zabul',
        ];
    }
}
