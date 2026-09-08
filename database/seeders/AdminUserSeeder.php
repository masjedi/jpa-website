<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public const DEFAULT_EMAIL = 'admin@journey-to-afghanistan.com';

    public const DEFAULT_PASSWORD = 'Admin!@#$1234';

    public const DEFAULT_NAME = 'JPA Administrator';

    /**
     * Seed the primary administrator account.
     */
    public function run(): void
    {
        $email = trim((string) config('admin.email'));
        $password = (string) config('admin.password');
        $name = trim((string) config('admin.name'));

        User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => $name !== '' ? $name : self::DEFAULT_NAME,
                'email_verified_at' => now(),
                'password' => $password,
            ],
        );
    }
}
