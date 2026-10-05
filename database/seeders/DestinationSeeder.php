<?php

namespace Database\Seeders;

use App\Enums\DestinationStatus;
use App\Models\Destination;
use App\Support\Media\DestinationCoverImage;
use App\Support\Translatable;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class DestinationSeeder extends Seeder
{
    public function run(): void
    {
        $imagesDirectory = $this->imagesDirectory();

        if ($imagesDirectory === null) {
            $this->command?->warn('DestinationSeeder skipped: jpa-images folder not found.');

            return;
        }

        foreach ($this->catalog() as $destination) {
            $imageName = $destination['image'];
            unset($destination['image']);

            $imagePath = $imagesDirectory.DIRECTORY_SEPARATOR.$imageName;
            $existing = Destination::query()->where('slug', $destination['slug'])->first();

            if ($existing !== null) {
                if ($existing->cover_media === null) {
                    $cover = $this->storeCover($imagePath);

                    if ($cover !== null) {
                        $existing->update(['cover_media' => $cover]);
                    }
                }

                continue;
            }

            Destination::query()->create([
                ...$destination,
                'cover_media' => $this->storeCover($imagePath),
            ]);
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function catalog(): array
    {
        return [
            [
                'slug' => 'kabul',
                'status' => DestinationStatus::Published,
                'name' => Translatable::normalize('Kabul'),
                'tagline' => Translatable::normalize('Capital museums, gardens and hillside viewpoints.'),
                'region' => 'Eastern & Capital',
                'badge' => Translatable::normalize('City stay'),
                'description' => Translatable::normalize(
                    'Kabul is a paced introduction to Afghanistan’s capital — museums, Babur’s Gardens, bazaars and valley viewpoints, led by local guides who know when to move and when to pause.'
                ),
                'highlights' => Translatable::normalizeStringListStorage([
                    'National Museum and Babur’s Gardens',
                    'Chicken Street and Mandawi bazaar walks',
                    'Hillside viewpoints over the Kabul River valley',
                    'Optional day visit to Istalif pottery workshops',
                ]),
                'best_season' => Translatable::normalize('April – November'),
                'travel_style' => Translatable::normalize('Cultural & Heritage'),
                'practical_notes' => Translatable::normalizeStringListStorage([
                    'Private vehicle and vetted driver recommended in the city.',
                    'Dress modestly for bazaars, mosques and family neighbourhoods.',
                    'Museum and garden timings can shift — we confirm on the day.',
                ]),
                'tour_match_keywords' => ['Kabul', 'Kabul & around', 'Istalif'],
                'is_featured' => true,
                'image' => 'Kabul city.jpg',
            ],
            [
                'slug' => 'bamiyan-valley',
                'status' => DestinationStatus::Published,
                'name' => Translatable::normalize('Bamiyan Valley'),
                'tagline' => Translatable::normalize('Buddha niches, highland light and village hospitality.'),
                'region' => 'Central Highlands',
                'badge' => Translatable::normalize('Signature'),
                'description' => Translatable::normalize(
                    'Bamiyan is the heart of highland travel in Afghanistan — cliff niches, quiet valleys, and evenings with hosts who still welcome guests with tea and stories of the Buddha cliffs.'
                ),
                'highlights' => Translatable::normalizeStringListStorage([
                    'Buddha cliff niches and cultural landscape walks',
                    'Village stays with local hosts',
                    'Sunrise and late-light photography across the valley',
                    'Day trips toward Band-e Amir when conditions allow',
                ]),
                'best_season' => Translatable::normalize('May – October'),
                'travel_style' => Translatable::normalize('Cultural & nature'),
                'practical_notes' => Translatable::normalizeStringListStorage([
                    'Nights can be cold even in summer — pack layers.',
                    'Road conditions vary with snowmelt and weather.',
                    'Guides confirm shrine and cliff-site etiquette on arrival.',
                ]),
                'tour_match_keywords' => ['Bamiyan', 'Bamiyan Valley'],
                'is_featured' => true,
                'image' => 'bot bamiyan.jpg',
            ],
            [
                'slug' => 'herat',
                'status' => DestinationStatus::Published,
                'name' => Translatable::normalize('Herat'),
                'tagline' => Translatable::normalize('Timurid courtyards, citadel walls and silk-road artisan streets.'),
                'region' => 'Western Silk Road',
                'badge' => Translatable::normalize('Heritage'),
                'description' => Translatable::normalize(
                    'Herat rewards unhurried days among the citadel, Friday Mosque courtyards, glass workshops and covered bazaars — a western cultural capital best explored with a local historian guide.'
                ),
                'highlights' => Translatable::normalizeStringListStorage([
                    'Citadel of Herat and museum rooms',
                    'Friday Mosque courtyards and Timurid tilework',
                    'Glass-blowing and silk artisan visits',
                    'Evening walks through the old covered bazaar',
                ]),
                'best_season' => Translatable::normalize('March – November'),
                'travel_style' => Translatable::normalize('Silk Road History'),
                'practical_notes' => Translatable::normalizeStringListStorage([
                    'Domestic flights or overland transfers can be arranged.',
                    'Remove shoes and follow guide cues at mosque courtyards.',
                    'Photography may be restricted in some workshops — ask first.',
                ]),
                'tour_match_keywords' => ['Herat'],
                'is_featured' => true,
                'image' => 'herat.jpg',
            ],
            [
                'slug' => 'panjshir-valley',
                'status' => DestinationStatus::Published,
                'name' => Translatable::normalize('Panjshir Valley'),
                'tagline' => Translatable::normalize('River gorges, green slopes and calm highland escapes.'),
                'region' => 'Northern Valleys',
                'badge' => Translatable::normalize('Nature'),
                'description' => Translatable::normalize(
                    'Panjshir offers cooler air, riverside stops and mountain views within a manageable drive of Kabul — a restorative valley day or overnight when conditions and permissions allow.'
                ),
                'highlights' => Translatable::normalizeStringListStorage([
                    'Scenic drive into the Panjshir gorge',
                    'Riverside lunch stops and short walks',
                    'Highland viewpoints for photography',
                    'Optional overnight in a vetted valley guesthouse',
                ]),
                'best_season' => Translatable::normalize('April – October'),
                'travel_style' => Translatable::normalize('Nature & soft adventure'),
                'practical_notes' => Translatable::normalizeStringListStorage([
                    'Access depends on current road and security advice.',
                    'Bring sun protection and a light jacket for higher elevations.',
                    'We confirm local permissions before departure.',
                ]),
                'tour_match_keywords' => ['Panjshir', 'Panjshir Valley'],
                'is_featured' => false,
                'image' => 'green mountains.jpg',
            ],
            [
                'slug' => 'band-e-amir',
                'status' => DestinationStatus::Published,
                'name' => Translatable::normalize('Band-e Amir'),
                'tagline' => Translatable::normalize('Turquoise highland lakes set among limestone cliffs.'),
                'region' => 'Central Highlands',
                'badge' => Translatable::normalize('Landscape'),
                'description' => Translatable::normalize(
                    'Band-e Amir is Afghanistan’s most striking lake landscape — a chain of mineral-blue waters best visited from Bamiyan with time for quiet walks, viewpoints and respectful lakeside pauses.'
                ),
                'highlights' => Translatable::normalizeStringListStorage([
                    'National park lake viewpoints',
                    'Short cliff-edge walks with local guidance',
                    'Midday rest by the turquoise water',
                    'Combined day trips from Bamiyan when weather allows',
                ]),
                'best_season' => Translatable::normalize('June – September'),
                'travel_style' => Translatable::normalize('Nature & photography'),
                'practical_notes' => Translatable::normalizeStringListStorage([
                    'Altitude and wind can feel sharp — pack layers and water.',
                    'Stay on marked paths near cliffs and lake edges.',
                    'Road access is seasonal; we confirm conditions before travel.',
                ]),
                'tour_match_keywords' => ['Band-e Amir', 'Bande Amir', 'Band-e-Amir'],
                'is_featured' => true,
                'image' => 'mountains nature.jpg',
            ],
        ];
    }

    private function imagesDirectory(): ?string
    {
        $candidates = array_values(array_filter([
            env('JPA_IMAGES_PATH'),
            'D:'.DIRECTORY_SEPARATOR.'PATours'.DIRECTORY_SEPARATOR.'jpa-images',
            'D:'.DIRECTORY_SEPARATOR.'JPATors'.DIRECTORY_SEPARATOR.'jpa-images',
            base_path('..'.DIRECTORY_SEPARATOR.'jpa-images'),
        ]));

        foreach ($candidates as $candidate) {
            if (is_string($candidate) && is_dir($candidate)) {
                return $candidate;
            }
        }

        return null;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function storeCover(string $absolutePath): ?array
    {
        if (! extension_loaded('gd') || ! is_file($absolutePath)) {
            $this->command?->warn("Destination cover missing or GD unavailable: {$absolutePath}");

            return null;
        }

        try {
            $tempPath = tempnam(sys_get_temp_dir(), 'destination-cover-seed-');

            if ($tempPath === false) {
                return null;
            }

            $extension = strtolower(pathinfo($absolutePath, PATHINFO_EXTENSION) ?: 'jpg');
            $workingPath = $tempPath.'.'.$extension;
            @unlink($tempPath);

            if (! copy($absolutePath, $workingPath)) {
                return null;
            }

            $upload = new UploadedFile(
                $workingPath,
                Str::slug(pathinfo($absolutePath, PATHINFO_FILENAME)).'.'.$extension,
                mime_content_type($absolutePath) ?: 'image/jpeg',
                null,
                true,
            );

            return app(DestinationCoverImage::class)->store($upload)->toArray();
        } catch (\Throwable $exception) {
            $this->command?->warn('Destination cover failed: '.$exception->getMessage());

            return null;
        }
    }
}
