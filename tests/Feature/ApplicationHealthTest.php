<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class ApplicationHealthTest extends TestCase
{
    use RefreshDatabase;

    public function test_health_endpoint_is_available(): void
    {
        $this->get('/up')->assertOk();
    }

    public function test_critical_named_routes_are_registered(): void
    {
        $routes = [
            'home',
            'contact',
            'inquiries.contact',
            'inquiries.tour',
            'newsletter.subscribe',
            'admin.login',
            'admin.login.store',
            'admin.dashboard',
            'admin.logout',
        ];

        foreach ($routes as $name) {
            $this->assertTrue(Route::has($name), "Missing named route [{$name}].");
        }
    }
}
