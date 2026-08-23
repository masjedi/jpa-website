<?php

namespace App\Support\Media;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MediaProcessor
{
    /**
     * Store an upload using a named media profile.
     */
    public function store(UploadedFile $file, string $profileKey): MediaAsset
    {
        $profile = MediaProfile::fromConfig($profileKey);

        $this->assertSafeUpload($file, $profile);

        return $profile->isImage()
            ? $this->storeImage($file, $profile)
            : $this->storeDocument($file, $profile);
    }

    /**
     * Replace an existing asset and delete its previous files.
     */
    public function replace(UploadedFile $file, string $profileKey, ?MediaAsset $existing = null): MediaAsset
    {
        $asset = $this->store($file, $profileKey);

        if ($existing !== null) {
            $this->delete($existing);
        }

        return $asset;
    }

    /**
     * Delete every file belonging to a media asset.
     */
    public function delete(MediaAsset $asset): void
    {
        $disk = Storage::disk($asset->disk);

        foreach ($asset->allPaths() as $path) {
            $disk->delete($path);
        }

        if ($disk->directoryExists($asset->directory)) {
            $remaining = $disk->files($asset->directory);

            if ($remaining === []) {
                $disk->deleteDirectory($asset->directory);
            }
        }
    }

    /**
     * Stream a private/protected file download (caller must authorize).
     */
    public function download(MediaAsset $asset, string $variant = 'default'): StreamedResponse
    {
        $profile = MediaProfile::fromConfig($asset->profile);

        if (! $profile->isPrivate()) {
            abort(404);
        }

        $path = $asset->path($variant);

        if ($path === null || ! Storage::disk($asset->disk)->exists($path)) {
            abort(404);
        }

        $name = $asset->originalName ?: basename($path);

        return Storage::disk($asset->disk)->download($path, $name);
    }

    /**
     * Resolve a private document asset from disk by profile + asset id.
     */
    public function findPrivate(string $profileKey, string $id): MediaAsset
    {
        $profile = MediaProfile::fromConfig($profileKey);

        if (! $profile->isPrivate()) {
            abort(404);
        }

        if (! preg_match('/^[0-9a-fA-F-]{36}$/', $id)) {
            abort(404);
        }

        $directory = $profile->directory.'/'.$id;
        $disk = Storage::disk($profile->disk);
        $files = $disk->files($directory);

        if ($files === []) {
            abort(404);
        }

        $path = $files[0];

        return new MediaAsset(
            id: $id,
            profile: $profile->key,
            disk: $profile->disk,
            directory: $directory,
            variants: [
                'default' => [
                    'path' => $path,
                    'width' => null,
                    'height' => null,
                    'format' => pathinfo($path, PATHINFO_EXTENSION),
                ],
            ],
        );
    }

    /**
     * Build a MediaAsset from previously stored metadata (e.g. DB JSON).
     *
     * @param  array<string, mixed>  $payload
     */
    public function hydrate(array $payload): MediaAsset
    {
        /** @var array<string, array{path: string, width?: int|null, height?: int|null, format?: string}> $variants */
        $variants = [];

        foreach (($payload['variants'] ?? []) as $name => $variant) {
            if (! is_array($variant) || ! isset($variant['path'])) {
                continue;
            }

            $variants[(string) $name] = [
                'path' => (string) $variant['path'],
                'width' => isset($variant['width']) ? (int) $variant['width'] : null,
                'height' => isset($variant['height']) ? (int) $variant['height'] : null,
                'format' => (string) ($variant['format'] ?? pathinfo((string) $variant['path'], PATHINFO_EXTENSION)),
            ];
        }

        return new MediaAsset(
            id: (string) ($payload['id'] ?? Str::uuid()->toString()),
            profile: (string) ($payload['profile'] ?? 'unknown'),
            disk: (string) ($payload['disk'] ?? 'public'),
            directory: (string) ($payload['directory'] ?? ''),
            variants: $variants,
            originalName: isset($payload['original_name']) ? (string) $payload['original_name'] : null,
            mimeType: isset($payload['mime_type']) ? (string) $payload['mime_type'] : null,
        );
    }

