<?php

namespace Tests\Feature\Admin;

use App\Enums\TourListingStatus;
use App\Enums\TourListingType;
use App\Models\Tour;
use App\Models\User;
use App\Support\Translatable;
use Database\Seeders\TourFilterOptionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ToursTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        if (! extension_loaded('gd')) {
            $this->markTestSkipped('GD extension is required for tour cover upload tests.');
        }

        Storage::fake('public');
        $this->seed(TourFilterOptionSeeder::class);
    }

    public function test_authenticated_admin_can_view_tours_index(): void
    {
        $user = User::factory()->create();
        $tour = $this->createTourRecord();

        $this->actingAs($user)
            ->get('/admin/tours')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/Tours')
                ->has('offers', 1)
                ->has('filterOptions.regions')
                ->has('filterOptions.travelStyles')
                ->has('filterOptions.difficulties')
                ->where('offers.0.id', $tour->id)
                ->where('offers.0.title.en', 'Bamiyan Heritage Circuit'));
    }

    public function test_authenticated_admin_can_create_update_and_delete_tour(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/tours', $this->validTourPayload())
            ->assertRedirect(route('admin.tours.index'));

        $tour = Tour::query()->firstOrFail();

        $this->assertDatabaseHas('tours', [
            'id' => $tour->id,
            'listing_type' => TourListingType::Tour->value,
            'status' => TourListingStatus::Draft->value,
            'slug' => 'bamiyan-heritage-circuit',
        ]);

        $this->assertSame('Bamiyan Heritage Circuit', Translatable::resolve($tour->fresh()->title));

        $this->assertNotNull($tour->cover_media);

        $this->actingAs($user)
            ->patch("/admin/tours/{$tour->id}", array_merge($this->validTourPayload(), [
                'title' => Translatable::normalize('Updated Heritage Circuit'),
                'status' => 'Published',
            ]))
            ->assertRedirect(route('admin.tours.index'));

        $this->assertDatabaseHas('tours', [
            'id' => $tour->id,
            'status' => TourListingStatus::Published->value,
            'slug' => 'updated-heritage-circuit',
        ]);

        $this->assertSame('Updated Heritage Circuit', Translatable::resolve($tour->fresh()->title));

        $this->actingAs($user)
            ->delete("/admin/tours/{$tour->id}")
            ->assertRedirect(route('admin.tours.index'));

        $this->assertDatabaseMissing('tours', [
            'id' => $tour->id,
        ]);
    }

    public function test_authenticated_admin_can_create_package_listing(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/tours', $this->validPackagePayload())
            ->assertRedirect(route('admin.tours.index'));

        $this->assertDatabaseHas('tours', [
            'listing_type' => TourListingType::Package->value,
            'is_popular' => true,
        ]);

        $package = Tour::query()->firstOrFail();
        $this->assertSame('Afghanistan Essentials Package', Translatable::resolve($package->title));
        $this->assertSame('Seven days across Kabul, Bamiyan, and Herat.', Translatable::resolve($package->tagline));
    }

    public function test_authenticated_admin_can_update_and_delete_package(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/tours', $this->validPackagePayload())
            ->assertRedirect(route('admin.tours.index'));

        $package = Tour::query()->firstOrFail();

        $payload = $this->validPackagePayload();
        unset($payload['cover_image']);
        $payload['title'] = Translatable::normalize('Updated Essentials Package');
        $payload['price_estimate'] = Translatable::normalize('From $2,100 / person');
        $payload['status'] = 'Published';

        $this->actingAs($user)
            ->patch("/admin/tours/{$package->id}", $payload)
            ->assertRedirect(route('admin.tours.index'));

        $this->assertDatabaseHas('tours', [
            'id' => $package->id,
            'status' => TourListingStatus::Published->value,
            'slug' => 'updated-essentials-package',
        ]);

        $package->refresh();
        $this->assertSame('Updated Essentials Package', Translatable::resolve($package->title));
        $this->assertSame('From $2,100 / person', Translatable::resolve($package->price_estimate));

        $this->actingAs($user)
            ->delete("/admin/tours/{$package->id}")
            ->assertRedirect(route('admin.tours.index'));

        $this->assertDatabaseMissing('tours', [
            'id' => $package->id,
        ]);
    }

    public function test_guest_cannot_manage_tours(): void
    {
        $tour = $this->createTourRecord();

        $this->get('/admin/tours')->assertRedirect(route('admin.login'));

        $this->post('/admin/tours', $this->validTourPayload())
            ->assertRedirect(route('admin.login'));

        $this->patch("/admin/tours/{$tour->id}", $this->validTourPayload())
            ->assertRedirect(route('admin.login'));

        $this->delete("/admin/tours/{$tour->id}")
            ->assertRedirect(route('admin.login'));
    }

    public function test_tour_update_without_new_cover_image(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/tours', $this->validTourPayload())
            ->assertRedirect(route('admin.tours.index'));

        $tour = Tour::query()->firstOrFail();
        $originalCover = $tour->cover_media;

        $payload = $this->validTourPayload();
        unset($payload['cover_image']);
        $payload['title'] = Translatable::normalize('Updated without new cover');

        $this->actingAs($user)
            ->patch("/admin/tours/{$tour->id}", $payload)
            ->assertRedirect(route('admin.tours.index'));

        $tour->refresh();

        $this->assertSame('Updated without new cover', Translatable::resolve($tour->title));
        $this->assertSame($originalCover, $tour->cover_media);
    }

    public function test_tour_create_requires_cover_image(): void
    {
        $user = User::factory()->create();
        $payload = $this->validTourPayload();
        unset($payload['cover_image']);

        $this->actingAs($user)
            ->post('/admin/tours', $payload)
            ->assertSessionHasErrors('cover_image');
    }

    /**
     * @return array<string, mixed>
     */
    private function validTourPayload(): array
    {
        return [
            'listing_type' => 'tour',
            'title' => Translatable::normalize('Bamiyan Heritage Circuit'),
            'tagline' => Translatable::normalize(''),
            'summary' => Translatable::normalize('Buddha niches, Shahr-e Gholghola, and Band-e Amir lakes.'),
            'destination' => Translatable::normalize('Bamiyan & Central Highlands'),
            'region' => 'Central Highlands',
            'duration_days' => 7,
            'travel_style' => 'Cultural & Heritage',
            'difficulty' => 'Moderate',
            'badge' => Translatable::normalize('Top pick'),
            'content' => Translatable::normalize('<p>Detailed tour content.</p>'),
            'highlights_text' => [
                'en' => "Band-e Amir lakes\nBuddha niches walk",
                'fa' => '',
                'ps' => '',
            ],
            'key_destinations_text' => ['en' => '', 'fa' => '', 'ps' => ''],
            'included_services_text' => [
                'en' => "Private 4WD transport\nEnglish-speaking guide",
                'fa' => '',
                'ps' => '',
            ],
            'price_estimate' => Translatable::normalize(''),
            'ideal_for' => Translatable::normalize(''),
            'is_popular' => '0',
            'status' => 'Draft',
            'cover_image' => $this->makeCoverUpload(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function validPackagePayload(): array
    {
        return [
            'listing_type' => 'package',
            'title' => Translatable::normalize('Afghanistan Essentials Package'),
            'tagline' => Translatable::normalize('Seven days across Kabul, Bamiyan, and Herat.'),
            'summary' => Translatable::normalize('A balanced first journey through Afghanistan.'),
            'destination' => Translatable::normalize('Kabul'),
            'region' => 'Multiple Regions',
            'duration_days' => 7,
            'travel_style' => 'Cultural & Heritage',
            'difficulty' => 'Moderate',
            'badge' => Translatable::normalize('Package'),
            'content' => Translatable::normalize(''),
            'highlights_text' => [
                'en' => "Curated route\nLocal guides",
                'fa' => '',
                'ps' => '',
            ],
            'key_destinations_text' => [
                'en' => "Kabul\nBamiyan\nHerat",
                'fa' => '',
                'ps' => '',
            ],
            'included_services_text' => [
                'en' => "Airport transfers\nDaily breakfast",
                'fa' => '',
                'ps' => '',
            ],
            'price_estimate' => Translatable::normalize('From $1,890 / person'),
            'ideal_for' => Translatable::normalize('First-time visitors'),
            'is_popular' => '1',
            'status' => 'Draft',
            'cover_image' => $this->makeCoverUpload(),
        ];
    }

    private function createTourRecord(): Tour
    {
        return Tour::query()->create([
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
        ]);
    }

    private function makeCoverUpload(): UploadedFile
    {
        $source = imagecreatetruecolor(1200, 800);
        $this->assertNotFalse($source);
        imagefilledrectangle($source, 0, 0, 1199, 799, imagecolorallocate($source, 30, 90, 140));

        $tempPath = tempnam(sys_get_temp_dir(), 'tour-cover-');
        $this->assertNotFalse($tempPath);
        $jpegPath = $tempPath.'.jpg';
        imagejpeg($source, $jpegPath, 85);
        imagedestroy($source);

        return new UploadedFile($jpegPath, 'cover.jpg', 'image/jpeg', null, true);
    }
}
