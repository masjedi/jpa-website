<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed the administrator account.
     *
     * Requires ADMIN_EMAIL and ADMIN_PASSWORD in the environment.
     */
    public function run(): void
    {
        $email = trim((string) env('ADMIN_EMAIL', ''));
        $password = (string) env('ADMIN_PASSWORD', '');
        $name = trim((string) env('ADMIN_NAME', 'JPA Administrator'));

        if ($email === '' || $password === '') {
            throw new RuntimeException(
                'Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env before seeding the admin user.',
            );
        }

        if (strlen($password) < 12) {
            throw new RuntimeException('ADMIN_PASSWORD must be at least 12 characters.');
        }

        User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => $name !== '' ? $name : 'JPA Administrator',
                'email_verified_at' => now(),
                'password' => $password,
            ],
        );
    }
}
