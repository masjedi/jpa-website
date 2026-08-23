<?php

namespace Tests\Feature\Admin;

use App\Enums\DestinationStatus;
use App\Models\Destination;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DestinationsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        if (! extension_loaded('gd')) {
            $this->markTestSkipped('GD extension is required for destination cover upload tests.');
        }

        Storage::fake('public');
    }

    public function test_authenticated_admin_can_view_destinations_index(): void
    {
        $user = User::factory()->create();
        $destination = $this->createDestinationRecord();

        $this->actingAs($user)
            ->get('/admin/destinations')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/Destinations')
                ->has('destinations', 1)
                ->where('destinations.0.id', $destination->id)
                ->where('destinations.0.name', 'Bamiyan Valley'));
    }

    public function test_authenticated_admin_can_create_update_and_delete_destination(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/destinations', $this->validDestinationPayload())
            ->assertRedirect(route('admin.destinations.index'));

        $destination = Destination::query()->firstOrFail();

        $this->assertDatabaseHas('destinations', [
            'id' => $destination->id,
            'name' => 'Bamiyan Valley',
            'status' => DestinationStatus::Draft->value,
            'slug' => 'bamiyan-valley',
            'is_featured' => true,
        ]);

        $this->assertNotNull($destination->cover_media);

        $payload = $this->validDestinationPayload();
        unset($payload['cover_image']);
        $payload['name'] = 'Updated Bamiyan Valley';
        $payload['status'] = 'Published';

        $this->actingAs($user)
            ->patch("/admin/destinations/{$destination->id}", $payload)
            ->assertRedirect(route('admin.destinations.index'));

        $this->assertDatabaseHas('destinations', [
            'id' => $destination->id,
            'name' => 'Updated Bamiyan Valley',
            'status' => DestinationStatus::Published->value,
            'slug' => 'updated-bamiyan-valley',
        ]);

        $this->actingAs($user)
            ->delete("/admin/destinations/{$destination->id}")
            ->assertRedirect(route('admin.destinations.index'));

        $this->assertDatabaseMissing('destinations', [
            'id' => $destination->id,
        ]);
    }

    public function test_guest_cannot_manage_destinations(): void
    {
        $destination = $this->createDestinationRecord();

        $this->get('/admin/destinations')->assertRedirect(route('admin.login'));

        $this->post('/admin/destinations', $this->validDestinationPayload())
            ->assertRedirect(route('admin.login'));

        $this->patch("/admin/destinations/{$destination->id}", $this->validDestinationPayload())
            ->assertRedirect(route('admin.login'));

        $this->delete("/admin/destinations/{$destination->id}")
            ->assertRedirect(route('admin.login'));
    }

    public function test_destination_update_without_new_cover_image(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/destinations', $this->validDestinationPayload())
            ->assertRedirect(route('admin.destinations.index'));

        $destination = Destination::query()->firstOrFail();
        $originalCover = $destination->cover_media;

        $payload = $this->validDestinationPayload();
        unset($payload['cover_image']);
        $payload['name'] = 'Updated without new cover';

        $this->actingAs($user)
            ->patch("/admin/destinations/{$destination->id}", $payload)
            ->assertRedirect(route('admin.destinations.index'));

        $destination->refresh();

        $this->assertSame('Updated without new cover', $destination->name);
        $this->assertSame($originalCover, $destination->cover_media);
    }

    public function test_destination_create_requires_cover_image(): void
    {
        $user = User::factory()->create();
        $payload = $this->validDestinationPayload();
        unset($payload['cover_image']);

        $this->actingAs($user)
            ->post('/admin/destinations', $payload)
            ->assertSessionHasErrors('cover_image');
    }

    /**
     * @return array<string, mixed>
     */
    private function validDestinationPayload(): array
    {
        return [
            'name' => 'Bamiyan Valley',
            'tagline' => 'Alpine lakes, cliff monasteries, and highland silence.',
            'region' => 'Central Highlands',
            'badge' => 'Signature',
            'description' => '<p>The heart of the Hazarajat highlands.</p>',
            'highlights_text' => "Band-e Amir lakes\nBuddha niches",
            'best_season' => 'May – October',
            'travel_style' => 'Cultural & nature',
            'practical_notes_text' => "Highland roads from Kabul\nModerate walking",
            'tour_match_keywords_text' => "Bamiyan\nCentral Highlands\nBand-e Amir",
            'is_featured' => '1',
            'status' => 'Draft',
            'cover_image' => $this->makeCoverUpload(),
        ];
    }

    private function createDestinationRecord(): Destination
    {
        return Destination::query()->create([
            'slug' => 'existing-destination',
            'status' => DestinationStatus::Published,
            'name' => 'Bamiyan Valley',
            'tagline' => 'Highland heritage.',
            'region' => 'Central Highlands',
            'badge' => 'Signature',
            'description' => '<p>Existing destination.</p>',
            'highlights' => ['Highlight one'],
            'best_season' => 'May – October',
            'travel_style' => 'Cultural & nature',
            'practical_notes' => ['Note one'],
            'tour_match_keywords' => ['Bamiyan'],
            'is_featured' => true,
            'cover_media' => null,
        ]);
    }

    private function makeCoverUpload(): UploadedFile
    {
        $source = imagecreatetruecolor(1600, 1200);
        $this->assertNotFalse($source);
        imagefilledrectangle($source, 0, 0, 1599, 1199, imagecolorallocate($source, 30, 90, 140));

        $tempPath = tempnam(sys_get_temp_dir(), 'destination-cover-');
        $this->assertNotFalse($tempPath);
        $jpegPath = $tempPath.'.jpg';
        imagejpeg($source, $jpegPath, 85);
        imagedestroy($source);

        return new UploadedFile($jpegPath, 'cover.jpg', 'image/jpeg', null, true);
    }
}
