<?php

namespace Tests\Feature\Admin;

use App\Enums\TourFilterOptionStatus;
use App\Enums\TourFilterOptionType;
use App\Enums\TourListingStatus;
use App\Enums\TourListingType;
use App\Models\Tour;
use App\Models\TourFilterOption;
use App\Models\User;
use App\Support\Translatable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FilterPlacementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_admin_can_view_filter_placement_index(): void
    {
        $user = User::factory()->create();

        TourFilterOption::query()->create([
            'type' => TourFilterOptionType::Region,
            'name' => 'Central Highlands',
            'status' => TourFilterOptionStatus::Published,
            'sort_order' => 1,
        ]);

        $this->actingAs($user)
            ->get('/admin/filter-placement')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/FilterPlacement')
                ->has('regions', 1)
                ->where('regions.0.name.en', 'Central Highlands')
                ->has('travelStyles', 0)
                ->has('difficulties', 0));
    }

    public function test_admin_can_create_update_and_delete_filter_option(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/filter-placement', [
                'type' => 'region',
                'name' => $this->translation('Wakhan Corridor'),
                'status' => 'Published',
            ])
            ->assertRedirect(route('admin.filter-placement.index'))
            ->assertSessionHas('success');

        $option = TourFilterOption::query()->first();

        $this->assertNotNull($option);
        $this->assertSame('Wakhan Corridor', Translatable::resolve($option->name));
        $this->assertSame('Wakhan Corridor', $option->value);
        $this->assertSame(TourFilterOptionType::Region, $option->type);
        $this->assertSame(TourFilterOptionStatus::Published, $option->status);
        $this->assertSame(1, $option->sort_order);

        $this->actingAs($user)
            ->patch("/admin/filter-placement/{$option->id}", [
                'type' => 'region',
                'name' => $this->translation('Wakhan & Pamir'),
                'status' => 'Draft',
            ])
            ->assertRedirect(route('admin.filter-placement.index'));

        $option->refresh();

        $this->assertSame('Wakhan & Pamir', Translatable::resolve($option->name));
        $this->assertSame('Wakhan Corridor', $option->value);
        $this->assertSame(TourFilterOptionStatus::Draft, $option->status);

        $this->actingAs($user)
            ->delete("/admin/filter-placement/{$option->id}")
            ->assertRedirect(route('admin.filter-placement.index'));

        $this->assertDatabaseMissing('tour_filter_options', ['id' => $option->id]);
    }

    public function test_filter_option_name_must_be_unique_within_type(): void
    {
        $user = User::factory()->create();

        TourFilterOption::query()->create([
            'type' => TourFilterOptionType::Region,
            'name' => 'Central Highlands',
            'status' => TourFilterOptionStatus::Published,
            'sort_order' => 1,
        ]);

        $this->actingAs($user)
            ->post('/admin/filter-placement', [
                'type' => 'region',
                'name' => $this->translation('Central Highlands'),
                'status' => 'Published',
            ])
            ->assertSessionHasErrors('value');

        $this->actingAs($user)
            ->post('/admin/filter-placement', [
                'type' => 'travelStyle',
                'name' => $this->translation('Central Highlands'),
                'status' => 'Published',
            ])
            ->assertRedirect(route('admin.filter-placement.index'));
    }

    public function test_renaming_a_filter_option_updates_existing_tours(): void
    {
        $user = User::factory()->create();

        $option = TourFilterOption::query()->create([
            'type' => TourFilterOptionType::Region,
            'name' => 'Central Highlands',
            'status' => TourFilterOptionStatus::Published,
            'sort_order' => 1,
        ]);

        $tour = $this->createTourRecord(['region' => 'Central Highlands']);

        $this->actingAs($user)
            ->patch("/admin/filter-placement/{$option->id}", [
                'type' => 'region',
                'name' => $this->translation('Highland Core'),
                'status' => 'Published',
            ])
            ->assertRedirect(route('admin.filter-placement.index'));

        $option->refresh();

        $this->assertSame('Highland Core', Translatable::resolve($option->name));
        $this->assertSame('Central Highlands', $option->value);
        $this->assertSame('Central Highlands', $tour->refresh()->region);
    }

    public function test_filter_option_used_by_tours_cannot_be_deleted(): void
    {
        $user = User::factory()->create();

        $option = TourFilterOption::query()->create([
            'type' => TourFilterOptionType::Difficulty,
            'name' => 'Moderate',
            'status' => TourFilterOptionStatus::Published,
            'sort_order' => 1,
        ]);

        $this->createTourRecord(['difficulty' => 'Moderate']);

        $this->actingAs($user)
            ->delete("/admin/filter-placement/{$option->id}")
            ->assertRedirect(route('admin.filter-placement.index'))
            ->assertSessionHas('error');

        $this->assertDatabaseHas('tour_filter_options', ['id' => $option->id]);
    }

    public function test_guest_cannot_manage_filter_placement(): void
    {
        $option = TourFilterOption::query()->create([
            'type' => TourFilterOptionType::Region,
            'name' => 'Central Highlands',
            'status' => TourFilterOptionStatus::Published,
            'sort_order' => 1,
        ]);

        $this->get('/admin/filter-placement')->assertRedirect(route('admin.login'));

        $this->post('/admin/filter-placement', [
            'type' => 'region',
            'name' => $this->translation('Southern Plains'),
            'status' => 'Published',
        ])->assertRedirect(route('admin.login'));

        $this->patch("/admin/filter-placement/{$option->id}", [
            'type' => 'region',
            'name' => $this->translation('Updated'),
            'status' => 'Published',
        ])->assertRedirect(route('admin.login'));

        $this->delete("/admin/filter-placement/{$option->id}")
            ->assertRedirect(route('admin.login'));
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function createTourRecord(array $overrides = []): Tour
    {
        return Tour::query()->create(array_merge([
            'slug' => 'existing-tour',
            'listing_type' => TourListingType::Tour,
            'status' => TourListingStatus::Published,
            'title' => Translatable::normalize('Bamiyan Heritage Circuit'),
            'summary' => Translatable::normalize('Summary copy.'),
            'destination' => Translatable::normalize('Bamiyan'),
            'region' => 'Central Highlands',
            'duration_days' => 7,
            'duration_label' => Translatable::normalize('7 Days / 6 Nights'),
            'travel_style' => 'Cultural & Heritage',
            'difficulty' => 'Moderate',
            'highlights' => Translatable::normalizeStringListStorage(['Highlight one']),
            'content' => Translatable::normalize('<p>Content</p>'),
            'inclusions' => Translatable::normalizeStringListStorage(['Guide']),
            'estimated_starting_price' => Translatable::normalize('Custom inquiry basis'),
            'next_departure_date' => Translatable::normalize('On request'),
            'next_departure_status' => Translatable::normalize('Open for Inquiries'),
            'cover_media' => null,
        ], $overrides));
    }
}
