<?php

namespace Tests\Feature\Admin;

use App\Enums\TourFilterOptionStatus;
use App\Enums\TourFilterOptionType;
use App\Models\TourFilterOption;
use App\Models\User;
use App\Support\Translatable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeFinderTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_admin_can_view_home_finder_index(): void
    {
        $user = User::factory()->create();

        TourFilterOption::query()->create([
            'type' => TourFilterOptionType::Destination,
            'value' => 'Bamiyan Valley',
            'name' => Translatable::normalize('Bamiyan Valley'),
            'status' => TourFilterOptionStatus::Published,
            'sort_order' => 1,
        ]);

        $this->actingAs($user)
            ->get('/admin/home-finder')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/HomeFinder')
                ->has('destinations', 1)
                ->where('destinations.0.name.en', 'Bamiyan Valley')
                ->has('travelStyles', 0)
                ->has('seasons', 0)
                ->has('groupTypes', 0));
    }

    public function test_admin_can_create_home_finder_option(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/filter-placement', [
                'type' => 'destination',
                'name' => $this->translation('Kabul & around'),
                'status' => 'Published',
            ])
            ->assertRedirect(route('admin.home-finder.index'))
            ->assertSessionHas('success');

        $option = TourFilterOption::query()->first();

        $this->assertNotNull($option);
        $this->assertSame(TourFilterOptionType::Destination, $option->type);
        $this->assertSame('Kabul & around', Translatable::resolve($option->name));
    }

    public function test_guest_cannot_view_home_finder(): void
    {
        $this->get('/admin/home-finder')->assertRedirect(route('admin.login'));
    }
}
