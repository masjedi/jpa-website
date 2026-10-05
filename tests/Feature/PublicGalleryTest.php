<?php

namespace Tests\Feature;

use App\Enums\GalleryPhotoStatus;
use App\Models\GalleryPhoto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicGalleryTest extends TestCase
{
    use RefreshDatabase;

    public function test_gallery_index_receives_only_published_photos(): void
    {
        GalleryPhoto::query()->create($this->photoAttributes([
            'caption' => 'Published photo',
            'status' => GalleryPhotoStatus::Published,
            'sort_order' => 1,
        ]));

        GalleryPhoto::query()->create($this->photoAttributes([
            'caption' => 'Draft photo',
            'status' => GalleryPhotoStatus::Draft,
            'sort_order' => 2,
        ]));

        $this->get('/gallery')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Gallery')
                ->has('photos', 1)
                ->where('photos.0.caption', 'Published photo'));
    }

    public function test_home_page_receives_gallery_preview(): void
    {
        GalleryPhoto::query()->create($this->photoAttributes([
            'caption' => 'Home preview photo',
            'status' => GalleryPhotoStatus::Published,
            'sort_order' => 1,
        ]));

        GalleryPhoto::query()->create($this->photoAttributes([
            'caption' => 'Draft preview photo',
            'status' => GalleryPhotoStatus::Draft,
            'sort_order' => 2,
        ]));

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Home')
                ->missing('galleryPreview')
                ->loadDeferredProps(fn ($page) => $page
                    ->has('galleryPreview', 1)
                    ->where('galleryPreview.0.caption', 'Home preview photo')));
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function photoAttributes(array $overrides = []): array
    {
        return array_merge([
            'status' => GalleryPhotoStatus::Published,
            'alt' => 'Sample alt text',
            'caption' => 'Sample caption',
            'sort_order' => 0,
            'image_media' => null,
        ], $overrides);
    }
}
