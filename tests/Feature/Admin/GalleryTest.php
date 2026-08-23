<?php

namespace Tests\Feature\Admin;

use App\Enums\GalleryPhotoStatus;
use App\Models\GalleryPhoto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GalleryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        if (! extension_loaded('gd')) {
            $this->markTestSkipped('GD extension is required for gallery upload tests.');
        }

        Storage::fake('public');
    }

    public function test_authenticated_admin_can_view_gallery_index(): void
    {
        $user = User::factory()->create();
        $photo = $this->createGalleryPhotoRecord();

        $this->actingAs($user)
            ->get('/admin/gallery')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/Gallery')
                ->has('photos', 1)
                ->where('photos.0.id', $photo->id)
                ->where('photos.0.caption', 'Band-e Amir'));
    }

    public function test_authenticated_admin_can_bulk_upload_update_and_delete_gallery_photos(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/gallery', [
                'gallery_images' => [
                    $this->makeGalleryUpload('first.jpg'),
                    $this->makeGalleryUpload('second.jpg'),
                ],
                'status' => 'Draft',
            ])
            ->assertRedirect(route('admin.gallery.index'));

        $this->assertSame(2, GalleryPhoto::query()->count());

        $photo = GalleryPhoto::query()->orderBy('id')->firstOrFail();

        $this->assertDatabaseHas('gallery_photos', [
            'id' => $photo->id,
            'status' => GalleryPhotoStatus::Draft->value,
            'sort_order' => 1,
        ]);

        $this->assertNotNull($photo->image_media);

        $payload = [
            'alt' => 'Updated alt text',
            'caption' => 'Updated caption',
            'status' => 'Published',
            'sort_order' => 5,
        ];

        $this->actingAs($user)
            ->patch("/admin/gallery/{$photo->id}", $payload)
            ->assertRedirect(route('admin.gallery.index'));

        $this->assertDatabaseHas('gallery_photos', [
            'id' => $photo->id,
            'alt' => 'Updated alt text',
            'caption' => 'Updated caption',
            'status' => GalleryPhotoStatus::Published->value,
            'sort_order' => 5,
        ]);

        $this->actingAs($user)
            ->delete("/admin/gallery/{$photo->id}")
            ->assertRedirect(route('admin.gallery.index'));

        $this->assertDatabaseMissing('gallery_photos', [
            'id' => $photo->id,
        ]);
    }

    public function test_guest_cannot_manage_gallery(): void
    {
        $photo = $this->createGalleryPhotoRecord();

        $this->get('/admin/gallery')->assertRedirect(route('admin.login'));

        $this->post('/admin/gallery', [
            'gallery_images' => [$this->makeGalleryUpload()],
            'status' => 'Draft',
        ])->assertRedirect(route('admin.login'));

        $this->patch("/admin/gallery/{$photo->id}", [
            'alt' => 'Alt',
            'caption' => 'Caption',
            'status' => 'Draft',
        ])->assertRedirect(route('admin.login'));

        $this->delete("/admin/gallery/{$photo->id}")
            ->assertRedirect(route('admin.login'));
    }

    public function test_gallery_update_without_new_image(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/gallery', [
                'gallery_images' => [$this->makeGalleryUpload()],
                'status' => 'Draft',
            ])
            ->assertRedirect(route('admin.gallery.index'));

        $photo = GalleryPhoto::query()->firstOrFail();
        $originalMedia = $photo->image_media;

        $this->actingAs($user)
            ->patch("/admin/gallery/{$photo->id}", [
                'alt' => 'Updated alt',
                'caption' => 'Updated caption',
                'status' => 'Draft',
            ])
            ->assertRedirect(route('admin.gallery.index'));

        $photo->refresh();

        $this->assertSame('Updated alt', $photo->alt);
        $this->assertSame($originalMedia, $photo->image_media);
    }

    public function test_gallery_bulk_upload_requires_at_least_one_image(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/gallery', [
                'status' => 'Draft',
            ])
            ->assertSessionHasErrors('gallery_images');
    }

    private function createGalleryPhotoRecord(): GalleryPhoto
    {
        return GalleryPhoto::query()->create([
            'status' => GalleryPhotoStatus::Published,
            'alt' => 'Band-e Amir lakes at sunset, Bamiyan',
            'caption' => 'Band-e Amir',
            'sort_order' => 1,
            'image_media' => null,
        ]);
    }

    private function makeGalleryUpload(string $filename = 'gallery.jpg'): UploadedFile
    {
        $source = imagecreatetruecolor(1200, 900);
        $this->assertNotFalse($source);
        imagefilledrectangle($source, 0, 0, 1199, 899, imagecolorallocate($source, 30, 90, 140));

        $tempPath = tempnam(sys_get_temp_dir(), 'gallery-photo-');
        $this->assertNotFalse($tempPath);
        $jpegPath = $tempPath.'.jpg';
        imagejpeg($source, $jpegPath, 85);
        imagedestroy($source);

        return new UploadedFile($jpegPath, $filename, 'image/jpeg', null, true);
    }
}