    private function assertSafeUpload(UploadedFile $file, MediaProfile $profile): void
    {
        if (! $file->isValid()) {
            throw MediaValidationException::invalidImage();
        }

        if ($file->getSize() !== false && ($file->getSize() / 1024) > $profile->maxUploadKilobytes) {
            throw MediaValidationException::tooLarge();
        }

        $extension = strtolower($file->getClientOriginalExtension());
        $dangerous = ['php', 'phtml', 'phar', 'exe', 'bat', 'cmd', 'sh', 'js', 'html', 'htm', 'svg'];

        if (in_array($extension, $dangerous, true)) {
            throw MediaValidationException::executableRejected();
        }

        if ($profile->allowedExtensions !== [] && ! in_array($extension, $profile->allowedExtensions, true)) {
            throw MediaValidationException::unsupportedType();
        }

        $mime = (string) ($file->getMimeType() ?? '');

        if ($profile->allowedMimes !== [] && ! in_array($mime, $profile->allowedMimes, true)) {
            throw MediaValidationException::unsupportedType();
        }
    }

    private function storeImage(UploadedFile $file, MediaProfile $profile): MediaAsset
    {
        if (! extension_loaded('gd')) {
            throw new RuntimeException(
                'The PHP GD extension is required to process images. Enable extension=gd in php.ini, then restart php artisan serve (or your web server).',
            );
        }

        if ($profile->variants === []) {
            throw new RuntimeException("Image profile [{$profile->key}] must define at least one variant.");
        }

        $source = $this->createImageResource($file);
        $sourceWidth = imagesx($source);
        $sourceHeight = imagesy($source);

        $this->assertSourceDimensions($sourceWidth, $sourceHeight, $profile);

        $id = Str::uuid()->toString();
        $directory = $profile->directory.'/'.$id;
        $format = $this->resolveOutputFormat($profile);
        $disk = Storage::disk($profile->disk);
        $variants = [];

        foreach ($profile->variants as $name => $variant) {
            $width = (int) $variant['width'];
            $height = (int) $variant['height'];
            $processed = $profile->fit === 'contain'
                ? $this->containFit($source, $width, $height)
                : $this->coverCrop($source, $width, $height);

            $binary = $this->encode($processed, $format, $profile->quality);
            imagedestroy($processed);

            $path = $directory.'/'.$name.'.'.$this->extensionForFormat($format);
            $disk->put($path, $binary);

            $variants[$name] = [
                'path' => $path,
                'width' => $width,
                'height' => $height,
                'format' => $format,
            ];
        }

        if ($profile->retainOriginal) {
            $originalPath = $directory.'/original.'.$this->extensionForFormat($format);
            $disk->put($originalPath, $this->encode($source, $format, $profile->quality));
            $variants['original'] = [
                'path' => $originalPath,
                'width' => $sourceWidth,
                'height' => $sourceHeight,
                'format' => $format,
            ];
        }

        imagedestroy($source);

        return new MediaAsset(
            id: $id,
            profile: $profile->key,
            disk: $profile->disk,
            directory: $directory,
            variants: $variants,
            originalName: $file->getClientOriginalName(),
            mimeType: $file->getMimeType(),
        );
    }

    private function storeDocument(UploadedFile $file, MediaProfile $profile): MediaAsset
    {
        $id = Str::uuid()->toString();
        $extension = strtolower($file->getClientOriginalExtension() ?: 'bin');
        $directory = $profile->directory.'/'.$id;
        $path = $directory.'/file.'.$extension;

        Storage::disk($profile->disk)->putFileAs($directory, $file, 'file.'.$extension);

        return new MediaAsset(
            id: $id,
            profile: $profile->key,
            disk: $profile->disk,
            directory: $directory,
            variants: [
                'default' => [
                    'path' => $path,
                    'width' => null,
                    'height' => null,
                    'format' => $extension,
                ],
            ],
            originalName: $file->getClientOriginalName(),
            mimeType: $file->getMimeType(),
        );
    }

    private function assertSourceDimensions(int $width, int $height, MediaProfile $profile): void
    {
        if ($width < 1 || $height < 1) {
            throw MediaValidationException::invalidImage();
        }

        if ($profile->maxSourceWidth !== null && $width > $profile->maxSourceWidth) {
            throw MediaValidationException::dimensionsTooLarge();
        }

        if ($profile->maxSourceHeight !== null && $height > $profile->maxSourceHeight) {
            throw MediaValidationException::dimensionsTooLarge();
        }

        if ($profile->maxSourcePixels !== null && ($width * $height) > $profile->maxSourcePixels) {
            throw MediaValidationException::dimensionsTooLarge();
        }
    }

