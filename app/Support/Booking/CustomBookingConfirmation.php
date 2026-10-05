<?php

namespace App\Support\Booking;

use App\Models\CustomBooking;
use App\Support\Brand;
use App\Support\SiteSettings\SiteSettingsDefaults;
use App\Support\SiteSettings\SiteSettingsPresenter;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Storage;

final readonly class CustomBookingConfirmation
{
    public function __construct(
        public string $reference,
        public string $fullName,
        public string $email,
        public ?string $preferredDate,
        public int $numberOfTourists,
        public string $tourType,
        public string $destinationsSummary,
        public string $brandName,
        public string $contactEmail,
        public string $whatsappDisplay,
        public string $officeLocation,
        public string $logoUrl,
        public string $homeUrl,
        public string $logoPath = '',
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function flashPayload(): array
    {
        return [
            'reference' => $this->reference,
            'status' => 'submitted',
            'fullName' => $this->fullName,
            'preferredDate' => $this->preferredDate ?? '',
            'numberOfTourists' => $this->numberOfTourists,
            'email' => $this->email,
        ];
    }

    public function firstName(): string
    {
        $parts = preg_split('/\s+/', trim($this->fullName)) ?: [];

        return (string) ($parts[0] ?? $this->fullName);
    }

    public function embeddedLogoSrc(?object $message): string
    {
        if (
            $this->logoPath !== ''
            && is_file($this->logoPath)
            && $message instanceof Message
        ) {
            return $message->embed($this->logoPath);
        }

        return $this->logoUrl;
    }

    public static function fromBooking(CustomBooking $booking): self
    {
        $settings = SiteSettingsPresenter::forShared();
        $baseUrl = rtrim((string) config('app.url'), '/');
        $logoUrl = (string) $settings['logoWhite'];

        if (! str_starts_with($logoUrl, 'http')) {
            $logoUrl = $baseUrl.$logoUrl;
        }

        return new self(
            reference: (string) $booking->reference,
            fullName: (string) $booking->full_name,
            email: mb_strtolower((string) $booking->email),
            preferredDate: CustomBookingPresenter::preferredDateLabel($booking),
            numberOfTourists: (int) $booking->number_of_tourists,
            tourType: (string) $booking->tour_type,
            destinationsSummary: (string) $booking->preferred_destinations,
            brandName: Brand::appName(),
            contactEmail: (string) $settings['contactEmail'],
            whatsappDisplay: (string) $settings['whatsappDisplay'],
            officeLocation: (string) $settings['officeLocation'],
            logoUrl: $logoUrl,
            homeUrl: $baseUrl.'/',
            logoPath: self::emailLogoFilePath($logoUrl),
        );
    }

    private static function emailLogoFilePath(string $logoUrl): string
    {
        $fallback = public_path(ltrim(SiteSettingsDefaults::LOGO_WHITE, '/'));
        $path = self::publicFilePathFromUrl($logoUrl);

        return ($path !== null && is_file($path)) ? $path : $fallback;
    }

    private static function publicFilePathFromUrl(string $url): ?string
    {
        $path = parse_url($url, PHP_URL_PATH);

        if (! is_string($path) || $path === '') {
            return null;
        }

        $path = str_replace('\\', '/', $path);

        if (str_starts_with($path, '/storage/')) {
            $absolute = Storage::disk('public')->path(ltrim(substr($path, strlen('/storage/')), '/'));

            return is_file($absolute) ? $absolute : null;
        }

        $absolute = public_path(ltrim($path, '/'));

        return is_file($absolute) ? $absolute : null;
    }
}
