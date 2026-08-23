<?php

namespace Tests\Feature\Admin;

use App\Enums\HeroSlideStatus;
use App\Models\HeroSection;
use App\Models\HeroSlide;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HeroSectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_admin_can_view_hero_section(): void
    {
        $user = User::factory()->create();
        $section = HeroSection::current();
        $section->slides()->create([
            'title' => 'Published headline',
            'subtitle' => 'Published subtitle copy.',
            'status' => HeroSlideStatus::Published,
            'sort_order' => 1,
        ]);

        $this->actingAs($user)
            ->get('/admin/hero-section')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/HeroSection')
                ->where('eyebrow', $section->eyebrow)
                ->has('slides', 1)
                ->where('slides.0.title', 'Published headline'));
    }

    public function test_authenticated_admin_can_update_hero_eyebrow(): void
    {
        $user = User::factory()->create();
        HeroSection::current();

        $this->actingAs($user)
            ->patch('/admin/hero-section', [
                'eyebrow' => 'Updated hero eyebrow',
            ])
            ->assertRedirect(route('admin.hero-section.index'));

        $this->assertDatabaseHas('hero_sections', [
            'eyebrow' => 'Updated hero eyebrow',
        ]);
    }

    public function test_authenticated_admin_can_create_update_and_delete_hero_slide(): void
    {
        $user = User::factory()->create();
        HeroSection::current();

        $this->actingAs($user)
            ->post('/admin/hero-section/slides', [
                'title' => 'New slide title',
                'subtitle' => 'New slide subtitle.',
                'status' => 'Draft',
            ])
            ->assertRedirect(route('admin.hero-section.index'));

        $slide = HeroSlide::query()->firstOrFail();

        $this->assertDatabaseHas('hero_slides', [
            'id' => $slide->id,
            'title' => 'New slide title',
            'status' => HeroSlideStatus::Draft->value,
            'sort_order' => 1,
        ]);

        $this->actingAs($user)
            ->patch("/admin/hero-section/slides/{$slide->id}", [
                'title' => 'Updated slide title',
                'subtitle' => 'Updated slide subtitle.',
                'status' => 'Published',
            ])
            ->assertRedirect(route('admin.hero-section.index'));

        $this->assertDatabaseHas('hero_slides', [
            'id' => $slide->id,
            'title' => 'Updated slide title',
            'status' => HeroSlideStatus::Published->value,
        ]);

        $this->actingAs($user)
            ->delete("/admin/hero-section/slides/{$slide->id}")
            ->assertRedirect(route('admin.hero-section.index'));

        $this->assertDatabaseMissing('hero_slides', [
            'id' => $slide->id,
        ]);
    }

    public function test_guest_cannot_manage_hero_section(): void
    {
        $slide = HeroSection::current()->slides()->create([
            'title' => 'Protected slide',
            'subtitle' => 'Protected subtitle.',
            'status' => HeroSlideStatus::Draft,
            'sort_order' => 1,
        ]);

        $this->patch('/admin/hero-section', ['eyebrow' => 'Blocked'])
            ->assertRedirect(route('admin.login'));

        $this->post('/admin/hero-section/slides', [
            'title' => 'Blocked',
            'subtitle' => 'Blocked',
            'status' => 'Draft',
        ])->assertRedirect(route('admin.login'));

        $this->patch("/admin/hero-section/slides/{$slide->id}", [
            'title' => 'Blocked',
            'subtitle' => 'Blocked',
            'status' => 'Draft',
        ])->assertRedirect(route('admin.login'));

        $this->delete("/admin/hero-section/slides/{$slide->id}")
            ->assertRedirect(route('admin.login'));
    }

    public function test_homepage_receives_only_published_hero_slides(): void
    {
        $section = HeroSection::current();
        $section->update(['eyebrow' => 'Homepage eyebrow']);

        $section->slides()->createMany([
            [
                'title' => 'Published slide',
                'subtitle' => 'Visible on homepage.',
                'status' => HeroSlideStatus::Published,
                'sort_order' => 1,
            ],
            [
                'title' => 'Draft slide',
                'subtitle' => 'Hidden from homepage.',
                'status' => HeroSlideStatus::Draft,
                'sort_order' => 2,
            ],
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Home')
                ->where('hero.eyebrow', 'Homepage eyebrow')
                ->has('hero.slides', 1)
                ->where('hero.slides.0.title', 'Published slide')
                ->where('hero.slides.0.subtitle', 'Visible on homepage.')
                ->missing('hero.slides.0.status'));
    }
}
