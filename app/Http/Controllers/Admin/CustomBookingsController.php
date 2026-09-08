<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CustomBookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DestroyCustomBookingAttachmentRequest;
use App\Http\Requests\Admin\StoreCustomBookingAttachmentsRequest;
use App\Http\Requests\Admin\UpdateCustomBookingStatusRequest;
use App\Models\CustomBooking;
use App\Models\CustomBookingAttachment;
use App\Support\Booking\CustomBookingPresenter;
use App\Support\Booking\UpdateCustomBookingStatusAction;
use App\Support\Media\DocumentAttachment;
use App\Support\Media\MediaValidationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CustomBookingsController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('admin/Bookings', CustomBookingPresenter::forAdminIndex($request));
    }

    public function show(Request $request, CustomBooking $customBooking): Response|JsonResponse
    {
        $payload = CustomBookingPresenter::forAdminShow($customBooking);

        if ($request->expectsJson() && $request->header('X-Inertia') === null) {
            return response()->json($payload);
        }

        return Inertia::render('admin/BookingDetail', $payload);
    }

    public function updateStatus(
        UpdateCustomBookingStatusRequest $request,
        CustomBooking $customBooking,
        UpdateCustomBookingStatusAction $updateStatus,
    ): RedirectResponse {
        $status = CustomBookingStatus::from($request->validated('status'));
        $updateStatus->handle($customBooking, $status, $request->user());

        return redirect()
            ->route('admin.bookings.show', $customBooking)
            ->with('success', 'Request status updated.');
    }

    public function storeAttachments(
        StoreCustomBookingAttachmentsRequest $request,
        CustomBooking $customBooking,
        DocumentAttachment $documents,
    ): RedirectResponse {
        $files = $request->file('attachments', []);

        if ($files instanceof UploadedFile) {
            $files = [$files];
        }

        /** @var list<UploadedFile> $files */
        $userId = (int) $request->user()->id;

        try {
            DB::transaction(function () use ($customBooking, $files, $documents, $userId): void {
                $nextSortOrder = ((int) $customBooking->attachments()->max('sort_order')) + 1;

                foreach ($files as $index => $file) {
                    $originalName = $this->safeOriginalName($file);
                    $mimeType = $file->getMimeType();
                    $sizeBytes = (int) ($file->getSize() ?: 0);
                    $asset = $documents->store($file);

                    $customBooking->attachments()->create([
                        'original_name' => $originalName,
                        'mime_type' => $mimeType,
                        'size_bytes' => $sizeBytes,
                        'media' => $asset->toArray(),
                        'uploaded_by' => $userId,
                        'sort_order' => $nextSortOrder + $index,
                    ]);
                }
            });
        } catch (MediaValidationException $exception) {
            return back()
                ->withErrors(['attachments' => $exception->getMessage()])
                ->withInput();
        }

        $count = count($files);

        return redirect()
            ->route('admin.bookings.show', $customBooking)
            ->with('success', $count === 1 ? 'File attached to this request.' : "{$count} files attached to this request.");
    }

    public function downloadAttachment(
        CustomBooking $customBooking,
        CustomBookingAttachment $customBookingAttachment,
        DocumentAttachment $documents,
    ): StreamedResponse {
        $this->ensureAttachmentBelongsToBooking($customBooking, $customBookingAttachment);

        $asset = $customBookingAttachment->mediaAsset();

        abort_if($asset === null, 404);

        return $documents->download($asset);
    }

    public function destroyAttachment(
        DestroyCustomBookingAttachmentRequest $request,
        CustomBooking $customBooking,
        CustomBookingAttachment $customBookingAttachment,
        DocumentAttachment $documents,
    ): RedirectResponse {
        $this->ensureAttachmentBelongsToBooking($customBooking, $customBookingAttachment);

        DB::transaction(function () use ($customBookingAttachment, $documents): void {
            $asset = $customBookingAttachment->mediaAsset();

            if ($asset !== null) {
                $documents->delete($asset);
            }

            $customBookingAttachment->delete();
        });

        return redirect()
            ->route('admin.bookings.show', $customBooking)
            ->with('success', 'File removed from this request.');
    }

    public function destroy(CustomBooking $customBooking, DocumentAttachment $documents): RedirectResponse
    {
        DB::transaction(function () use ($customBooking, $documents): void {
            $customBooking->load('attachments');

            foreach ($customBooking->attachments as $attachment) {
                $asset = $attachment->mediaAsset();

                if ($asset !== null) {
                    $documents->delete($asset);
                }
            }

            $customBooking->delete();
        });

        return redirect()
            ->route('admin.bookings.index')
            ->with('success', 'Custom tour request removed.');
    }

    private function ensureAttachmentBelongsToBooking(
        CustomBooking $customBooking,
        CustomBookingAttachment $attachment,
    ): void {
        abort_unless($attachment->custom_booking_id === $customBooking->id, 404);
    }

    private function safeOriginalName(UploadedFile $file): string
    {
        $name = basename(str_replace('\\', '/', $file->getClientOriginalName()));
        $name = trim($name);

        if ($name === '') {
            $name = 'attachment';
        }

        return mb_substr($name, 0, 160);
    }
}
