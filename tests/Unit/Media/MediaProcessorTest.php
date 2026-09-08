<?php

namespace Tests\Unit\Media;

use App\Support\Media\MediaAsset;
use App\Support\Media\MediaProcessor;
use App\Support\Media\MediaProfile;
use App\Support\Media\MediaValidationException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaProcessorTest extends TestCase
{
    private MediaProcessor $processor;

    protected function setUp(): void
    {
        parent::setUp();

        if (! extension_loaded('gd')) {
            $this->markTestSkipped('GD extension is required for media processing tests.');
        }

        Storage::fake('public');
        Storage::fake('local');

        $this->processor = app(MediaProcessor::class);
    }

    public function test_tour_cover_generates_responsive_variants_at_exact_sizes(): void
    {
        $asset = $this->processor->store(
            $this->makeImageUpload(3200, 2400, 'oversized-tour.jpg'),
            'tour_cover',
        );

        $this->assertSame('tour_cover', $asset->profile);
        $this->assertArrayHasKey('card', $asset->variants);
        $this->assertArrayHasKey('detail', $asset->variants);

        Storage::disk('public')->assertExists($asset->path('card'));
        Storage::disk('public')->assertExists($asset->path('detail'));

        $this->assertVariantDimensions($asset, 'card', 800, 533);
        $this->assertVariantDimensions($asset, 'detail', 1600, 1067);

        $this->assertStringEndsWith('.webp', (string) $asset->path('detail'));
        $this->assertDoesNotMatchRegularExpression('/oversized-tour/i', (string) $asset->path('detail'));
        $this->assertNull($asset->path('original'));
    }

    public function test_rejects_oversized_file_by_kilobytes(): void
    {
        config([
            'media.profiles.tour_cover.max_upload_kilobytes' => 1,
        ]);

        $this->expectException(MediaValidationException::class);
        $this->expectExceptionMessage('maximum allowed size');

        $this->processor->store(
            $this->makeImageUpload(800, 600, 'big.jpg', quality: 100),
            'tour_cover',
        );
    }

    public function test_rejects_excessive_pixel_dimensions(): void
    {
        config([
            'media.profiles.tour_cover.max_source_width' => 1000,
            'media.profiles.tour_cover.max_source_height' => 1000,
            'media.profiles.tour_cover.max_source_pixels' => 500_000,
        ]);

        $this->expectException(MediaValidationException::class);
        $this->expectExceptionMessage('maximum allowed dimensions');

        $this->processor->store(
            $this->makeImageUpload(2000, 2000, 'huge.jpg'),
            'tour_cover',
        );
    }

    public function test_rejects_invalid_image_content(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'bad-image-');
        $this->assertNotFalse($path);
        file_put_contents($path, 'not-an-image');

        $upload = new UploadedFile($path, 'fake.jpg', 'image/jpeg', null, true);

        try {
            $this->expectException(MediaValidationException::class);
            $this->processor->store($upload, 'tour_cover');
        } finally {
            @unlink($path);
        }
    }

    public function test_rejects_unsupported_extension_even_with_image_mime(): void
    {
        $this->expectException(MediaValidationException::class);

        $this->processor->store(
            $this->makeImageUpload(800, 600, 'payload.php', mime: 'image/jpeg'),
            'tour_cover',
        );
    }

    public function test_rejects_executable_extensions(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'exec-');
        $this->assertNotFalse($path);
        $exePath = $path.'.exe';
        file_put_contents($exePath, 'MZ');

        $upload = new UploadedFile($exePath, 'malware.exe', 'application/octet-stream', null, true);

        try {
            $this->expectException(MediaValidationException::class);
            $this->processor->store($upload, 'document_attachment');
        } finally {
            @unlink($exePath);
            @unlink($path);
        }
    }

    public function test_document_attachment_uses_private_disk_and_safe_filename(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'doc-');
        $this->assertNotFalse($path);
        $pdfPath = $path.'.pdf';
        file_put_contents($pdfPath, '%PDF-1.4 fake');

        $upload = new UploadedFile($pdfPath, 'Contract Final (1).pdf', 'application/pdf', null, true);

        try {
            $asset = $this->processor->store($upload, 'document_attachment');

            $this->assertSame('local', $asset->disk);
            $this->assertSame('Contract Final (1).pdf', $asset->originalName);
            $this->assertNull($asset->url());
            Storage::disk('local')->assertExists($asset->path('default'));
            $this->assertStringEndsWith('/file.pdf', (string) $asset->path('default'));
            $this->assertStringNotContainsString('Contract', (string) $asset->path('default'));
        } finally {
            @unlink($pdfPath);
            @unlink($path);
        }
    }

    public function test_replace_deletes_obsolete_variants(): void
    {
        $first = $this->processor->store(
            $this->makeImageUpload(1200, 800, 'first.jpg'),
            'tour_cover',
        );

        $oldPaths = $first->allPaths();

        foreach ($oldPaths as $path) {
            Storage::disk('public')->assertExists($path);
        }

        $second = $this->processor->replace(
            $this->makeImageUpload(1200, 800, 'second.jpg'),
            'tour_cover',
            $first,
        );

        foreach ($oldPaths as $path) {
            Storage::disk('public')->assertMissing($path);
        }

        Storage::disk('public')->assertExists($second->path('detail'));
    }

    public function test_delete_removes_asset_files(): void
    {
        $asset = $this->processor->store(
            $this->makeImageUpload(1200, 800, 'delete-me.jpg'),
            'team_avatar',
        );

        $paths = $asset->allPaths();
        $this->processor->delete($asset);

        foreach ($paths as $path) {
            Storage::disk('public')->assertMissing($path);
        }
    }

    public function test_gallery_contain_fit_keeps_canvas_size(): void
    {
        $asset = $this->processor->store(
            $this->makeImageUpload(1600, 900, 'wide-gallery.jpg'),
            'gallery_image',
        );

        $this->assertVariantDimensions($asset, 'thumb', 400, 400);
        $this->assertVariantDimensions($asset, 'display', 1600, 1600);
    }

    public function test_profile_validation_rules_and_hint_are_configuration_driven(): void
    {
        $profile = MediaProfile::fromConfig('blog_cover');

        $this->assertContains('image', $profile->validationRules());
        $this->assertContains('max:8192', $profile->validationRules());
        $this->assertStringContainsString('1600 × 1000', $profile->uploadHint());
    }

    public function test_skips_upscaled_variants_for_smaller_sources(): void
    {
        $asset = $this->processor->store(
            $this->makeImageUpload(1920, 1080, 'hero-hd.jpg'),
            'hero_slide',
        );

        $this->assertArrayHasKey('thumb', $asset->variants);
        $this->assertArrayHasKey('hero_md', $asset->variants);
        $this->assertArrayNotHasKey('hero', $asset->variants);
        $this->assertArrayNotHasKey('hero_ultra', $asset->variants);
    }

    public function test_hydrate_round_trips_inertia_safe_payload(): void
    {
        $asset = $this->processor->store(
            $this->makeImageUpload(1200, 800, 'hydrate.jpg'),
            'product_image',
        );

        $hydrated = $this->processor->hydrate($asset->toArray());

        $this->assertSame($asset->id, $hydrated->id);
        $this->assertSame($asset->path('card'), $hydrated->path('card'));
        $this->assertNotNull($hydrated->cardUrl());
        $this->assertNotNull($hydrated->detailUrl());
    }

    public function test_private_document_urls_are_not_publicly_exposed(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'private-doc-');
        $this->assertNotFalse($path);
        $pdfPath = $path.'.pdf';
        file_put_contents($pdfPath, '%PDF-1.4');

        $upload = new UploadedFile($pdfPath, 'private.pdf', 'application/pdf', null, true);

        try {
            $asset = $this->processor->store($upload, 'document_attachment');
            $payload = $asset->toArray();

            $this->assertNull($payload['url']);
            $this->assertNull($payload['card_url']);
            $this->assertNull($payload['variants']['default']['url']);
            $this->assertSame('local', $payload['disk']);
        } finally {
            @unlink($pdfPath);
            @unlink($path);
        }
    }

    private function makeImageUpload(
        int $width,
        int $height,
        string $filename,
        string $mime = 'image/jpeg',
        int $quality = 85,
    ): UploadedFile {
        $source = imagecreatetruecolor($width, $height);
        $this->assertNotFalse($source);
        imagefilledrectangle($source, 0, 0, $width - 1, $height - 1, imagecolorallocate($source, 30, 90, 140));

        $tempPath = tempnam(sys_get_temp_dir(), 'media-');
        $this->assertNotFalse($tempPath);
        $jpegPath = $tempPath.'.jpg';
        imagejpeg($source, $jpegPath, $quality);
        imagedestroy($source);

        return new UploadedFile($jpegPath, $filename, $mime, null, true);
    }

    private function assertVariantDimensions(MediaAsset $asset, string $variant, int $width, int $height): void
    {
        $binary = Storage::disk($asset->disk)->get((string) $asset->path($variant));
        $image = imagecreatefromstring($binary);

        $this->assertNotFalse($image);
        $this->assertSame($width, imagesx($image));
        $this->assertSame($height, imagesy($image));
        imagedestroy($image);
    }
}
