<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminAccountTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_admin_can_view_account_page(): void
    {
        $user = User::factory()->create([
            'email' => AdminUserSeeder::DEFAULT_EMAIL,
            'password' => AdminUserSeeder::DEFAULT_PASSWORD,
        ]);

        $this->actingAs($user)
            ->get('/admin/account')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/Account')
                ->where('account.email', AdminUserSeeder::DEFAULT_EMAIL)
                ->where('account.name', $user->name));
    }

    public function test_guest_cannot_view_account_page(): void
    {
        $this->get('/admin/account')->assertRedirect(route('admin.login'));
    }

    public function test_admin_can_change_password_from_dashboard(): void
    {
        $user = User::factory()->create([
            'email' => AdminUserSeeder::DEFAULT_EMAIL,
            'password' => AdminUserSeeder::DEFAULT_PASSWORD,
        ]);

        $this->actingAs($user)
            ->from('/admin/account')
            ->patch('/admin/account/password', [
                'current_password' => AdminUserSeeder::DEFAULT_PASSWORD,
                'password' => 'NewSecure!Pass1',
                'password_confirmation' => 'NewSecure!Pass1',
            ])
            ->assertRedirect(route('admin.account.index'))
            ->assertSessionHas('success');

        $user->refresh();

        $this->assertTrue(Hash::check('NewSecure!Pass1', $user->password));
    }

    public function test_password_change_requires_correct_current_password(): void
    {
        $user = User::factory()->create([
            'email' => AdminUserSeeder::DEFAULT_EMAIL,
            'password' => AdminUserSeeder::DEFAULT_PASSWORD,
        ]);

        $this->actingAs($user)
            ->from('/admin/account')
            ->patch('/admin/account/password', [
                'current_password' => 'wrong-password',
                'password' => 'NewSecure!Pass1',
                'password_confirmation' => 'NewSecure!Pass1',
            ])
            ->assertRedirect('/admin/account')
            ->assertSessionHasErrors('current_password');

        $user->refresh();

        $this->assertTrue(Hash::check(AdminUserSeeder::DEFAULT_PASSWORD, $user->password));
    }

    public function test_admin_user_seeder_creates_default_admin_account(): void
    {
        config([
            'admin.email' => AdminUserSeeder::DEFAULT_EMAIL,
            'admin.password' => AdminUserSeeder::DEFAULT_PASSWORD,
            'admin.name' => AdminUserSeeder::DEFAULT_NAME,
        ]);

        $this->seed(AdminUserSeeder::class);

        $this->assertDatabaseHas('users', [
            'email' => AdminUserSeeder::DEFAULT_EMAIL,
            'name' => AdminUserSeeder::DEFAULT_NAME,
        ]);

        $user = User::query()->where('email', AdminUserSeeder::DEFAULT_EMAIL)->first();

        $this->assertNotNull($user);
        $this->assertTrue(Hash::check(AdminUserSeeder::DEFAULT_PASSWORD, $user->password));
    }

    public function test_default_admin_can_sign_in(): void
    {
        config([
            'admin.email' => AdminUserSeeder::DEFAULT_EMAIL,
            'admin.password' => AdminUserSeeder::DEFAULT_PASSWORD,
            'admin.name' => AdminUserSeeder::DEFAULT_NAME,
        ]);

        $this->seed(AdminUserSeeder::class);

        $this->post('/admin/login', [
            'email' => AdminUserSeeder::DEFAULT_EMAIL,
            'password' => AdminUserSeeder::DEFAULT_PASSWORD,
        ])->assertRedirect(route('admin.dashboard'));
    }
}
