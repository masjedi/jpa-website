<?php

namespace Tests\Feature;

use App\Enums\InquirySource;
use App\Enums\InquiryStatus;
use App\Models\Inquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicInquiryTest extends TestCase
{
    use RefreshDatabase;

    public function test_visitor_can_submit_contact_inquiry(): void
    {
        $this->from('/contact')
            ->post('/inquiries/contact', [
                'name' => '  Sara Ahmad  ',
                'email' => 'Sara@Example.com',
                'subject' => 'Plan a custom trip',
                'message' => 'We would like a private itinerary for spring travel.',
            ])
            ->assertRedirect('/contact')
            ->assertSessionHas('success');

        $this->assertDatabaseHas('inquiries', [
            'source' => InquirySource::Contact->value,
            'status' => InquiryStatus::New->value,
            'name' => 'Sara Ahmad',
            'email' => 'sara@example.com',
            'subject' => 'Plan a custom trip',
            'message' => 'We would like a private itinerary for spring travel.',
        ]);
    }

    public function test_contact_inquiry_rejects_short_subject(): void
    {
        $this->from('/contact')
            ->post('/inquiries/contact', [
                'name' => 'Sara Ahmad',
                'email' => 'sara@example.com',
                'subject' => 'Hi',
                'message' => 'This should not be accepted by validation.',
            ])
            ->assertSessionHasErrors('subject');

        $this->assertDatabaseCount('inquiries', 0);
    }

    public function test_contact_inquiry_rejects_short_message(): void
    {
        $this->from('/contact')
            ->post('/inquiries/contact', [
                'name' => 'Sara Ahmad',
                'email' => 'sara@example.com',
                'subject' => 'General question',
                'message' => 'Too short',
            ])
            ->assertSessionHasErrors('message');

        $this->assertDatabaseCount('inquiries', 0);
    }

    public function test_contact_inquiry_rejects_invalid_email_and_name(): void
    {
        $this->from('/contact')
            ->post('/inquiries/contact', [
                'name' => 'A',
                'email' => 'not-an-email',
                'subject' => 'General question',
                'message' => 'This message is long enough to pass validation.',
            ])
            ->assertSessionHasErrors(['name', 'email']);

        $this->assertDatabaseCount('inquiries', 0);
    }

    public function test_contact_inquiry_rejects_mass_assignment_fields(): void
    {
        $this->from('/contact')
            ->post('/inquiries/contact', [
                'name' => 'Sara Ahmad',
                'email' => 'sara@example.com',
                'subject' => 'General question',
                'message' => 'This message is long enough to pass validation.',
                'status' => 'read',
                'source' => 'tour_inquiry',
            ])
            ->assertSessionHasErrors(['status', 'source']);

        $this->assertDatabaseCount('inquiries', 0);
    }

    public function test_visitor_can_submit_tour_inquiry(): void
    {
        $this->from('/tours')
            ->post('/inquiries/tour', [
                'tourTitle' => 'Bamiyan Heritage Tour',
                'preferredDate' => 'April 2026',
                'travelerCount' => '3-4',
                'fullName' => 'James Miller',
                'email' => 'James@Example.com',
                'nationality' => 'United Kingdom',
                'whatsappOrPhone' => '+44 7700 900123',
                'notes' => 'We prefer a slower pace with extra museum time.',
            ])
            ->assertRedirect('/tours')
            ->assertSessionHas('success');

        $inquiry = Inquiry::query()->first();

        $this->assertNotNull($inquiry);
        $this->assertSame(InquirySource::TourInquiry, $inquiry->source);
        $this->assertSame('James Miller', $inquiry->name);
        $this->assertSame('james@example.com', $inquiry->email);
        $this->assertSame('Bamiyan Heritage Tour', $inquiry->subject);
        $this->assertSame('April 2026', $inquiry->preferred_date);
        $this->assertSame('3-4', $inquiry->traveler_count);
        $this->assertSame('United Kingdom', $inquiry->nationality);
        $this->assertSame('+44 7700 900123', $inquiry->phone);
    }

    public function test_tour_inquiry_rejects_invalid_traveler_count(): void
    {
        $this->from('/tours')
            ->post('/inquiries/tour', [
                'tourTitle' => 'Bamiyan Heritage Tour',
                'travelerCount' => '99',
                'fullName' => 'James Miller',
                'email' => 'james@example.com',
            ])
            ->assertSessionHasErrors('travelerCount');

        $this->assertDatabaseCount('inquiries', 0);
    }

    public function test_tour_inquiry_rejects_invalid_phone_number(): void
    {
        $this->from('/tours')
            ->post('/inquiries/tour', [
                'tourTitle' => 'Bamiyan Heritage Tour',
                'fullName' => 'James Miller',
                'email' => 'james@example.com',
                'whatsappOrPhone' => 'call-me-later',
            ])
            ->assertSessionHasErrors('whatsappOrPhone');

        $this->assertDatabaseCount('inquiries', 0);
    }

    public function test_tour_inquiry_rejects_mass_assignment_fields(): void
    {
        $this->from('/tours')
            ->post('/inquiries/tour', [
                'tourTitle' => 'Bamiyan Heritage Tour',
                'fullName' => 'James Miller',
                'email' => 'james@example.com',
                'status' => 'read',
            ])
            ->assertSessionHasErrors('status');

        $this->assertDatabaseCount('inquiries', 0);
    }
}