    /**
     * @return \GdImage
     */
    private function createImageResource(UploadedFile $file)
    {
        $contents = file_get_contents($file->getRealPath());

        if ($contents === false) {
            throw MediaValidationException::invalidImage();
        }

        $image = @imagecreatefromstring($contents);

        if ($image === false) {
            throw MediaValidationException::invalidImage();
        }

        return $image;
    }

    /**
     * @param  \GdImage  $source
     * @return \GdImage
     */
    private function coverCrop($source, int $targetWidth, int $targetHeight)
    {
        $sourceWidth = imagesx($source);
        $sourceHeight = imagesy($source);
        $scale = max($targetWidth / $sourceWidth, $targetHeight / $sourceHeight);

        $canvas = imagecreatetruecolor($targetWidth, $targetHeight);

        if ($canvas === false) {
            throw new RuntimeException('Unable to create the processed image canvas.');
        }

        $this->fillCanvasBackground($canvas);

        $srcX = (int) max(0, ((($sourceWidth * $scale) - $targetWidth) / 2) / $scale);
        $srcY = (int) max(0, ((($sourceHeight * $scale) - $targetHeight) / 2) / $scale);
        $srcW = (int) min($sourceWidth, $targetWidth / $scale);
        $srcH = (int) min($sourceHeight, $targetHeight / $scale);

        imagecopyresampled(
            $canvas,
            $source,
            0,
            0,
            $srcX,
            $srcY,
            $targetWidth,
            $targetHeight,
            $srcW,
            $srcH,
        );

        return $canvas;
    }

    /**
     * Fit inside the box without cropping; letterbox with transparent/white fill.
     *
     * @param  \GdImage  $source
     * @return \GdImage
     */
    private function containFit($source, int $targetWidth, int $targetHeight)
    {
        $sourceWidth = imagesx($source);
        $sourceHeight = imagesy($source);
        $scale = min($targetWidth / $sourceWidth, $targetHeight / $sourceHeight);
        $destWidth = max(1, (int) round($sourceWidth * $scale));
        $destHeight = max(1, (int) round($sourceHeight * $scale));

        $canvas = imagecreatetruecolor($targetWidth, $targetHeight);

        if ($canvas === false) {
            throw new RuntimeException('Unable to create the processed image canvas.');
        }

        $this->fillCanvasBackground($canvas);

        $destX = (int) floor(($targetWidth - $destWidth) / 2);
        $destY = (int) floor(($targetHeight - $destHeight) / 2);

        imagecopyresampled(
            $canvas,
            $source,
            $destX,
            $destY,
            0,
            0,
            $destWidth,
            $destHeight,
            $sourceWidth,
            $sourceHeight,
        );

        return $canvas;
    }

    /**
     * @param  \GdImage  $canvas
     */
    private function fillCanvasBackground($canvas): void
    {
        imagealphablending($canvas, false);
        imagesavealpha($canvas, true);
        $transparent = imagecolorallocatealpha($canvas, 255, 255, 255, 127);
        imagefilledrectangle($canvas, 0, 0, imagesx($canvas), imagesy($canvas), $transparent);
        imagealphablending($canvas, true);
    }

    private function resolveOutputFormat(MediaProfile $profile): string
    {
        $format = strtolower($profile->outputFormat);

        if ($format === 'webp' && ! function_exists('imagewebp')) {
            return strtolower($profile->fallbackFormat);
        }

        return $format === 'jpeg' ? 'jpg' : $format;
    }

    private function extensionForFormat(string $format): string
    {
        return $format === 'jpeg' ? 'jpg' : $format;
    }

    /**
     * @param  \GdImage  $image
     */
    private function encode($image, string $format, int $quality): string
    {
        ob_start();

        $ok = match ($format) {
            'png' => imagepng($image, null, (int) max(0, min(9, (int) round((100 - $quality) / 10)))),
            'webp' => imagewebp($image, null, $quality),
            default => imagejpeg($image, null, $quality),
        };

        $binary = ob_get_clean();

        if ($ok === false || $binary === false || $binary === '') {
            throw new RuntimeException('Unable to encode the processed image.');
        }

        return $binary;
    }
}
