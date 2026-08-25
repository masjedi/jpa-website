<?php

namespace Tests\Feature;

use App\Enums\TestimonialStatus;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTestimonialsTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_admin_can_view_testimonials_index(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/admin/testimonials')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/Testimonials'));
    }

    public function test_admin_can_create_update_and_delete_testimonial(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/testimonials', [
                'name' => 'Elena M.',
                'journey' => 'Bamiyan Heritage Circuit, 2025',
                'text' => 'The guide’s knowledge turned every site into a story.',
                'rating' => 5,
                'status' => 'Published',
            ])
            ->assertRedirect(route('admin.testimonials.index'))
            ->assertSessionHas('success');

        $testimonial = Testimonial::query()->first();

        $this->assertNotNull($testimonial);
        $this->assertSame('Elena M.', $testimonial->name);
        $this->assertSame(TestimonialStatus::Published, $testimonial->status);
        $this->assertSame(1, $testimonial->sort_order);

        $this->actingAs($user)
            ->patch("/admin/testimonials/{$testimonial->id}", [
                'name' => 'Elena M.',
                'journey' => 'Bamiyan Heritage Circuit, 2026',
                'text' => 'Updated quote from the traveller.',
                'rating' => 4,
                'status' => 'Draft',
            ])
            ->assertRedirect(route('admin.testimonials.index'));

        $testimonial->refresh();

        $this->assertSame(TestimonialStatus::Draft, $testimonial->status);
        $this->assertSame('Updated quote from the traveller.', $testimonial->text);

        $this->actingAs($user)
            ->delete("/admin/testimonials/{$testimonial->id}")
            ->assertRedirect(route('admin.testimonials.index'));

        $this->assertDatabaseMissing('testimonials', ['id' => $testimonial->id]);
    }

    public function test_homepage_only_loads_published_testimonials(): void
    {
        Testimonial::query()->create([
            'status' => TestimonialStatus::Published,
            'name' => 'Marcus T.',
            'journey' => 'Kabul & Panjshir Discovery, 2025',
            'text' => 'Responsive planning and honest advice.',
            'rating' => 5,
            'sort_order' => 1,
        ]);

        Testimonial::query()->create([
            'status' => TestimonialStatus::Draft,
            'name' => 'Draft traveller',
            'journey' => 'Draft journey',
            'text' => 'Draft quote.',
            'rating' => 3,
            'sort_order' => 2,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Home')
                ->loadDeferredProps(fn ($reload) => $reload
                    ->has('testimonials', 1)
                    ->where('testimonials.0.name', 'Marcus T.')
                    ->where('testimonials.0.rating', 5)));
    }

    public function test_testimonial_validation_requires_core_fields(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/testimonials', [
                'name' => '',
                'journey' => '',
                'text' => '',
                'rating' => 0,
                'status' => 'Draft',
            ])
            ->assertSessionHasErrors(['name', 'journey', 'text', 'rating']);
    }
}
