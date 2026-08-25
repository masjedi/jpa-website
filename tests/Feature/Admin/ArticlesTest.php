<?php

namespace Tests\Feature\Admin;

use App\Enums\ArticleStatus;
use App\Enums\TeamMemberStatus;
use App\Models\Article;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ArticlesTest extends TestCase
{
    use RefreshDatabase;

    private TeamMember $teamMember;

    protected function setUp(): void
    {
        parent::setUp();

        if (! extension_loaded('gd')) {
            $this->markTestSkipped('GD extension is required for article cover upload tests.');
        }

        Storage::fake('public');

        $this->teamMember = $this->createTeamMember();
    }

    public function test_authenticated_admin_can_view_articles_index(): void
    {
        $user = User::factory()->create();
        $article = $this->createArticleRecord();

        $this->actingAs($user)
            ->get('/admin/articles')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/Articles')
                ->has('articles', 1)
                ->where('articles.0.id', $article->id)
                ->where('articles.0.title', 'Spring packing guide'));
    }

    public function test_authenticated_admin_can_create_update_and_delete_article(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/articles', $this->validArticlePayload())
            ->assertRedirect(route('admin.articles.index'));

        $article = Article::query()->firstOrFail();

        $this->assertDatabaseHas('articles', [
            'id' => $article->id,
            'title' => 'Spring packing guide',
            'status' => ArticleStatus::Draft->value,
            'slug' => 'spring-packing-guide',
            'is_featured' => true,
            'team_member_id' => $this->teamMember->id,
            'author_name' => 'Wahid Rahimi',
            'author_role' => 'Founder & lead guide',
        ]);

        $this->assertNotNull($article->cover_media);

        $payload = $this->validArticlePayload();
        unset($payload['cover_image']);
        $payload['title'] = 'Updated spring packing guide';
        $payload['status'] = 'Published';

        $this->actingAs($user)
            ->patch("/admin/articles/{$article->id}", $payload)
            ->assertRedirect(route('admin.articles.index'));

        $this->assertDatabaseHas('articles', [
            'id' => $article->id,
            'title' => 'Updated spring packing guide',
            'status' => ArticleStatus::Published->value,
            'slug' => 'updated-spring-packing-guide',
        ]);

        $this->actingAs($user)
            ->delete("/admin/articles/{$article->id}")
            ->assertRedirect(route('admin.articles.index'));

        $this->assertDatabaseMissing('articles', [
            'id' => $article->id,
        ]);
    }

    public function test_guest_cannot_manage_articles(): void
    {
        $article = $this->createArticleRecord();

        $this->get('/admin/articles')->assertRedirect(route('admin.login'));

        $this->post('/admin/articles', $this->validArticlePayload())
            ->assertRedirect(route('admin.login'));

        $this->patch("/admin/articles/{$article->id}", $this->validArticlePayload())
            ->assertRedirect(route('admin.login'));

        $this->delete("/admin/articles/{$article->id}")
            ->assertRedirect(route('admin.login'));
    }

    public function test_article_update_without_new_cover_image(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/articles', $this->validArticlePayload())
            ->assertRedirect(route('admin.articles.index'));

        $article = Article::query()->firstOrFail();
        $originalCover = $article->cover_media;

        $payload = $this->validArticlePayload();
        unset($payload['cover_image']);
        $payload['title'] = 'Updated without new cover';

        $this->actingAs($user)
            ->patch("/admin/articles/{$article->id}", $payload)
            ->assertRedirect(route('admin.articles.index'));

        $article->refresh();

        $this->assertSame('Updated without new cover', $article->title);
        $this->assertSame($originalCover, $article->cover_media);
    }

    public function test_article_create_requires_cover_image(): void
    {
        $user = User::factory()->create();
        $payload = $this->validArticlePayload();
        unset($payload['cover_image']);

        $this->actingAs($user)
            ->post('/admin/articles', $payload)
            ->assertSessionHasErrors('cover_image');
    }

    /**
     * @return array<string, mixed>
     */
    private function validArticlePayload(): array
    {
        return [
            'title' => 'Spring packing guide',
            'summary' => 'Layering, footwear and small essentials for variable mountain weather.',
            'category' => 'Travel tips',
            'content' => '<p>Pack layers for highland mornings and warm afternoons.</p>',
            'team_member_id' => (string) $this->teamMember->id,
            'is_featured' => '1',
            'status' => 'Draft',
            'cover_image' => $this->makeCoverUpload(),
        ];
    }

    private function createTeamMember(): TeamMember
    {
        return TeamMember::query()->create([
            'status' => TeamMemberStatus::Published,
            'name' => 'Wahid Rahimi',
            'role' => 'Founder & lead guide',
            'bio' => 'Wahid has guided across all 34 provinces.',
            'email' => 'wahid@journey-to-afghanistan.com',
            'whatsapp' => '+93 70 123 4567',
            'whatsapp_href' => 'https://wa.me/93701234567',
            'avatar_media' => null,
            'sort_order' => 1,
        ]);
    }

    private function createArticleRecord(): Article
    {
        return Article::query()->create([
            'slug' => 'existing-article',
            'status' => ArticleStatus::Published,
            'title' => 'Spring packing guide',
            'summary' => 'Sample summary.',
            'category' => 'Travel tips',
            'content' => '<p>Existing article.</p>',
            'reading_time_minutes' => 3,
            'team_member_id' => $this->teamMember->id,
            'author_name' => 'Wahid Rahimi',
            'author_role' => 'Founder & lead guide',
            'author_avatar' => null,
            'is_featured' => false,
            'related_tour_slugs' => [],
            'published_at' => now(),
            'cover_media' => null,
        ]);
    }

    private function makeCoverUpload(): UploadedFile
    {
        $source = imagecreatetruecolor(1600, 1000);
        $this->assertNotFalse($source);
        imagefilledrectangle($source, 0, 0, 1599, 999, imagecolorallocate($source, 30, 90, 140));

        $tempPath = tempnam(sys_get_temp_dir(), 'article-cover-');
        $this->assertNotFalse($tempPath);
        $jpegPath = $tempPath.'.jpg';
        imagejpeg($source, $jpegPath, 85);
        imagedestroy($source);

        return new UploadedFile($jpegPath, 'cover.jpg', 'image/jpeg', null, true);
    }
}
