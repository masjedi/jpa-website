<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed the default administrator account for local and review environments.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@journeytopeace.com')],
            [
                'name' => env('ADMIN_NAME', 'JPA Administrator'),
                'email_verified_at' => now(),
                'password' => env('ADMIN_PASSWORD', 'Admin!@#123'),
            ],
        );
    }
}
