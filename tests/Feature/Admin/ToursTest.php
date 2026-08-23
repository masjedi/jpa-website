<?php

namespace Tests\Feature\Admin;

use App\Enums\TourListingStatus;
use App\Enums\TourListingType;
use App\Models\Tour;
use App\Models\User;
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
                ->where('offers.0.id', $tour->id)
                ->where('offers.0.title', 'Bamiyan Heritage Circuit'));
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
            'title' => 'Bamiyan Heritage Circuit',
            'listing_type' => TourListingType::Tour->value,
            'status' => TourListingStatus::Draft->value,
            'slug' => 'bamiyan-heritage-circuit',
        ]);

        $this->assertNotNull($tour->cover_media);

        $this->actingAs($user)
            ->patch("/admin/tours/{$tour->id}", array_merge($this->validTourPayload(), [
                'title' => 'Updated Heritage Circuit',
                'status' => 'Published',
            ]))
            ->assertRedirect(route('admin.tours.index'));

        $this->assertDatabaseHas('tours', [
            'id' => $tour->id,
            'title' => 'Updated Heritage Circuit',
            'status' => TourListingStatus::Published->value,
            'slug' => 'updated-heritage-circuit',
        ]);

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
            'title' => 'Afghanistan Essentials Package',
            'listing_type' => TourListingType::Package->value,
            'tagline' => 'Seven days across Kabul, Bamiyan, and Herat.',
            'is_popular' => true,
        ]);
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
        $payload['title'] = 'Updated Essentials Package';
        $payload['price_estimate'] = 'From $2,100 / person';
        $payload['status'] = 'Published';

        $this->actingAs($user)
            ->patch("/admin/tours/{$package->id}", $payload)
            ->assertRedirect(route('admin.tours.index'));

        $this->assertDatabaseHas('tours', [
            'id' => $package->id,
            'title' => 'Updated Essentials Package',
            'price_estimate' => 'From $2,100 / person',
            'status' => TourListingStatus::Published->value,
            'slug' => 'updated-essentials-package',
        ]);

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
        $payload['title'] = 'Updated without new cover';

        $this->actingAs($user)
            ->patch("/admin/tours/{$tour->id}", $payload)
            ->assertRedirect(route('admin.tours.index'));

        $tour->refresh();

        $this->assertSame('Updated without new cover', $tour->title);
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
            'title' => 'Bamiyan Heritage Circuit',
            'tagline' => '',
            'summary' => 'Buddha niches, Shahr-e Gholghola, and Band-e Amir lakes.',
            'destination' => 'Bamiyan & Central Highlands',
            'region' => 'Central Highlands',
            'duration_days' => 7,
            'travel_style' => 'Cultural & Heritage',
            'difficulty' => 'Moderate',
            'badge' => 'Top pick',
            'content' => '<p>Detailed tour content.</p>',
            'highlights_text' => "Band-e Amir lakes\nBuddha niches walk",
            'key_destinations_text' => '',
            'included_services_text' => "Private 4WD transport\nEnglish-speaking guide",
            'next_departure_date' => '14 May 2026',
            'next_departure_status' => 'Guaranteed',
            'estimated_starting_price' => 'From $1,480 / person',
            'price_estimate' => '',
            'ideal_for' => '',
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
            'title' => 'Afghanistan Essentials Package',
            'tagline' => 'Seven days across Kabul, Bamiyan, and Herat.',
            'summary' => 'A balanced first journey through Afghanistan.',
            'destination' => 'Kabul',
            'region' => 'Multiple Regions',
            'duration_days' => 7,
            'travel_style' => 'Cultural & Heritage',
            'difficulty' => 'Moderate',
            'badge' => 'Package',
            'content' => '',
            'highlights_text' => "Curated route\nLocal guides",
            'key_destinations_text' => "Kabul\nBamiyan\nHerat",
            'included_services_text' => "Airport transfers\nDaily breakfast",
            'next_departure_date' => '',
            'next_departure_status' => 'Open for Inquiries',
            'estimated_starting_price' => '',
            'price_estimate' => 'From $1,890 / person',
            'ideal_for' => 'First-time visitors',
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
            'title' => 'Bamiyan Heritage Circuit',
            'summary' => 'Summary copy.',
            'destination' => 'Bamiyan',
            'region' => 'Central Highlands',
            'duration_days' => 7,
            'duration_label' => '7 Days / 6 Nights',
            'travel_style' => 'Cultural & Heritage',
            'difficulty' => 'Moderate',
            'highlights' => ['Highlight one'],
            'content' => '<p>Content</p>',
            'inclusions' => ['Guide'],
            'estimated_starting_price' => 'Custom inquiry basis',
            'next_departure_date' => 'On request',
            'next_departure_status' => 'Open for Inquiries',
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
