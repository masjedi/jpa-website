<?php

namespace Tests\Feature;

use App\Enums\AdminNotificationType;
use App\Enums\InquirySource;
use App\Enums\InquiryStatus;
use App\Enums\NewsletterSubscriptionSource;
use App\Enums\NewsletterSubscriptionStatus;
use App\Models\AdminNotification;
use App\Models\Inquiry;
use App\Models\NewsletterSubscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminFeedTest extends TestCase
{
    use RefreshDatabase;

    public function test_newsletter_subscription_creates_admin_notification_listed_latest_first(): void
    {
        $this->post('/newsletter/subscribe', [
            'email' => 'first@example.com',
            'source' => 'footer',
        ])->assertSessionHas('success');

        $this->post('/newsletter/subscribe', [
            'email' => 'latest@example.com',
            'source' => 'footer',
        ])->assertSessionHas('success');

        $this->assertDatabaseCount('admin_notifications', 2);

        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/admin/dashboard')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('adminFeed.notifications', 2)
                ->where('adminFeed.notifications.0.description', 'latest@example.com subscribed from Footer.')
                ->where('adminFeed.notifications.1.description', 'first@example.com subscribed from Footer.')
                ->where('adminFeed.unreadNotifications', 2));
    }

    public function test_contact_and_tour_inquiries_appear_in_messages_latest_first(): void
    {
        $this->post('/inquiries/contact', [
            'name' => 'Contact Person',
            'email' => 'contact@example.com',
            'topic' => 'General question',
            'message' => 'First contact message',
        ])->assertSessionHas('success');

        $this->post('/inquiries/tour', [
            'tourTitle' => 'Bamiyan Circuit',
            'fullName' => 'Tour Traveler',
            'email' => 'tour@example.com',
            'notes' => 'Latest tour inquiry notes',
            'travelerCount' => '2',
        ])->assertSessionHas('success');

        $this->assertDatabaseHas('inquiries', [
            'email' => 'contact@example.com',
            'source' => InquirySource::Contact->value,
            'status' => InquiryStatus::New->value,
        ]);

        $this->assertDatabaseHas('inquiries', [
            'email' => 'tour@example.com',
            'source' => InquirySource::TourInquiry->value,
            'subject' => 'Bamiyan Circuit',
        ]);

        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/admin/dashboard')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('adminFeed.messages', 2)
                ->where('adminFeed.messages.0.title', 'Tour Traveler')
                ->where('adminFeed.messages.1.title', 'Contact Person')
                ->where('adminFeed.unreadMessages', 2));
    }

    public function test_admin_inquiries_index_lists_saved_inquiries(): void
    {
        Inquiry::query()->create([
            'source' => InquirySource::Contact,
            'status' => InquiryStatus::New,
            'name' => 'Contact Person',
            'email' => 'contact@example.com',
            'subject' => 'General question',
            'message' => 'Hello',
        ]);

        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/admin/inquiries')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/Inquiries')
                ->has('inquiries', 1)
                ->where('inquiries.0.email', 'contact@example.com'));

        $this->assertNull(Inquiry::query()->first()?->read_at);

        $this->actingAs($user)
            ->post('/admin/feed/messages/read')
            ->assertRedirect();

        $this->assertNotNull(Inquiry::query()->first()?->read_at);
    }

    public function test_opening_notifications_feed_marks_them_read(): void
    {
        AdminNotification::query()->create([
            'type' => AdminNotificationType::NewsletterSubscription,
            'title' => 'New newsletter subscription',
            'description' => 'traveler@example.com subscribed from Footer.',
            'href' => '/admin/subscriptions',
        ]);

        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/admin/dashboard')
            ->assertInertia(fn ($page) => $page->where('adminFeed.unreadNotifications', 1));

        $this->actingAs($user)
            ->from('/admin/dashboard')
            ->post('/admin/feed/notifications/read')
            ->assertRedirect('/admin/dashboard');

        $this->assertNotNull(AdminNotification::query()->first()?->read_at);
    }

    public function test_duplicate_active_subscription_does_not_create_extra_notification(): void
    {
        NewsletterSubscription::query()->create([
            'email' => 'traveler@example.com',
            'source' => NewsletterSubscriptionSource::Footer,
            'status' => NewsletterSubscriptionStatus::Active,
        ]);

        AdminNotification::query()->create([
            'type' => AdminNotificationType::NewsletterSubscription,
            'title' => 'Existing',
            'description' => 'Existing notification',
            'href' => '/admin/subscriptions',
        ]);

        $this->post('/newsletter/subscribe', [
            'email' => 'traveler@example.com',
            'source' => 'footer',
        ])->assertSessionHas('success');

        $this->assertDatabaseCount('admin_notifications', 1);
    }
}
