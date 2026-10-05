<?php

namespace Tests\Feature\Admin;

use App\Enums\HeroSlideStatus;
use App\Models\HeroSection;
use App\Models\HeroSlide;
use App\Models\User;
use App\Support\Media\HeroSlideImage;
use App\Support\Translatable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class HeroSectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_admin_can_view_hero_section(): void
    {
        $user = User::factory()->create();
        $section = HeroSection::current();
        $slide = $section->slides()->create([
            'title' => Translatable::normalize('Published headline'),
            'subtitle' => Translatable::normalize('Published subtitle copy.'),
            'status' => HeroSlideStatus::Published,
            'sort_order' => 1,
        ]);
        $slide->update([
            'image_media' => $this->storeHeroImageMedia(),
        ]);

        $this->actingAs($user)
            ->get('/admin/hero-section')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/HeroSection')
                ->where('eyebrow', Translatable::normalize($section->eyebrow))
                ->has('slides', 1)
                ->where('slides.0.title', Translatable::normalize('Published headline'))
                ->where('slides.0.imageThumbUrl', fn ($url) => is_string($url) && $url !== ''));
    }

    public function test_authenticated_admin_can_update_hero_eyebrow(): void
    {
        $user = User::factory()->create();
        $section = HeroSection::current();

        $this->actingAs($user)
            ->patch('/admin/hero-section', [
                'eyebrow' => Translatable::normalize('Updated hero eyebrow'),
            ])
            ->assertRedirect(route('admin.hero-section.index'));

        $section->refresh();

        $this->assertSame('Updated hero eyebrow', Translatable::resolve($section->eyebrow));
    }

    public function test_authenticated_admin_can_create_update_and_delete_hero_slide(): void
    {
        $user = User::factory()->create();
        HeroSection::current();

        $this->actingAs($user)
            ->post('/admin/hero-section/slides', [
                'title' => Translatable::normalize('New slide title'),
                'subtitle' => Translatable::normalize('New slide subtitle.'),
                'status' => 'Draft',
                'hero_image' => $this->makeHeroImageUpload(),
            ])
            ->assertRedirect(route('admin.hero-section.index'));

        $slide = HeroSlide::query()->firstOrFail();

        $this->assertSame('New slide title', Translatable::resolve($slide->title));
        $this->assertSame(HeroSlideStatus::Draft, $slide->status);
        $this->assertSame(1, $slide->sort_order);
        $this->assertNotNull($slide->image_media);

        $this->actingAs($user)
            ->patch("/admin/hero-section/slides/{$slide->id}", [
                'title' => Translatable::normalize('Updated slide title'),
                'subtitle' => Translatable::normalize('Updated slide subtitle.'),
                'status' => 'Published',
            ])
            ->assertRedirect(route('admin.hero-section.index'));

        $slide->refresh();

        $this->assertSame('Updated slide title', Translatable::resolve($slide->title));
        $this->assertSame(HeroSlideStatus::Published, $slide->status);

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
            'title' => Translatable::normalize('Protected slide'),
            'subtitle' => Translatable::normalize('Protected subtitle.'),
            'status' => HeroSlideStatus::Draft,
            'sort_order' => 1,
        ]);

        $this->patch('/admin/hero-section', [
            'eyebrow' => Translatable::normalize('Blocked'),
        ])->assertRedirect(route('admin.login'));

        $this->post('/admin/hero-section/slides', [
            'title' => Translatable::normalize('Blocked'),
            'subtitle' => Translatable::normalize('Blocked'),
            'status' => 'Draft',
            'hero_image' => $this->makeHeroImageUpload(),
        ])->assertRedirect(route('admin.login'));

        $this->patch("/admin/hero-section/slides/{$slide->id}", [
            'title' => Translatable::normalize('Blocked'),
            'subtitle' => Translatable::normalize('Blocked'),
            'status' => 'Draft',
        ])->assertRedirect(route('admin.login'));

        $this->delete("/admin/hero-section/slides/{$slide->id}")
            ->assertRedirect(route('admin.login'));
    }

    public function test_homepage_receives_only_published_hero_slides(): void
    {
        $section = HeroSection::current();
        $section->update(['eyebrow' => Translatable::normalize('Homepage eyebrow')]);

        $published = $section->slides()->create([
            'title' => Translatable::normalize('Published slide'),
            'subtitle' => Translatable::normalize('Visible on homepage.'),
            'status' => HeroSlideStatus::Published,
            'sort_order' => 1,
        ]);
        $published->update(['image_media' => $this->storeHeroImageMedia()]);

        $section->slides()->create([
            'title' => Translatable::normalize('Draft slide'),
            'subtitle' => Translatable::normalize('Hidden from homepage.'),
            'status' => HeroSlideStatus::Draft,
            'sort_order' => 2,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Home')
                ->where('hero.eyebrow', 'Homepage eyebrow')
                ->has('hero.slides', 1)
                ->where('hero.slides.0.title', 'Published slide')
                ->where('hero.slides.0.subtitle', 'Visible on homepage.')
                ->where('hero.slides.0.imageUrl', fn ($url) => is_string($url) && $url !== '')
                ->missing('hero.slides.0.status'));
    }

    public function test_homepage_receives_only_the_latest_three_published_slides(): void
    {
        $section = HeroSection::current();

        foreach ([1, 2, 3, 4] as $order) {
            $slide = $section->slides()->create([
                'title' => Translatable::normalize("Published slide {$order}"),
                'subtitle' => Translatable::normalize("Subtitle {$order}"),
                'status' => HeroSlideStatus::Published,
                'sort_order' => $order,
            ]);
            $slide->update(['image_media' => $this->storeHeroImageMedia()]);
        }

        $section->slides()->create([
            'title' => Translatable::normalize('Draft slide'),
            'subtitle' => Translatable::normalize('Should stay hidden.'),
            'status' => HeroSlideStatus::Draft,
            'sort_order' => 5,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Home')
                ->has('hero.slides', 3)
                ->where('hero.slides.0.title', 'Published slide 4')
                ->where('hero.slides.1.title', 'Published slide 3')
                ->where('hero.slides.2.title', 'Published slide 2'));
    }

    /**
     * @return array<string, mixed>
     */
    private function storeHeroImageMedia(): array
    {
        return app(HeroSlideImage::class)
            ->store($this->makeHeroImageUpload())
            ->toArray();
    }

    private function makeHeroImageUpload(): UploadedFile
    {
        $source = imagecreatetruecolor(3840, 2160);
        $this->assertNotFalse($source);
        imagefilledrectangle($source, 0, 0, 3839, 2159, imagecolorallocate($source, 22, 59, 92));

        $tempPath = tempnam(sys_get_temp_dir(), 'hero-');
        $this->assertNotFalse($tempPath);
        $jpegPath = $tempPath.'.jpg';
        imagejpeg($source, $jpegPath, 85);
        imagedestroy($source);

        return new UploadedFile($jpegPath, 'hero-slide.jpg', 'image/jpeg', null, true);
    }
}
