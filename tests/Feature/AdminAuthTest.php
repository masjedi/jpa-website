<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_login_page_is_accessible_to_guests(): void
    {
        $this->get('/admin/login')
            ->assertOk()
            ->assertSee('<meta name="robots" content="noindex, nofollow">', false);
    }

    public function test_admin_root_redirects_guests_to_login(): void
    {
        $this->get('/admin')->assertRedirect(route('admin.login'));
    }

    public function test_admin_can_sign_in_and_reach_dashboard(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@journeytopeace.com',
            'password' => 'Admin!@#123',
        ]);

        $this->post('/admin/login', [
            'email' => $user->email,
            'password' => 'Admin!@#123',
        ])->assertRedirect(route('admin.dashboard'));

        $this->actingAs($user)
            ->get('/admin/dashboard')
            ->assertOk();
    }

    public function test_invalid_credentials_are_rejected(): void
    {
        User::factory()->create([
            'email' => 'admin@journeytopeace.com',
            'password' => 'Admin!@#123',
        ]);

        $this->from('/admin/login')
            ->post('/admin/login', [
                'email' => 'admin@journeytopeace.com',
                'password' => 'wrong-password',
            ])
            ->assertRedirect('/admin/login')
            ->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_authenticated_admin_is_redirected_from_login_page(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/admin/login')
            ->assertRedirect(route('admin.dashboard'));
    }

    public function test_guest_cannot_access_dashboard(): void
    {
        $this->get('/admin/dashboard')->assertRedirect(route('admin.login'));
    }

    public function test_admin_can_sign_out(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/logout')
            ->assertRedirect(route('admin.login'));

        $this->assertGuest();
    }
}
