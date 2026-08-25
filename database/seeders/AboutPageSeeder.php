<?php

namespace Database\Seeders;

use App\Enums\AboutJourneyStepStatus;
use App\Models\AboutJourneyStep;
use App\Models\AboutPage;
use App\Support\About\AboutPageDefaults;
use App\Support\Media\AboutJourneyImage;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AboutPageSeeder extends Seeder
{
    public function run(): void
    {
        $page = AboutPage::query()->first() ?? AboutPage::query()->create(AboutPageDefaults::attributes());
        $page->update(AboutPageDefaults::attributes());

        if (AboutJourneyStep::query()->exists()) {
            return;
        }

        foreach ($this->journeySteps() as $index => $step) {
            $imageMedia = $this->storeJourneyImage($step['image_url']);

            AboutJourneyStep::query()->create([
                'status' => AboutJourneyStepStatus::Published,
                'title' => $step['title'],
                'description' => $step['description'],
                'image_media' => $imageMedia,
                'image_alt' => $step['image_alt'],
                'icon_key' => $step['icon_key'],
                'sort_order' => $index + 1,
            ]);
        }
    }

    /**
     * @return list<array{title: string, description: string, image_alt: string, icon_key: string, image_url: string}>
     */
    private function journeySteps(): array
    {
        return [
            [
                'title' => 'Local guiding roots',
                'description' => 'We began in 2019 guiding researchers, photographers and early visitors through Kabul and Bamiyan — learning routes face to face and building trust with hosts along the way.',
                'image_alt' => 'Mountain landscape in the Afghan highlands',
                'icon_key' => 'compass',
                'image_url' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Small-group tour seasons',
                'description' => 'By 2021 we launched structured small-group departures led by Afghan guides — turning lived knowledge into carefully timed seasons across the central highlands.',
                'image_alt' => 'Travellers sharing tea with local hosts',
                'icon_key' => 'users',
                'image_url' => 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Heritage-led itineraries',
                'description' => 'Our guides now weave Silk Road history, mosque etiquette and artisan visits into every route — helping travellers engage respectfully with the places they explore.',
                'image_alt' => 'Historic architecture and cultural heritage in Afghanistan',
                'icon_key' => 'hand-heart',
                'image_url' => 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Guides across Afghanistan',
                'description' => 'Today our team coordinates guides, drivers and regional hosts across twelve areas — each itinerary reviewed by someone who has recently travelled the route.',
                'image_alt' => 'Local artisan workshop visit on a guided journey',
                'icon_key' => 'route',
                'image_url' => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Responsible tourism ahead',
                'description' => 'We are expanding village homestays, guide training and community partnerships — so tourism supports Afghan families and preserves the heritage our guides interpret every day.',
                'image_alt' => 'Guide preparing for a cultural heritage journey',
                'icon_key' => 'shield-check',
                'image_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
            ],
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function storeJourneyImage(string $url): ?array
    {
        if (! extension_loaded('gd')) {
            return null;
        }

        try {
            $response = Http::timeout(20)->get($url);

            if (! $response->successful()) {
                return null;
            }

            $tempPath = tempnam(sys_get_temp_dir(), 'about-journey-seed-');

            if ($tempPath === false) {
                return null;
            }

            $jpegPath = $tempPath.'.jpg';
            file_put_contents($jpegPath, $response->body());

            $upload = new UploadedFile($jpegPath, Str::slug(basename($url)).'.jpg', 'image/jpeg', null, true);
            $asset = app(AboutJourneyImage::class)->store($upload);

            return $asset->toArray();
        } catch (\Throwable) {
            return null;
        }
    }
}
