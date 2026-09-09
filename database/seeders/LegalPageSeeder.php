<?php

namespace Database\Seeders;

use App\Enums\LegalPageKey;
use App\Models\LegalPage;
use App\Support\Legal\LegalPageDefaults;
use Illuminate\Database\Seeder;

class LegalPageSeeder extends Seeder
{
    public function run(): void
    {
        foreach (LegalPageKey::cases() as $key) {
            LegalPage::query()->updateOrCreate(
                ['key' => $key],
                LegalPageDefaults::attributesFor($key),
            );
        }
    }
}
