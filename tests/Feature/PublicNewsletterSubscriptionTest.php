<?php

namespace Tests\Feature;

use App\Enums\NewsletterSubscriptionSource;
use App\Enums\NewsletterSubscriptionStatus;
use App\Models\NewsletterSubscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicNewsletterSubscriptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_visitor_can_subscribe_from_footer_form(): void
    {
        $this->from('/')
            ->post('/newsletter/subscribe', [
                'email' => 'Traveler@Example.com',
                'source' => 'footer',
            ])
            ->assertRedirect('/')
            ->assertSessionHas('success');

        $this->assertDatabaseHas('newsletter_subscriptions', [
            'email' => 'traveler@example.com',
            'source' => NewsletterSubscriptionSource::Footer->value,
            'status' => NewsletterSubscriptionStatus::Active->value,
        ]);
    }

    public function test_duplicate_active_subscription_is_accepted_without_creating_new_row(): void
    {
        NewsletterSubscription::query()->create([
            'email' => 'traveler@example.com',
            'source' => NewsletterSubscriptionSource::Footer,
            'status' => NewsletterSubscriptionStatus::Active,
        ]);

        $this->from('/contact')
            ->post('/newsletter/subscribe', [
                'email' => 'traveler@example.com',
                'source' => 'footer',
            ])
            ->assertRedirect('/contact')
            ->assertSessionHas('success');

        $this->assertSame(1, NewsletterSubscription::query()->count());
    }

    public function test_unsubscribed_email_is_reactivated_on_resubscribe(): void
    {
        NewsletterSubscription::query()->create([
            'email' => 'traveler@example.com',
            'source' => NewsletterSubscriptionSource::Footer,
            'status' => NewsletterSubscriptionStatus::Unsubscribed,
        ]);

        $this->post('/newsletter/subscribe', [
            'email' => 'traveler@example.com',
            'source' => 'footer',
        ])->assertSessionHas('success');

        $this->assertDatabaseHas('newsletter_subscriptions', [
            'email' => 'traveler@example.com',
            'status' => NewsletterSubscriptionStatus::Active->value,
        ]);
    }

    public function test_invalid_email_is_rejected(): void
    {
        $this->from('/')
            ->post('/newsletter/subscribe', [
                'email' => 'not-an-email',
            ])
            ->assertSessionHasErrors('email');

        $this->assertDatabaseCount('newsletter_subscriptions', 0);
    }

    public function test_authenticated_admin_can_view_saved_subscriptions(): void
    {
        $user = User::factory()->create();

        NewsletterSubscription::query()->create([
            'email' => 'traveler@example.com',
            'source' => NewsletterSubscriptionSource::Footer,
            'status' => NewsletterSubscriptionStatus::Active,
        ]);

        $this->actingAs($user)
            ->get('/admin/subscriptions')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/Subscriptions')
                ->has('subscriptions', 1)
                ->where('subscriptions.0.email', 'traveler@example.com')
                ->where('subscriptions.0.source', 'Footer')
                ->where('subscriptions.0.status', 'Active'));
    }

    public function test_authenticated_admin_can_delete_subscription(): void
    {
        $user = User::factory()->create();

        $subscription = NewsletterSubscription::query()->create([
            'email' => 'traveler@example.com',
            'source' => NewsletterSubscriptionSource::Footer,
            'status' => NewsletterSubscriptionStatus::Active,
        ]);

        $this->actingAs($user)
            ->delete("/admin/subscriptions/{$subscription->id}")
            ->assertRedirect(route('admin.subscriptions.index'))
            ->assertSessionHas('success');

        $this->assertDatabaseMissing('newsletter_subscriptions', [
            'id' => $subscription->id,
        ]);
    }

    public function test_guest_cannot_delete_subscription(): void
    {
        $subscription = NewsletterSubscription::query()->create([
            'email' => 'traveler@example.com',
            'source' => NewsletterSubscriptionSource::Footer,
            'status' => NewsletterSubscriptionStatus::Active,
        ]);

        $this->delete("/admin/subscriptions/{$subscription->id}")
            ->assertRedirect(route('admin.login'));

        $this->assertDatabaseHas('newsletter_subscriptions', [
            'id' => $subscription->id,
        ]);
    }
}
