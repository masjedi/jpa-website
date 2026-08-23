<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Support\Media\MediaProcessor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProtectedMediaTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_download_protected_media(): void
    {
        Storage::fake('local');

        $asset = $this->storePrivateDocument();

        $this->get(route('admin.media.show', [
            'profile' => $asset->profile,
            'id' => $asset->id,
        ]))->assertRedirect(route('admin.login'));
    }

    public function test_authenticated_users_can_download_protected_media(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();
        $asset = $this->storePrivateDocument();

        $this->actingAs($user)
            ->get(route('admin.media.show', [
                'profile' => $asset->profile,
                'id' => $asset->id,
            ]))
            ->assertOk()
            ->assertHeader('content-disposition');
    }

    public function test_public_profiles_cannot_be_fetched_via_protected_route(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $processor = app(MediaProcessor::class);
        $asset = $processor->store(
            $this->makeJpegUpload(),
            'tour_cover',
        );

        $this->actingAs($user)
            ->get(route('admin.media.show', [
                'profile' => $asset->profile,
                'id' => $asset->id,
            ]))
            ->assertNotFound();
    }

    private function storePrivateDocument()
    {
        $path = tempnam(sys_get_temp_dir(), 'private-');
        $this->assertNotFalse($path);
        $pdfPath = $path.'.pdf';
        file_put_contents($pdfPath, '%PDF-1.4 protected');

        $upload = new UploadedFile($pdfPath, 'private.pdf', 'application/pdf', null, true);

        try {
            return app(MediaProcessor::class)->store($upload, 'document_attachment');
        } finally {
            @unlink($pdfPath);
            @unlink($path);
        }
    }

    private function makeJpegUpload(): UploadedFile
    {
        $source = imagecreatetruecolor(800, 600);
        $this->assertNotFalse($source);
        imagefilledrectangle($source, 0, 0, 799, 599, imagecolorallocate($source, 20, 80, 120));

        $tempPath = tempnam(sys_get_temp_dir(), 'cover-');
        $this->assertNotFalse($tempPath);
        $jpegPath = $tempPath.'.jpg';
        imagejpeg($source, $jpegPath, 85);
        imagedestroy($source);

        return new UploadedFile($jpegPath, 'cover.jpg', 'image/jpeg', null, true);
    }
}
