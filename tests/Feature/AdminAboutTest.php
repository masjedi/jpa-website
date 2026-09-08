<?php

namespace Tests\Feature;

use App\Enums\AboutJourneyStepStatus;
use App\Models\AboutJourneyStep;
use App\Models\AboutPage;
use App\Models\User;
use App\Support\Translatable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminAboutTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        if (! extension_loaded('gd')) {
            $this->markTestSkipped('GD extension is required for about journey image upload tests.');
        }

        Storage::fake('public');
    }

    public function test_authenticated_admin_can_view_about_page_index(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/admin/about')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/About')
                ->has('content.intro')
                ->has('journeySteps'));
    }

    public function test_admin_can_update_about_page_content(): void
    {
        $user = User::factory()->create();
        AboutPage::current();

        $this->actingAs($user)
            ->patch('/admin/about', [
                'intro_eyebrow' => $this->translation('JPA Tours'),
                'intro_title' => $this->translation('Our story'),
                'intro_description' => $this->translation('Updated intro copy.'),
                'mission_section_eyebrow' => $this->translation('JPA'),
                'mission_section_title' => $this->translation('Mission & Vision'),
                'mission_title' => $this->translation('Mission'),
                'mission_description' => $this->translation('Updated mission.'),
                'vision_title' => $this->translation('Vision'),
                'vision_description' => $this->translation('Updated vision.'),
                'cta_eyebrow' => $this->translation('Plan now'),
                'cta_title' => $this->translation('Ready to travel?'),
                'cta_description' => $this->translation('Updated CTA.'),
                'cta_primary_label' => $this->translation('Contact us'),
                'cta_primary_href' => '/contact',
                'cta_secondary_label' => $this->translation('View tours'),
                'cta_secondary_href' => '/tours',
            ])
            ->assertRedirect(route('admin.about.index'))
            ->assertSessionHas('success');

        $page = AboutPage::query()->first();

        $this->assertNotNull($page);
        $this->assertSame('Our story', Translatable::resolve($page->intro_title));
        $this->assertSame('Ready to travel?', Translatable::resolve($page->cta_title));
    }

    public function test_admin_can_create_update_and_delete_journey_step(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/about/journey-steps', [
                'title' => $this->translation('Local guiding roots'),
                'description' => $this->translation('We began guiding researchers and photographers.'),
                'image_alt' => $this->translation('Mountain landscape'),
                'icon_key' => 'compass',
                'status' => 'Published',
                'image' => $this->makeJourneyUpload(),
            ])
            ->assertRedirect(route('admin.about.index'))
            ->assertSessionHas('success');

        $step = AboutJourneyStep::query()->first();

        $this->assertNotNull($step);
        $this->assertSame('Local guiding roots', Translatable::resolve($step->title));
        $this->assertSame(AboutJourneyStepStatus::Published, $step->status);
        $this->assertNotNull($step->image_media);

        $this->actingAs($user)
            ->patch("/admin/about/journey-steps/{$step->id}", [
                'title' => $this->translation('Updated guiding roots'),
                'description' => $this->translation('Updated description.'),
                'image_alt' => $this->translation('Updated alt text'),
                'icon_key' => 'users',
                'status' => 'Draft',
            ])
            ->assertRedirect(route('admin.about.index'));

        $step->refresh();

        $this->assertSame(AboutJourneyStepStatus::Draft, $step->status);
        $this->assertSame('Updated guiding roots', Translatable::resolve($step->title));

        $this->actingAs($user)
            ->delete("/admin/about/journey-steps/{$step->id}")
            ->assertRedirect(route('admin.about.index'));

        $this->assertDatabaseMissing('about_journey_steps', ['id' => $step->id]);
    }

    public function test_public_about_page_loads_published_journey_steps_only(): void
    {
        AboutPage::current();

        AboutJourneyStep::query()->create([
            'status' => AboutJourneyStepStatus::Published,
            'title' => Translatable::normalize('Published step'),
            'description' => Translatable::normalize('Published description.'),
            'image_media' => null,
            'image_alt' => Translatable::normalize('Published image'),
            'icon_key' => 'compass',
            'sort_order' => 1,
        ]);

        AboutJourneyStep::query()->create([
            'status' => AboutJourneyStepStatus::Draft,
            'title' => Translatable::normalize('Draft step'),
            'description' => Translatable::normalize('Draft description.'),
            'image_media' => null,
            'image_alt' => Translatable::normalize('Draft image'),
            'icon_key' => 'users',
            'sort_order' => 2,
        ]);

        $this->get('/about')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/About')
                ->where('content.intro.title', 'Our Journey')
                ->has('journeySteps', 1)
                ->where('journeySteps.0.title', 'Published step'));
    }

    private function makeJourneyUpload(): UploadedFile
    {
        $source = imagecreatetruecolor(1200, 900);
        $this->assertNotFalse($source);
        imagefilledrectangle($source, 0, 0, 1199, 899, imagecolorallocate($source, 30, 90, 140));

        $tempPath = tempnam(sys_get_temp_dir(), 'about-journey-');
        $this->assertNotFalse($tempPath);
        $jpegPath = $tempPath.'.jpg';
        imagejpeg($source, $jpegPath, 85);
        imagedestroy($source);

        return new UploadedFile($jpegPath, 'journey.jpg', 'image/jpeg', null, true);
    }
}
