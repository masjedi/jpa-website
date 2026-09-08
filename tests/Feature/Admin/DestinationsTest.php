<?php

namespace Tests\Feature\Admin;

use App\Enums\DestinationStatus;
use App\Models\Destination;
use App\Models\User;
use App\Support\Translatable;
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
                ->where('destinations.0.name.en', 'Bamiyan Valley'));
    }

    public function test_authenticated_admin_can_create_update_and_delete_destination(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/destinations', $this->validDestinationPayload())
            ->assertRedirect(route('admin.destinations.index'));

        $destination = Destination::query()->firstOrFail();

        $this->assertSame('Bamiyan Valley', Translatable::resolve($destination->name));
        $this->assertSame(DestinationStatus::Draft, $destination->status);
        $this->assertSame('bamiyan-valley', $destination->slug);
        $this->assertTrue($destination->is_featured);
        $this->assertNotNull($destination->cover_media);

        $payload = $this->validDestinationPayload();
        unset($payload['cover_image']);
        $payload['name'] = $this->translation('Updated Bamiyan Valley');
        $payload['status'] = 'Published';

        $this->actingAs($user)
            ->patch("/admin/destinations/{$destination->id}", $payload)
            ->assertRedirect(route('admin.destinations.index'));

        $destination->refresh();

        $this->assertSame('Updated Bamiyan Valley', Translatable::resolve($destination->name));
        $this->assertSame(DestinationStatus::Published, $destination->status);
        $this->assertSame('updated-bamiyan-valley', $destination->slug);

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
        $payload['name'] = $this->translation('Updated without new cover');

        $this->actingAs($user)
            ->patch("/admin/destinations/{$destination->id}", $payload)
            ->assertRedirect(route('admin.destinations.index'));

        $destination->refresh();

        $this->assertSame('Updated without new cover', Translatable::resolve($destination->name));
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
            'name' => $this->translation('Bamiyan Valley'),
            'tagline' => $this->translation('Alpine lakes, cliff monasteries, and highland silence.'),
            'region' => 'Central Highlands',
            'badge' => $this->translation('Signature'),
            'description' => $this->translation('<p>The heart of the Hazarajat highlands.</p>'),
            'highlights_text' => $this->stringListText("Band-e Amir lakes\nBuddha niches"),
            'best_season' => $this->translation('May – October'),
            'travel_style' => $this->translation('Cultural & nature'),
            'practical_notes_text' => $this->stringListText("Highland roads from Kabul\nModerate walking"),
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
            'name' => Translatable::normalize('Bamiyan Valley'),
            'tagline' => Translatable::normalize('Highland heritage.'),
            'region' => 'Central Highlands',
            'badge' => Translatable::normalize('Signature'),
            'description' => Translatable::normalize('<p>Existing destination.</p>'),
            'highlights' => Translatable::normalizeStringListStorage(['Highlight one']),
            'best_season' => Translatable::normalize('May – October'),
            'travel_style' => Translatable::normalize('Cultural & nature'),
            'practical_notes' => Translatable::normalizeStringListStorage(['Note one']),
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
