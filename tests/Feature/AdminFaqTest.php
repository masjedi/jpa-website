<?php

namespace Tests\Feature;

use App\Enums\FaqItemStatus;
use App\Models\FaqItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminFaqTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_admin_can_view_faq_index(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/admin/faq')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/Faq'));
    }

    public function test_admin_can_create_update_and_delete_faq_item(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/faq', [
                'question' => 'Do I need a visa?',
                'answer' => 'Most nationalities require a visa in advance.',
                'status' => 'Published',
            ])
            ->assertRedirect(route('admin.faq.index'))
            ->assertSessionHas('success');

        $item = FaqItem::query()->first();

        $this->assertNotNull($item);
        $this->assertSame('Do I need a visa?', $item->question);
        $this->assertSame(FaqItemStatus::Published, $item->status);
        $this->assertSame(1, $item->sort_order);

        $this->actingAs($user)
            ->patch("/admin/faq/{$item->id}", [
                'question' => 'Do I need a visa to visit Afghanistan?',
                'answer' => 'Updated guidance is available from your embassy.',
                'status' => 'Draft',
            ])
            ->assertRedirect(route('admin.faq.index'));

        $item->refresh();

        $this->assertSame(FaqItemStatus::Draft, $item->status);
        $this->assertSame('Do I need a visa to visit Afghanistan?', $item->question);

        $this->actingAs($user)
            ->delete("/admin/faq/{$item->id}")
            ->assertRedirect(route('admin.faq.index'));

        $this->assertDatabaseMissing('faq_items', ['id' => $item->id]);
    }

    public function test_homepage_only_loads_published_faq_items(): void
    {
        FaqItem::query()->create([
            'status' => FaqItemStatus::Published,
            'question' => 'Published question',
            'answer' => 'Published answer',
            'sort_order' => 1,
        ]);

        FaqItem::query()->create([
            'status' => FaqItemStatus::Draft,
            'question' => 'Draft question',
            'answer' => 'Draft answer',
            'sort_order' => 2,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Home')
                ->loadDeferredProps(fn ($reload) => $reload
                    ->has('faqItems', 1)
                    ->where('faqItems.0.question', 'Published question')));
    }

    public function test_faq_validation_requires_question_and_answer(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/faq', [
                'question' => '',
                'answer' => '',
                'status' => 'Draft',
            ])
            ->assertSessionHasErrors(['question', 'answer']);
    }
}
