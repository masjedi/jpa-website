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
        public string $firstName,
        public string $lastName,
        public string $email,
        public ?string $preferredDate,
        public int $durationDays,
        public int $travelerCount,
        public string $destinationsSummary,
        public string $season,
        public string $flexibility,
        public string $routePreference,
        public string $interestsSummary,
        public string $servicesSummary,
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
            'firstName' => $this->firstName,
            'preferredDate' => $this->preferredDate ?? '',
            'travelerCount' => $this->travelerCount,
            'email' => $this->email,
        ];
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

        $primary = $booking->primaryTraveler;
        $season = (string) ($booking->season ?? '');
        if ($season === CustomBookingOptions::RECOMMEND_SEASON) {
            $season = 'Recommend the best time';
        }

        $services = [];
        if ($booking->wants_complete) {
            $services[] = 'Complete custom package';
        }
        if ($booking->wants_guide) {
            $services[] = 'Tour guide';
        }
        if ($booking->wants_transportation) {
            $services[] = 'Transportation';
        }
        if ($booking->wants_accommodation) {
            $services[] = 'Accommodation';
        }
        if ($booking->wants_airport) {
            $services[] = 'Airport pickup/drop-off';
        }
        if ($booking->wants_domestic) {
            $services[] = 'Domestic travel arrangements';
        }

        $destinations = $booking->destinations
            ->pluck('name')
            ->filter()
            ->implode(', ');

        if ($destinations === '') {
            $destinations = $booking->recommend_destinations ? 'Recommend destinations' : 'To be recommended';
        }

        return new self(
            reference: (string) $booking->reference,
            firstName: (string) ($primary?->first_name ?? ''),
            lastName: (string) ($primary?->last_name ?? ''),
            email: mb_strtolower((string) ($primary?->email ?? '')),
            preferredDate: $booking->start_date?->toDateString(),
            durationDays: (int) $booking->duration_days,
            travelerCount: (int) $booking->traveler_count,
            destinationsSummary: $destinations,
            season: $season,
            flexibility: CustomBookingOptions::label('flexibility', (string) $booking->flexibility),
            routePreference: CustomBookingOptions::label('route', (string) $booking->route_preference),
            interestsSummary: $booking->interests
                ->pluck('interest')
                ->map(fn (mixed $interest): string => CustomBookingOptions::label('interest', (string) $interest))
                ->implode(', '),
            servicesSummary: implode(', ', $services) ?: 'To be confirmed',
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
