<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGalleryPhotoRequest;
use App\Http\Requests\Admin\UpdateGalleryPhotoRequest;
use App\Models\GalleryPhoto;
use App\Support\Gallery\GalleryPhotoAttributes;
use App\Support\Gallery\GalleryPhotoPresenter;
use App\Support\Gallery\GalleryPhotoText;
use App\Support\Media\GalleryPhotoImage;
use App\Support\Media\MediaValidationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/Gallery', GalleryPhotoPresenter::forAdminIndex());
    }

    public function store(StoreGalleryPhotoRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        /** @var list<UploadedFile> $files */
        $files = $request->file('gallery_images', []);

        try {
            DB::transaction(function () use ($validated, $files): void {
                $nextSortOrder = ((int) GalleryPhoto::query()->max('sort_order')) + 1;

                foreach ($files as $index => $file) {
                    $cover = app(GalleryPhotoImage::class)->store($file);
                    $label = GalleryPhotoText::labelFromFilename($file);

                    GalleryPhoto::query()->create(array_merge(
                        GalleryPhotoAttributes::fromValidated([
                            'status' => $validated['status'],
                            'alt' => $label,
                            'caption' => $label,
                            'sort_order' => $nextSortOrder + $index,
                        ]),
                        ['image_media' => $cover->toArray()],
                    ));
                }
            });
        } catch (MediaValidationException $exception) {
            return back()
                ->withErrors(['gallery_images' => $exception->getMessage()])
                ->withInput();
        }

        $count = count($files);

        return redirect()
            ->route('admin.gallery.index')
            ->with('success', "{$count} gallery photo".($count === 1 ? '' : 's').' uploaded.');
    }

    public function update(UpdateGalleryPhotoRequest $request, GalleryPhoto $galleryPhoto): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $request, $galleryPhoto): void {
                $attributes = GalleryPhotoAttributes::fromValidated($validated);

                if ($request->hasFile('gallery_image')) {
                    $existing = $galleryPhoto->imageAsset();
                    $cover = app(GalleryPhotoImage::class)->replace(
                        $request->file('gallery_image'),
                        $existing,
                    );
                    $attributes['image_media'] = $cover->toArray();
                }

                $galleryPhoto->update($attributes);
            });
        } catch (MediaValidationException $exception) {
            return back()
                ->withErrors(['gallery_image' => $exception->getMessage()])
                ->withInput();
        }

        return redirect()
            ->route('admin.gallery.index')
            ->with('success', 'Gallery photo updated.');
    }

    public function destroy(GalleryPhoto $galleryPhoto): RedirectResponse
    {
        DB::transaction(function () use ($galleryPhoto): void {
            $image = $galleryPhoto->imageAsset();

            if ($image !== null) {
                app(GalleryPhotoImage::class)->delete($image);
            }

            $galleryPhoto->delete();
        });

        return redirect()
            ->route('admin.gallery.index')
            ->with('success', 'Gallery photo deleted.');
    }
}
