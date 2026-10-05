<?php

namespace Tests\Feature\Admin;

use App\Enums\ServiceOfferingCategory;
use App\Enums\ServiceOfferingStatus;
use App\Models\ServiceOffering;
use App\Models\User;
use App\Support\Translatable;
use Database\Seeders\ServiceOfferingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServicesTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_admin_can_view_services_index(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/admin/services')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/Services')
                ->has('items', 0)
                ->has('iconOptions')
                ->has('categoryOptions'));
    }

    public function test_admin_can_create_update_and_delete_service_offering(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/services', $this->payload([
                'title' => $this->translation('Guided tours'),
                'status' => 'Published',
                'is_featured' => '1',
                'show_on_home' => '1',
            ]))
            ->assertRedirect(route('admin.services.index'))
            ->assertSessionHas('success');

        $offering = ServiceOffering::query()->first();

        $this->assertNotNull($offering);
        $this->assertSame('Guided tours', Translatable::resolve($offering->title));
        $this->assertSame('guided-tours', $offering->slug);
        $this->assertSame(ServiceOfferingCategory::Journey, $offering->category);
        $this->assertSame(ServiceOfferingStatus::Published, $offering->status);
        $this->assertTrue($offering->is_featured);
        $this->assertTrue($offering->show_on_home);
        $this->assertSame(1, $offering->sort_order);
        $this->assertSame([
            'English-speaking Afghan lead guide',
            'Permits and regional logistics included',
        ], Translatable::resolveStringList($offering->features));

        $this->actingAs($user)
            ->patch("/admin/services/{$offering->id}", $this->payload([
                'title' => $this->translation('Small-group guided tours'),
                'status' => 'Draft',
                'is_featured' => '0',
                'show_on_home' => '0',
            ]))
            ->assertRedirect(route('admin.services.index'));

        $offering->refresh();

        $this->assertSame('Small-group guided tours', Translatable::resolve($offering->title));
        $this->assertSame('small-group-guided-tours', $offering->slug);
        $this->assertSame(ServiceOfferingStatus::Draft, $offering->status);
        $this->assertFalse($offering->is_featured);
        $this->assertFalse($offering->show_on_home);

        $this->actingAs($user)
            ->delete("/admin/services/{$offering->id}")
            ->assertRedirect(route('admin.services.index'));

        $this->assertDatabaseMissing('service_offerings', ['id' => $offering->id]);
    }

    public function test_service_slug_must_be_unique(): void
    {
        $user = User::factory()->create();

        $this->createOffering(['slug' => 'guided-tours', 'title' => Translatable::normalize('Guided tours')]);

        $this->actingAs($user)
            ->post('/admin/services', $this->payload([
                'title' => $this->translation('Guided tours'),
            ]))
            ->assertSessionHasErrors('slug');
    }

    public function test_public_services_page_only_loads_published_offerings(): void
    {
        $this->createOffering([
            'slug' => 'guided-tours',
            'title' => Translatable::normalize('Guided tours'),
            'status' => ServiceOfferingStatus::Published,
            'is_featured' => true,
        ]);

        $this->createOffering([
            'slug' => 'draft-service',
            'title' => Translatable::normalize('Draft service'),
            'status' => ServiceOfferingStatus::Draft,
        ]);

        $this->get('/services')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Services')
                ->has('offerings', 1)
                ->where('offerings.0.title', 'Guided tours')
                ->where('offerings.0.isFeatured', true));
    }

    public function test_homepage_only_loads_published_home_services(): void
    {
        $this->createOffering([
            'slug' => 'guided-tours',
            'title' => Translatable::normalize('Guided tours'),
            'tagline' => Translatable::normalize('Small-group journeys with experienced local guides.'),
            'status' => ServiceOfferingStatus::Published,
            'show_on_home' => true,
        ]);

        $this->createOffering([
            'slug' => 'visa-permits',
            'title' => Translatable::normalize('Visa & permit support'),
            'status' => ServiceOfferingStatus::Published,
            'show_on_home' => false,
        ]);

        $this->createOffering([
            'slug' => 'draft-home',
            'title' => Translatable::normalize('Draft home service'),
            'status' => ServiceOfferingStatus::Draft,
            'show_on_home' => true,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Home')
                ->has('homeServices', 1)
                ->where('homeServices.0.title', 'Guided tours')
                ->where('homeServices.0.description', 'Small-group journeys with experienced local guides.'));
    }

    public function test_seeder_populates_public_services_catalogue(): void
    {
        $this->seed(ServiceOfferingSeeder::class);

        $this->get('/services')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Services')
                ->has('offerings', 8));

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Home')
                ->has('homeServices', 6));
    }

    public function test_guest_cannot_manage_services(): void
    {
        $offering = $this->createOffering();

        $this->get('/admin/services')->assertRedirect(route('admin.login'));

        $this->post('/admin/services', $this->payload())->assertRedirect(route('admin.login'));

        $this->patch("/admin/services/{$offering->id}", $this->payload())
            ->assertRedirect(route('admin.login'));

        $this->delete("/admin/services/{$offering->id}")
            ->assertRedirect(route('admin.login'));
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(array $overrides = []): array
    {
        return array_merge([
            'title' => $this->translation('Guided tours'),
            'slug' => '',
            'tagline' => $this->translation('Small-group journeys with experienced local guides.'),
            'description' => $this->translation('Join curated departures across Bamiyan, Herat and Kabul.'),
            'category' => 'Journey',
            'icon_key' => 'users',
            'features_text' => $this->stringListText("English-speaking Afghan lead guide\nPermits and regional logistics included"),
            'is_featured' => '0',
            'show_on_home' => '0',
            'status' => 'Published',
        ], $overrides);
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function createOffering(array $overrides = []): ServiceOffering
    {
        return ServiceOffering::query()->create(array_merge([
            'status' => ServiceOfferingStatus::Published,
            'title' => Translatable::normalize('Guided tours'),
            'slug' => 'guided-tours',
            'tagline' => Translatable::normalize('Small-group journeys with experienced local guides.'),
            'description' => Translatable::normalize('Join curated departures across Bamiyan, Herat and Kabul.'),
            'category' => ServiceOfferingCategory::Journey,
            'icon_key' => 'users',
            'features' => Translatable::normalizeStringListStorage([
                'English-speaking Afghan lead guide',
                'Permits and regional logistics included',
            ]),
            'is_featured' => false,
            'show_on_home' => false,
            'sort_order' => 1,
        ], $overrides));
    }
}
