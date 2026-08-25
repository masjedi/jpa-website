<?php

namespace Tests\Feature;

use App\Enums\AboutJourneyStepStatus;
use App\Models\AboutJourneyStep;
use App\Models\AboutPage;
use App\Models\User;
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
                'intro_eyebrow' => 'JPA Tours',
                'intro_title' => 'Our story',
                'intro_description' => 'Updated intro copy.',
                'mission_section_eyebrow' => 'JPA',
                'mission_section_title' => 'Mission & Vision',
                'mission_title' => 'Mission',
                'mission_description' => 'Updated mission.',
                'vision_title' => 'Vision',
                'vision_description' => 'Updated vision.',
                'cta_eyebrow' => 'Plan now',
                'cta_title' => 'Ready to travel?',
                'cta_description' => 'Updated CTA.',
                'cta_primary_label' => 'Contact us',
                'cta_primary_href' => '/contact',
                'cta_secondary_label' => 'View tours',
                'cta_secondary_href' => '/tours',
            ])
            ->assertRedirect(route('admin.about.index'))
            ->assertSessionHas('success');

        $this->assertDatabaseHas('about_pages', [
            'intro_title' => 'Our story',
            'cta_title' => 'Ready to travel?',
        ]);
    }

    public function test_admin_can_create_update_and_delete_journey_step(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/about/journey-steps', [
                'title' => 'Local guiding roots',
                'description' => 'We began guiding researchers and photographers.',
                'image_alt' => 'Mountain landscape',
                'icon_key' => 'compass',
                'status' => 'Published',
                'image' => $this->makeJourneyUpload(),
            ])
            ->assertRedirect(route('admin.about.index'))
            ->assertSessionHas('success');

        $step = AboutJourneyStep::query()->first();

        $this->assertNotNull($step);
        $this->assertSame('Local guiding roots', $step->title);
        $this->assertSame(AboutJourneyStepStatus::Published, $step->status);
        $this->assertNotNull($step->image_media);

        $this->actingAs($user)
            ->patch("/admin/about/journey-steps/{$step->id}", [
                'title' => 'Updated guiding roots',
                'description' => 'Updated description.',
                'image_alt' => 'Updated alt text',
                'icon_key' => 'users',
                'status' => 'Draft',
            ])
            ->assertRedirect(route('admin.about.index'));

        $step->refresh();

        $this->assertSame(AboutJourneyStepStatus::Draft, $step->status);
        $this->assertSame('Updated guiding roots', $step->title);

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
            'title' => 'Published step',
            'description' => 'Published description.',
            'image_media' => null,
            'image_alt' => 'Published image',
            'icon_key' => 'compass',
            'sort_order' => 1,
        ]);

        AboutJourneyStep::query()->create([
            'status' => AboutJourneyStepStatus::Draft,
            'title' => 'Draft step',
            'description' => 'Draft description.',
            'image_media' => null,
            'image_alt' => 'Draft image',
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
