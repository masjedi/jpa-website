<?php

namespace Tests\Feature;

use App\Enums\TestimonialStatus;
use App\Models\Testimonial;
use App\Models\User;
use App\Support\Translatable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminTestimonialsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        if (! extension_loaded('gd')) {
            $this->markTestSkipped('GD extension is required for testimonial avatar upload tests.');
        }

        Storage::fake('public');
    }

    public function test_authenticated_admin_can_view_testimonials_index(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/admin/testimonials')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/Testimonials'));
    }

    public function test_admin_can_create_update_and_delete_testimonial(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/testimonials', [
                'name' => $this->translation('Elena M.'),
                'journey' => $this->translation('Bamiyan Heritage Circuit, 2025'),
                'text' => $this->translation('The guide’s knowledge turned every site into a story.'),
                'rating' => 5,
                'status' => 'Published',
                'avatar_image' => $this->makeAvatarUpload(),
            ])
            ->assertRedirect(route('admin.testimonials.index'))
            ->assertSessionHas('success');

        $testimonial = Testimonial::query()->first();

        $this->assertNotNull($testimonial);
        $this->assertSame('Elena M.', Translatable::resolve($testimonial->name));
        $this->assertSame(TestimonialStatus::Published, $testimonial->status);
        $this->assertSame(1, $testimonial->sort_order);
        $this->assertNotNull($testimonial->avatar_media);

        $this->actingAs($user)
            ->patch("/admin/testimonials/{$testimonial->id}", [
                'name' => $this->translation('Elena M.'),
                'journey' => $this->translation('Bamiyan Heritage Circuit, 2026'),
                'text' => $this->translation('Updated quote from the traveller.'),
                'rating' => 4,
                'status' => 'Draft',
            ])
            ->assertRedirect(route('admin.testimonials.index'));

        $testimonial->refresh();

        $this->assertSame(TestimonialStatus::Draft, $testimonial->status);
        $this->assertSame('Updated quote from the traveller.', Translatable::resolve($testimonial->text));

        $this->actingAs($user)
            ->delete("/admin/testimonials/{$testimonial->id}")
            ->assertRedirect(route('admin.testimonials.index'));

        $this->assertDatabaseMissing('testimonials', ['id' => $testimonial->id]);
    }

    public function test_homepage_only_loads_published_testimonials(): void
    {
        Testimonial::query()->create([
            'status' => TestimonialStatus::Published,
            'name' => Translatable::normalize('Marcus T.'),
            'journey' => Translatable::normalize('Kabul & Panjshir Discovery, 2025'),
            'text' => Translatable::normalize('Responsive planning and honest advice.'),
            'rating' => 5,
            'sort_order' => 1,
        ]);

        Testimonial::query()->create([
            'status' => TestimonialStatus::Draft,
            'name' => Translatable::normalize('Draft traveller'),
            'journey' => Translatable::normalize('Draft journey'),
            'text' => Translatable::normalize('Draft quote.'),
            'rating' => 3,
            'sort_order' => 2,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Home')
                ->loadDeferredProps(fn ($reload) => $reload
                    ->has('testimonials', 1)
                    ->where('testimonials.0.name', 'Marcus T.')
                    ->where('testimonials.0.rating', 5)));
    }

    public function test_testimonial_validation_requires_core_fields(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/testimonials', [
                'name' => $this->translation(''),
                'journey' => $this->translation(''),
                'text' => $this->translation(''),
                'rating' => 0,
                'status' => 'Draft',
            ])
            ->assertSessionHasErrors(['name.en', 'journey.en', 'text.en', 'rating', 'avatar_image']);
    }

    private function makeAvatarUpload(): UploadedFile
    {
        $jpegPath = tempnam(sys_get_temp_dir(), 'testimonial-avatar-');

        $this->assertNotFalse($jpegPath);

        $image = imagecreatetruecolor(400, 400);
        $this->assertNotFalse($image);

        imagejpeg($image, $jpegPath);
        imagedestroy($image);

        return new UploadedFile($jpegPath, 'avatar.jpg', 'image/jpeg', null, true);
    }
}
