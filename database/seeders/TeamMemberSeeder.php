<?php

namespace Database\Seeders;

use App\Enums\TeamMemberStatus;
use App\Models\TeamMember;
use App\Support\Media\TeamAvatarImage;
use App\Support\SiteSettings\SiteSettingsDefaults;
use App\Support\Translatable;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        $imagesDirectory = $this->imagesDirectory();

        if ($imagesDirectory === null) {
            $this->command?->warn('TeamMemberSeeder skipped: jpa-images folder not found on Desktop.');

            return;
        }

        foreach ($this->catalog() as $index => $member) {
            $imageName = $member['image'];
            unset($member['image']);

            $imagePath = $imagesDirectory.DIRECTORY_SEPARATOR.$imageName;
            $existing = TeamMember::query()->where('email', $member['email'])->first();

            if ($existing !== null) {
                if ($existing->avatar_media === null) {
                    $avatar = $this->storeAvatar($imagePath);

                    if ($avatar !== null) {
                        $existing->update(['avatar_media' => $avatar]);
                    }
                }

                continue;
            }

            TeamMember::query()->create([
                ...$member,
                'sort_order' => $index + 1,
                'avatar_media' => $this->storeAvatar($imagePath),
            ]);
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function catalog(): array
    {
        $whatsapp = SiteSettingsDefaults::WHATSAPP_DISPLAY;
        $whatsappHref = SiteSettingsDefaults::WHATSAPP_HREF;

        return [
            [
                'status' => TeamMemberStatus::Published,
                'name' => Translatable::normalize('Wahid Rahimi'),
                'role' => Translatable::normalize('Founder & CEO'),
                'bio' => Translatable::normalize(
                    'Founded Journey to Peace Afghanistan Tours to connect international travellers with trusted Afghan guides, safe routes and culturally respectful itineraries.'
                ),
                'email' => 'leadership@journey-to-afghanistan.com',
                'whatsapp' => $whatsapp,
                'whatsapp_href' => $whatsappHref,
                'image' => 'ceo.jpg',
            ],
            [
                'status' => TeamMemberStatus::Published,
                'name' => Translatable::normalize('Omar Stanikzai'),
                'role' => Translatable::normalize('Lead Guide'),
                'bio' => Translatable::normalize(
                    'Leads multi-day circuits across Kabul, Bamiyan and the central highlands with a focus on heritage interpretation, guest safety and calm pacing.'
                ),
                'email' => 'guide@journey-to-afghanistan.com',
                'whatsapp' => $whatsapp,
                'whatsapp_href' => $whatsappHref,
                'image' => 'guide.jpg',
            ],
            [
                'status' => TeamMemberStatus::Published,
                'name' => Translatable::normalize('Farzana Ahmadi'),
                'role' => Translatable::normalize('Field Guide'),
                'bio' => Translatable::normalize(
                    'Specialises in village walks, women-led cultural visits and highland day routes where local etiquette and photography boundaries matter.'
                ),
                'email' => 'field-guide@journey-to-afghanistan.com',
                'whatsapp' => $whatsapp,
                'whatsapp_href' => $whatsappHref,
                'image' => 'guide2.jpg',
            ],
            [
                'status' => TeamMemberStatus::Published,
                'name' => Translatable::normalize('Reza Mohammadi'),
                'role' => Translatable::normalize('Translator & Cultural Liaison'),
                'bio' => Translatable::normalize(
                    'Supports Dari, Pashto and English communication between guests, guides and hosts so every meeting feels clear, respectful and unhurried.'
                ),
                'email' => 'translator@journey-to-afghanistan.com',
                'whatsapp' => $whatsapp,
                'whatsapp_href' => $whatsappHref,
                'image' => 'translator.jpg',
            ],
            [
                'status' => TeamMemberStatus::Published,
                'name' => Translatable::normalize('Mariam Sadat'),
                'role' => Translatable::normalize('Guest Relations Coordinator'),
                'bio' => Translatable::normalize(
                    'Coordinates inquiries, quotations and pre-departure details so every booking request is answered clearly before travel begins.'
                ),
                'email' => 'support@journey-to-afghanistan.com',
                'whatsapp' => $whatsapp,
                'whatsapp_href' => $whatsappHref,
                'image' => 'helpdesk.jpg',
            ],
        ];
    }

    private function imagesDirectory(): ?string
    {
        $home = getenv('USERPROFILE') ?: getenv('HOME') ?: '';

        $candidates = array_values(array_filter([
            env('JPA_TEAM_IMAGES_PATH'),
            env('JPA_IMAGES_PATH'),
            $home !== '' ? $home.DIRECTORY_SEPARATOR.'Desktop'.DIRECTORY_SEPARATOR.'jpa-images' : null,
            $home !== '' ? $home.DIRECTORY_SEPARATOR.'Desktop'.DIRECTORY_SEPARATOR.'jpa-image' : null,
            'D:'.DIRECTORY_SEPARATOR.'JPATors'.DIRECTORY_SEPARATOR.'jpa-images',
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
    private function storeAvatar(string $absolutePath): ?array
    {
        if (! extension_loaded('gd') || ! is_file($absolutePath)) {
            $this->command?->warn("Team avatar missing or GD unavailable: {$absolutePath}");

            return null;
        }

        $extension = strtolower(pathinfo($absolutePath, PATHINFO_EXTENSION) ?: 'jpg');

        if (! in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true)) {
            $this->command?->warn("Unsupported team avatar format: {$absolutePath}");

            return null;
        }

        try {
            $tempPath = tempnam(sys_get_temp_dir(), 'team-avatar-seed-');

            if ($tempPath === false) {
                return null;
            }

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

            return app(TeamAvatarImage::class)->store($upload)->toArray();
        } catch (\Throwable $exception) {
            $this->command?->warn('Team avatar failed: '.$exception->getMessage());

            return null;
        }
    }
}
