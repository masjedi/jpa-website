<?php

namespace Tests\Feature;

use App\Enums\TeamMemberStatus;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminTeamsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        if (! extension_loaded('gd')) {
            $this->markTestSkipped('GD extension is required for team avatar upload tests.');
        }

        Storage::fake('public');
    }

    public function test_authenticated_admin_can_view_teams_index(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/admin/teams')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/Teams'));
    }

    public function test_admin_can_create_update_and_delete_team_member(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/teams', [
                'name' => 'Wahid Rahimi',
                'role' => 'Founder & lead guide',
                'bio' => 'Wahid has guided across all 34 provinces.',
                'email' => 'wahid@journey-to-afghanistan.com',
                'whatsapp' => '+93 70 123 4567',
                'whatsapp_href' => 'https://wa.me/93701234567',
                'status' => 'Published',
                'avatar_image' => $this->makeAvatarUpload(),
            ])
            ->assertRedirect(route('admin.teams.index'))
            ->assertSessionHas('success');

        $member = TeamMember::query()->first();

        $this->assertNotNull($member);
        $this->assertSame('Wahid Rahimi', $member->name);
        $this->assertSame(TeamMemberStatus::Published, $member->status);
        $this->assertSame(1, $member->sort_order);
        $this->assertIsArray($member->avatar_media);

        $this->actingAs($user)
            ->patch("/admin/teams/{$member->id}", [
                'name' => 'Wahid Rahimi',
                'role' => 'Lead guide',
                'bio' => 'Updated biography.',
                'email' => 'wahid@journey-to-afghanistan.com',
                'whatsapp' => '+93 70 123 4567',
                'whatsapp_href' => 'https://wa.me/93701234567',
                'status' => 'Draft',
            ])
            ->assertRedirect(route('admin.teams.index'));

        $member->refresh();

        $this->assertSame(TeamMemberStatus::Draft, $member->status);
        $this->assertSame('Lead guide', $member->role);

        $this->actingAs($user)
            ->delete("/admin/teams/{$member->id}")
            ->assertRedirect(route('admin.teams.index'));

        $this->assertDatabaseMissing('team_members', ['id' => $member->id]);
    }

    public function test_public_team_page_only_loads_published_members(): void
    {
        TeamMember::query()->create([
            'status' => TeamMemberStatus::Published,
            'name' => 'Published Member',
            'role' => 'Guide',
            'bio' => 'Published bio',
            'email' => 'published@example.com',
            'whatsapp' => '+93 70 111 1111',
            'whatsapp_href' => 'https://wa.me/93701111111',
            'sort_order' => 1,
        ]);

        TeamMember::query()->create([
            'status' => TeamMemberStatus::Draft,
            'name' => 'Draft Member',
            'role' => 'Coordinator',
            'bio' => 'Draft bio',
            'email' => 'draft@example.com',
            'whatsapp' => '+93 70 222 2222',
            'whatsapp_href' => 'https://wa.me/93702222222',
            'sort_order' => 2,
        ]);

        $this->get('/about/team')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/OurTeam')
                ->has('members', 1)
                ->where('members.0.name', 'Published Member'));
    }

    public function test_team_validation_requires_core_fields(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/teams', [
                'name' => '',
                'role' => '',
                'bio' => '',
                'email' => '',
                'whatsapp' => '',
                'whatsapp_href' => '',
                'status' => 'Draft',
            ])
            ->assertSessionHasErrors([
                'name',
                'role',
                'bio',
                'email',
                'whatsapp',
                'whatsapp_href',
                'avatar_image',
            ]);
    }

    private function makeAvatarUpload(): UploadedFile
    {
        $jpegPath = tempnam(sys_get_temp_dir(), 'team-avatar-');

        $this->assertNotFalse($jpegPath);

        $image = imagecreatetruecolor(480, 480);
        $this->assertNotFalse($image);

        imagejpeg($image, $jpegPath);
        imagedestroy($image);

        return new UploadedFile($jpegPath, 'avatar.jpg', 'image/jpeg', null, true);
    }
}
