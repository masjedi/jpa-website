<?php

namespace Database\Seeders;

use App\Enums\TourListingStatus;
use App\Enums\TourListingType;
use App\Models\Tour;
use App\Support\Media\TourCoverImage;
use App\Support\Tours\TourDuration;
use App\Support\Translatable;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class TourSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->catalog() as $listing) {
            $slug = $listing['slug'];
            $imageUrl = $listing['image_url'];
            unset($listing['image_url']);

            $existing = Tour::query()->where('slug', $slug)->first();

            if ($existing !== null) {
                if ($existing->cover_media === null) {
                    $cover = $this->storeCover($imageUrl);

                    if ($cover !== null) {
                        $existing->update(['cover_media' => $cover]);
                    }
                }

                continue;
            }

            $durationDays = (int) $listing['duration_days'];

            Tour::query()->create([
                ...$listing,
                'status' => TourListingStatus::Published,
                'duration_label' => TourDuration::label($durationDays),
                'cover_media' => $this->storeCover($imageUrl),
            ]);
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function catalog(): array
    {
        return [
            $this->tour([
                'slug' => 'kabul-heritage-and-city-life',
                'title' => 'Kabul Heritage & City Life',
                'destination' => 'Kabul & around',
                'region' => 'Eastern & Capital',
                'duration_days' => 4,
                'travel_style' => 'Cultural & Heritage',
                'difficulty' => 'Easy',
                'badge' => 'City stay',
                'image_url' => 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1600&q=80',
                'summary' => 'A calm introduction to the capital — museums, gardens, bazaars and hillside viewpoints — with a dedicated local guide and private vehicle.',
                'highlights' => [
                    'National Museum and Babur’s Gardens with a city historian',
                    'Chicken Street, Mandawi bazaar and a quiet tea-house stop',
                    'Evening viewpoint over the Kabul River valley',
                    'Optional day visit to Istalif pottery workshops',
                ],
                'inclusions' => [
                    'Private vehicle and vetted driver',
                    'English-speaking Kabul guide',
                    'Museum entries and city permits',
                    'Three nights in a vetted city hotel',
                    'Daily breakfast and two hosted lunches',
                ],
                'itinerary' => [
                    ['day' => 'Day 1', 'title' => 'Arrival in Kabul', 'summary' => 'Airport greeting, hotel check-in, and a gentle orientation walk if timings allow.'],
                    ['day' => 'Day 2', 'title' => 'Museums and gardens', 'summary' => 'National Museum, Babur’s Gardens, and a paced introduction to the old city.'],
                    ['day' => 'Day 3', 'title' => 'Bazaars and viewpoints', 'summary' => 'Markets, a hillside viewpoint, and time for photography or rest in the afternoon.'],
                    ['day' => 'Day 4', 'title' => 'Istalif or departure', 'summary' => 'Optional pottery village visit, or a transfer to the airport for onward travel.'],
                ],
            ]),
            $this->tour([
                'slug' => 'herat-silk-road-citadel',
                'title' => 'Herat Silk Road Citadel',
                'destination' => 'Herat',
                'region' => 'Western Silk Road',
                'duration_days' => 5,
                'travel_style' => 'Silk Road History',
                'difficulty' => 'Easy',
                'badge' => 'Heritage',
                'image_url' => 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80',
                'summary' => 'Five unhurried days among Timurid tilework, the citadel, Friday Mosque courtyards and artisan workshops in Afghanistan’s western cultural capital.',
                'highlights' => [
                    'Guided visit to the Citadel of Herat and its museum rooms',
                    'Friday Mosque courtyards and surviving Timurid tile panels',
                    'Glass-blowing and silk workshops with local artisans',
                    'Quiet evening walks through the old covered bazaar',
                ],
                'inclusions' => [
                    'Domestic flight or overland transfer coordination',
                    'Private vehicle in Herat',
                    'Local historian guide',
                    'Four nights in a heritage guesthouse or city hotel',
                    'Daily breakfast and selected hosted meals',
                ],
                'itinerary' => [
                    ['day' => 'Day 1', 'title' => 'Travel to Herat', 'summary' => 'Arrive by air or overland and settle into the old city at an easy pace.'],
                    ['day' => 'Day 2', 'title' => 'Citadel and Friday Mosque', 'summary' => 'A full heritage day with time to sit in courtyards between site visits.'],
                    ['day' => 'Day 3', 'title' => 'Artisans and bazaars', 'summary' => 'Workshops, covered markets, and a slower afternoon for photography.'],
                    ['day' => 'Day 4', 'title' => 'Shrines and city life', 'summary' => 'Gawhar Shad related sites, neighbourhood walks, and a hosted meal.'],
                    ['day' => 'Day 5', 'title' => 'Departure', 'summary' => 'Morning at leisure and transfer for the return flight or onward road.'],
                ],
            ]),
            $this->tour([
                'slug' => 'panjshir-valley-escape',
                'title' => 'Panjshir Valley Escape',
                'destination' => 'Panjshir Valley',
                'region' => 'Eastern & Capital',
                'duration_days' => 4,
                'travel_style' => 'Adventure & Trekking',
                'difficulty' => 'Moderate',
                'badge' => 'Valley',
                'image_url' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
                'summary' => 'A short highland journey from Kabul into the Panjshir — river gorges, village hospitality and moderate walks, planned with local valley guides.',
                'highlights' => [
                    'Scenic drive through the Panjshir gorge',
                    'Village tea stops and a hosted family lunch',
                    'Moderate riverside and hillside walks',
                    'Memorial sites interpreted by a local guide',
                ],
                'inclusions' => [
                    'Private 4WD from Kabul',
                    'Panjshir local guide and city escort',
                    'Regional access coordination',
                    'Three nights in simple valley guesthouses',
                    'Daily meals on the road and in villages',
                ],
                'itinerary' => [
                    ['day' => 'Day 1', 'title' => 'Kabul to Panjshir', 'summary' => 'Morning departure, gorge viewpoints, and a first night in the valley.'],
                    ['day' => 'Day 2', 'title' => 'Valley walks', 'summary' => 'Riverside paths, village visits, and time to rest between walks.'],
                    ['day' => 'Day 3', 'title' => 'Upper valley', 'summary' => 'A longer day toward higher hamlets, returning before dusk.'],
                    ['day' => 'Day 4', 'title' => 'Return to Kabul', 'summary' => 'Scenic drive back to the capital with a late-afternoon arrival.'],
                ],
            ]),
            $this->tour([
                'slug' => 'bamiyan-photography-trail',
                'title' => 'Bamiyan Photography Trail',
                'destination' => 'Bamiyan Valley',
                'region' => 'Central Highlands',
                'duration_days' => 6,
                'travel_style' => 'Photography Focus',
                'difficulty' => 'Moderate',
                'badge' => 'Light',
                'image_url' => 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1600&q=80',
                'summary' => 'Timed light at the Buddha cliffs, Shahr-e Gholghola and Band-e Amir — with extra space in the day for photographers who prefer patience over a packed checklist.',
                'highlights' => [
                    'Sunrise and late-light sessions at the Buddha niches',
                    'Full afternoon at Band-e Amir with sunset viewpoints',
                    'Red-city ruins and highland plateau compositions',
                    'Small group size so each stop can run longer',
                ],
                'inclusions' => [
                    'Private 4WD and driver',
                    'Guide familiar with photography pacing',
                    'Five nights in Bamiyan lodges',
                    'All meals and bottled water',
                    'National park and site fees',
                ],
                'itinerary' => [
                    ['day' => 'Day 1', 'title' => 'Arrive in Bamiyan', 'summary' => 'Settle in and an optional evening walk for first frames of the valley.'],
                    ['day' => 'Day 2', 'title' => 'Cliff niches', 'summary' => 'Morning and late-day sessions around the Buddha cliffs and caves.'],
                    ['day' => 'Day 3', 'title' => 'Shahr-e Gholghola', 'summary' => 'The Red City, plateau light, and a slower midday rest.'],
                    ['day' => 'Day 4', 'title' => 'Band-e Amir', 'summary' => 'A full day at the lakes with time to wait for weather and colour.'],
                    ['day' => 'Day 5', 'title' => 'Second lake light', 'summary' => 'Return for a different hour, or a village portrait morning if preferred.'],
                    ['day' => 'Day 6', 'title' => 'Departure', 'summary' => 'Transfer toward Kabul or a domestic flight, depending on the plan.'],
                ],
            ]),
            $this->tour([
                'slug' => 'kabul-and-panjshir-family-journey',
                'title' => 'Kabul & Panjshir Family Journey',
                'destination' => 'Panjshir Valley',
                'region' => 'Eastern & Capital',
                'duration_days' => 5,
                'travel_style' => 'Family friendly',
                'difficulty' => 'Easy',
                'badge' => 'Family',
                'image_url' => 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
                'summary' => 'A gently paced circuit for families — Kabul gardens and museums, then two nights in the Panjshir with shorter walks and hosted meals.',
                'highlights' => [
                    'Babur’s Gardens and a child-friendly museum visit',
                    'Private vehicle throughout, with rest stops built in',
                    'Valley guesthouse stay with simple family meals',
                    'Short walks rather than long trekking days',
                ],
                'inclusions' => [
                    'Private 4WD with child seats on request',
                    'Family-experienced guide',
                    'Four nights hotel and guesthouse stays',
                    'Daily breakfast and most lunches',
                    'All regional permits',
                ],
                'itinerary' => [
                    ['day' => 'Day 1', 'title' => 'Kabul arrival', 'summary' => 'Airport greeting and a quiet first evening at the hotel.'],
                    ['day' => 'Day 2', 'title' => 'Gardens and city', 'summary' => 'Short museum and garden visits with an unhurried lunch.'],
                    ['day' => 'Day 3', 'title' => 'Into Panjshir', 'summary' => 'Scenic drive with stops, arriving in time for a village dinner.'],
                    ['day' => 'Day 4', 'title' => 'Valley day', 'summary' => 'Easy walks, river viewpoints, and free time at the guesthouse.'],
                    ['day' => 'Day 5', 'title' => 'Return to Kabul', 'summary' => 'Morning departure and afternoon arrival in the capital.'],
                ],
            ]),
            $this->package([
                'slug' => 'afghanistan-essentials-circuit',
                'title' => 'Afghanistan Essentials Circuit',
                'tagline' => 'Eight days across Kabul, Bamiyan and Herat — a first journey, planned as an inquiry.',
                'destination' => 'Kabul & around',
                'region' => 'Multiple Regions',
                'duration_days' => 8,
                'badge' => 'Most requested',
                'is_popular' => true,
                'image_url' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
                'summary' => 'A balanced first circuit for travellers who want the capital, the highlands and Herat’s Silk Road heritage in one proposed itinerary. Dates, pacing and accommodation level are confirmed after we review your request.',
                'highlights' => [
                    'Kabul orientation with museum and garden visits',
                    'Bamiyan cliffs and a day at Band-e Amir',
                    'Herat citadel, Friday Mosque and artisan workshops',
                    'Domestic flight coordination to reduce long road days',
                ],
                'key_destinations' => ['Kabul', 'Bamiyan Valley', 'Band-e Amir', 'Herat'],
                'included_services' => [
                    'Letter of Invitation coordination',
                    'Private 4WD and professional driver',
                    'English-speaking lead guide',
                    'Seven nights vetted hotels and lodges',
                    'Daily breakfast and selected hosted meals',
                    'Site fees and provincial permits',
                ],
                'price_estimate' => 'From $1,890 / person · quotation on request',
                'ideal_for' => 'First-time visitors who want a complete first circuit',
                'journey_outline' => [
                    ['phase' => 'Days 1–2', 'title' => 'Kabul', 'summary' => 'Arrival, rest, and a paced introduction to the capital.'],
                    ['phase' => 'Days 3–5', 'title' => 'Bamiyan highlands', 'summary' => 'Cliff niches, valley villages, and the lakes of Band-e Amir.'],
                    ['phase' => 'Days 6–8', 'title' => 'Herat and return', 'summary' => 'Silk Road heritage in the west, then a return toward Kabul.'],
                ],
            ]),
            $this->package([
                'slug' => 'silk-road-west-package',
                'title' => 'Silk Road West Package',
                'tagline' => 'Six days focused on Herat, with Kabul as the gateway.',
                'destination' => 'Herat',
                'region' => 'Western Silk Road',
                'duration_days' => 6,
                'badge' => 'Heritage',
                'is_popular' => false,
                'image_url' => 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80',
                'summary' => 'A west-facing package for travellers drawn to Timurid architecture, covered bazaars and artisan workshops — with time in Kabul at each end of the journey.',
                'highlights' => [
                    'Two full heritage days in Herat',
                    'Citadel, Friday Mosque and workshop visits',
                    'Domestic flight coordination where available',
                    'A quieter pace than a multi-province circuit',
                ],
                'key_destinations' => ['Kabul', 'Herat'],
                'included_services' => [
                    'Visa invitation letter coordination',
                    'Airport transfers in Kabul and Herat',
                    'Private city vehicle in Herat',
                    'Local historian guide',
                    'Five nights accommodation',
                    'Daily breakfast',
                ],
                'price_estimate' => 'From $1,620 / person · quotation on request',
                'ideal_for' => 'Architecture and Silk Road history travellers',
                'journey_outline' => [
                    ['phase' => 'Day 1', 'title' => 'Kabul arrival', 'summary' => 'Meet-and-greet and an easy first night in the capital.'],
                    ['phase' => 'Days 2–5', 'title' => 'Herat', 'summary' => 'Citadel, mosques, bazaars and workshops at a measured pace.'],
                    ['phase' => 'Day 6', 'title' => 'Return', 'summary' => 'Flight or overland return to Kabul for departure.'],
                ],
            ]),
            $this->package([
                'slug' => 'highlands-family-package',
                'title' => 'Highlands Family Package',
                'tagline' => 'Seven days in Kabul and Bamiyan, shaped for families.',
                'destination' => 'Bamiyan Valley',
                'region' => 'Central Highlands',
                'duration_days' => 7,
                'badge' => 'Family',
                'is_popular' => false,
                'image_url' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
                'summary' => 'Shorter walking days, private transport and guesthouses chosen for rest as much as location — a highland week that families can request and then refine with our team.',
                'highlights' => [
                    'Two nights in Kabul before the highland drive',
                    'Buddha cliffs with time to pause, not rush',
                    'A full but flexible day at Band-e Amir',
                    'Private vehicle so the schedule can slow down',
                ],
                'key_destinations' => ['Kabul', 'Bamiyan Valley', 'Band-e Amir'],
                'included_services' => [
                    'Private 4WD and driver',
                    'Family-experienced guide',
                    'Six nights hotel and lodge stays',
                    'Most meals and bottled water',
                    'Park and monument fees',
                    'Child seats on request',
                ],
                'price_estimate' => 'From $1,740 / person · quotation on request',
                'ideal_for' => 'Families travelling with children at an easy pace',
                'journey_outline' => [
                    ['phase' => 'Days 1–2', 'title' => 'Kabul', 'summary' => 'Arrival, rest, gardens and a short city introduction.'],
                    ['phase' => 'Days 3–6', 'title' => 'Bamiyan', 'summary' => 'Cliffs, villages and the lakes, with free time built in.'],
                    ['phase' => 'Day 7', 'title' => 'Return', 'summary' => 'Drive or flight back to Kabul for departure.'],
                ],
            ]),
        ];
    }

    /**
     * @param  array<string, mixed>  $listing
     * @return array<string, mixed>
     */
    private function tour(array $listing): array
    {
        /** @var list<array{day: string, title: string, summary: string}> $itinerary */
        $itinerary = $listing['itinerary'];

        return [
            'slug' => $listing['slug'],
            'listing_type' => TourListingType::Tour,
            'title' => Translatable::normalize($listing['title']),
            'tagline' => null,
            'summary' => Translatable::normalize($listing['summary']),
            'destination' => Translatable::normalize($listing['destination']),
            'region' => $listing['region'],
            'duration_days' => $listing['duration_days'],
            'travel_style' => $listing['travel_style'],
            'difficulty' => $listing['difficulty'],
            'season' => Translatable::normalize('Year-round'),
            'best_months' => Translatable::normalize('May – October'),
            'group_size' => Translatable::normalize('Max 8 travelers / Private'),
            'badge' => Translatable::normalize($listing['badge']),
            'content' => Translatable::normalize($this->tourContent($listing['summary'], $itinerary)),
            'highlights' => Translatable::normalizeStringListStorage($listing['highlights']),
            'itinerary_overview' => Translatable::normalizeJsonListStorage($itinerary),
            'inclusions' => Translatable::normalizeStringListStorage($listing['inclusions']),
            'key_destinations' => null,
            'included_services' => null,
            'journey_outline' => null,
            'estimated_starting_price' => null,
            'price_estimate' => null,
            'ideal_for' => null,
            'next_departure_date' => Translatable::normalize('On request'),
            'next_departure_status' => Translatable::normalize('Open for Inquiries'),
            'is_popular' => false,
            'image_url' => $listing['image_url'],
        ];
    }

    /**
     * @param  array<string, mixed>  $listing
     * @return array<string, mixed>
     */
    private function package(array $listing): array
    {
        return [
            'slug' => $listing['slug'],
            'listing_type' => TourListingType::Package,
            'title' => Translatable::normalize($listing['title']),
            'tagline' => Translatable::normalize($listing['tagline']),
            'summary' => Translatable::normalize($listing['summary']),
            'destination' => Translatable::normalize($listing['destination']),
            'region' => $listing['region'],
            'duration_days' => $listing['duration_days'],
            'travel_style' => null,
            'difficulty' => null,
            'season' => null,
            'best_months' => null,
            'group_size' => null,
            'badge' => Translatable::normalize($listing['badge']),
            'content' => null,
            'highlights' => Translatable::normalizeStringListStorage($listing['highlights']),
            'itinerary_overview' => null,
            'inclusions' => null,
            'key_destinations' => Translatable::normalizeStringListStorage($listing['key_destinations']),
            'included_services' => Translatable::normalizeStringListStorage($listing['included_services']),
            'journey_outline' => Translatable::normalizeJsonListStorage($listing['journey_outline']),
            'estimated_starting_price' => null,
            'price_estimate' => Translatable::normalize($listing['price_estimate']),
            'ideal_for' => Translatable::normalize($listing['ideal_for']),
            'next_departure_date' => null,
            'next_departure_status' => null,
            'is_popular' => $listing['is_popular'],
            'image_url' => $listing['image_url'],
        ];
    }

    /**
     * @param  list<array{day: string, title: string, summary: string}>  $itinerary
     */
    private function tourContent(string $summary, array $itinerary): string
    {
        $days = collect($itinerary)
            ->map(fn (array $day): string => sprintf(
                '<li><strong>%s — %s.</strong> %s</li>',
                e($day['day']),
                e($day['title']),
                e($day['summary']),
            ))
            ->implode('');

        return '<p>'.e($summary).'</p>'
            .'<p>This is a custom tour request, not an instant reservation. After you send an inquiry, our team confirms dates, permits and a written quotation before anything is booked.</p>'
            .'<h2>Itinerary overview</h2>'
            .'<ol>'.$days.'</ol>'
            .'<p>Walking distances, overnight places and vehicle type can be adjusted when we plan the journey with you.</p>';
    }

    /**
     * @return array<string, mixed>|null
     */
    private function storeCover(string $url): ?array
    {
        if (! extension_loaded('gd')) {
            return null;
        }

        try {
            $response = Http::timeout(20)->get($url);

            if (! $response->successful()) {
                return null;
            }

            $tempPath = tempnam(sys_get_temp_dir(), 'tour-cover-seed-');

            if ($tempPath === false) {
                return null;
            }

            $jpegPath = $tempPath.'.jpg';
            file_put_contents($jpegPath, $response->body());

            $upload = new UploadedFile($jpegPath, Str::slug(basename(parse_url($url, PHP_URL_PATH) ?: 'cover')).'.jpg', 'image/jpeg', null, true);

            return app(TourCoverImage::class)->store($upload)->toArray();
        } catch (\Throwable) {
            return null;
        }
    }
}
