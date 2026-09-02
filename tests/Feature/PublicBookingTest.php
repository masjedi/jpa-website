<?php

namespace Tests\Feature;

use App\Enums\CustomBookingStatus;
use App\Enums\DestinationStatus;
use App\Enums\TourFilterOptionStatus;
use App\Enums\TourFilterOptionType;
use App\Mail\CustomBookingRequestReceived;
use App\Mail\CustomBookingSubmittedForTeam;
use App\Models\CustomBooking;
use App\Models\Destination;
use App\Models\TourFilterOption;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PublicBookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_booking_page_renders_the_custom_request_form(): void
    {
        $this->get('/booking')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Booking')
                ->has('destinations')
                ->has('seasons'));
    }

    public function test_booking_page_uses_published_destinations_and_seasons(): void
    {
        Destination::query()->create($this->destinationAttributes([
            'slug' => 'herat',
            'name' => 'Herat',
            'status' => DestinationStatus::Published,
        ]));

        Destination::query()->create($this->destinationAttributes([
            'slug' => 'draft-city',
            'name' => 'Draft City',
            'status' => DestinationStatus::Draft,
        ]));

        TourFilterOption::query()->create([
            'type' => TourFilterOptionType::Destination,
            'name' => 'Panjshir Valley',
            'status' => TourFilterOptionStatus::Published,
            'sort_order' => 1,
        ]);

        TourFilterOption::query()->create([
            'type' => TourFilterOptionType::Season,
            'name' => 'Spring',
            'status' => TourFilterOptionStatus::Published,
            'sort_order' => 1,
        ]);

        $this->get('/booking')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/Booking')
                ->where('destinations', ['Herat', 'Panjshir Valley'])
                ->where('seasons', ['Spring']));
    }

    public function test_visitor_can_submit_a_custom_booking_request(): void
    {
        Mail::fake();
        $this->seedPublishedLookups();

        $this->from('/booking')
            ->post('/booking', $this->validPayload())
            ->assertRedirect('/booking')
            ->assertSessionHas('customBookingSuccess', function (array $payload): bool {
                return $payload['email'] === 'sara@example.com'
                    && $payload['firstName'] === 'Sara'
                    && $payload['status'] === 'submitted'
                    && $payload['travelerCount'] === 2
                    && str_starts_with((string) $payload['reference'], 'JTP-');
            });

        $booking = CustomBooking::query()->with(['travelers', 'destinations', 'interests', 'documents'])->first();

        $this->assertNotNull($booking);
        $this->assertSame(CustomBookingStatus::Submitted, $booking->status);
        $this->assertStringStartsWith('JTP-', $booking->reference);
        $this->assertSame(2, $booking->travelers->count());
        $this->assertSame('sara@example.com', $booking->primaryTraveler?->email);
        $this->assertTrue($booking->travelers->first()?->is_primary);
        $this->assertNull($booking->travelers->last()?->email);
        $this->assertSame(['Herat'], $booking->destinations->pluck('name')->all());
        $this->assertSame(['culture', 'nature'], $booking->interests->pluck('interest')->all());
        $this->assertSame(2, $booking->documents->count());
        $this->assertTrue($booking->wants_complete);
        $this->assertNull($booking->vehicle);
        $this->assertDatabaseCount('inquiries', 0);

        Mail::assertQueued(CustomBookingRequestReceived::class, function (CustomBookingRequestReceived $mail) use ($booking): bool {
            return $mail->booking->is($booking);
        });
        Mail::assertQueued(CustomBookingSubmittedForTeam::class, function (CustomBookingSubmittedForTeam $mail) use ($booking): bool {
            return $mail->booking->is($booking);
        });
    }

    public function test_custom_booking_does_not_persist_stale_service_details(): void
    {
        Mail::fake();
        $this->seedPublishedLookups();

        $payload = $this->validPayload();
        $payload['services']['guide'] = false;
        $payload['services']['guideLanguage'] = 'english';
        $payload['services']['guideGender'] = 'male';
        $payload['services']['transportation'] = false;
        $payload['services']['vehicle'] = 'suv';

        $this->from('/booking')->post('/booking', $payload)->assertRedirect('/booking');

        $booking = CustomBooking::query()->first();
        $this->assertNotNull($booking);
        $this->assertFalse($booking->wants_guide);
        $this->assertNull($booking->guide_language);
        $this->assertNull($booking->guide_gender);
        $this->assertFalse($booking->wants_transportation);
        $this->assertNull($booking->vehicle);
    }

    public function test_custom_booking_requires_the_three_review_agreements(): void
    {
        Mail::fake();
        $this->seedPublishedLookups();

        $payload = $this->validPayload();
        $payload['agreements'] = [
            'accuracy' => false,
            'terms' => false,
            'privacy' => false,
            'marketing' => false,
        ];

        $this->from('/booking')
            ->post('/booking', $payload)
            ->assertRedirect('/booking')
            ->assertSessionHasErrors(['agreements.accuracy', 'agreements.terms', 'agreements.privacy']);

        $this->assertDatabaseCount('custom_bookings', 0);
        Mail::assertNothingOutgoing();
    }

    public function test_custom_booking_rejects_an_invalid_email(): void
    {
        Mail::fake();
        $this->seedPublishedLookups();

        $payload = $this->validPayload();
        $payload['travelers']['primary']['email'] = 'not-an-email';

        $this->from('/booking')
            ->post('/booking', $payload)
            ->assertSessionHasErrors('travelers.primary.email');

        $this->assertDatabaseCount('custom_bookings', 0);
        Mail::assertNothingOutgoing();
    }

    public function test_custom_booking_rejects_an_invalid_phone(): void
    {
        Mail::fake();
        $this->seedPublishedLookups();

        $payload = $this->validPayload();
        $payload['travelers']['primary']['phone'] = '1776687088';

        $this->from('/booking')
            ->post('/booking', $payload)
            ->assertSessionHasErrors('travelers.primary.phone');

        $this->assertDatabaseCount('custom_bookings', 0);
        Mail::assertNothingOutgoing();
    }

    public function test_custom_booking_rejects_an_invalid_destination(): void
    {
        Mail::fake();
        $this->seedPublishedLookups();

        $payload = $this->validPayload();
        $payload['trip']['destinations'] = ['Atlantis'];

        $this->from('/booking')
            ->post('/booking', $payload)
            ->assertSessionHasErrors('trip.destinations.0');

        $this->assertDatabaseCount('custom_bookings', 0);
    }

    public function test_custom_booking_requires_guide_language_when_guide_is_selected(): void
    {
        Mail::fake();
        $this->seedPublishedLookups();

        $payload = $this->validPayload();
        $payload['services']['guide'] = true;
        $payload['services']['guideGender'] = 'female';
        unset($payload['services']['guideLanguage']);

        $this->from('/booking')
            ->post('/booking', $payload)
            ->assertSessionHasErrors('services.guideLanguage');

        $this->assertDatabaseCount('custom_bookings', 0);
    }

    public function test_custom_booking_requires_guide_gender_when_guide_is_selected(): void
    {
        Mail::fake();
        $this->seedPublishedLookups();

        $payload = $this->validPayload();
        $payload['services']['guide'] = true;
        $payload['services']['guideLanguage'] = 'english';
        unset($payload['services']['guideGender']);

        $this->from('/booking')
            ->post('/booking', $payload)
            ->assertSessionHasErrors('services.guideGender');

        $this->assertDatabaseCount('custom_bookings', 0);
    }

    public function test_custom_booking_stores_guide_gender_when_guide_is_selected(): void
    {
        Mail::fake();
        $this->seedPublishedLookups();

        $payload = $this->validPayload();
        $payload['services']['guide'] = true;
        $payload['services']['guideGender'] = 'female';
        $payload['services']['guideLanguage'] = 'english';

        $this->from('/booking')->post('/booking', $payload)->assertRedirect('/booking');

        $booking = CustomBooking::query()->first();
        $this->assertNotNull($booking);
        $this->assertTrue($booking->wants_guide);
        $this->assertSame('female', $booking->guide_gender);
        $this->assertSame('english', $booking->guide_language);
    }

    public function test_custom_booking_requires_vehicle_when_transport_is_selected(): void
    {
        Mail::fake();
        $this->seedPublishedLookups();

        $payload = $this->validPayload();
        $payload['services']['transportation'] = true;

        $this->from('/booking')
            ->post('/booking', $payload)
            ->assertSessionHasErrors(['services.vehicle', 'services.transportCoverage']);

        $this->assertDatabaseCount('custom_bookings', 0);
    }

    public function test_custom_booking_requires_accommodation_details_when_selected(): void
    {
        Mail::fake();
        $this->seedPublishedLookups();

        $payload = $this->validPayload();
        $payload['services']['accommodation'] = true;

        $this->from('/booking')
            ->post('/booking', $payload)
            ->assertSessionHasErrors(['services.accommodationLevel', 'services.roomPreference', 'services.roomCount']);

        $this->assertDatabaseCount('custom_bookings', 0);
    }

    public function test_custom_booking_allows_flight_details_later(): void
    {
        Mail::fake();
        $this->seedPublishedLookups();

        $payload = $this->validPayload();
        $payload['services']['airport'] = true;
        $payload['services']['arrivalAssistance'] = 'yes';
        $payload['services']['arrivalDetailsLater'] = true;
        $payload['services']['departureAssistance'] = 'no';

        $this->from('/booking')
            ->post('/booking', $payload)
            ->assertRedirect('/booking')
            ->assertSessionHas('customBookingSuccess');

        $booking = CustomBooking::query()->first();
        $this->assertNotNull($booking);
        $this->assertTrue($booking->wants_airport);
        $this->assertTrue($booking->arrival_details_later);
        $this->assertNull($booking->arrival_airport);
        $this->assertNull($booking->arrival_flight);
    }

    public function test_custom_booking_requires_dietary_details_for_allergy(): void
    {
        Mail::fake();
        $this->seedPublishedLookups();

        $payload = $this->validPayload();
        $payload['requirements']['dietary'] = 'allergy';
        $payload['requirements']['dietaryDetails'] = '';

        $this->from('/booking')
            ->post('/booking', $payload)
            ->assertSessionHasErrors('requirements.dietaryDetails');

        $this->assertDatabaseCount('custom_bookings', 0);
    }

    public function test_client_cannot_set_internal_status_or_price(): void
    {
        Mail::fake();
        $this->seedPublishedLookups();

        $payload = $this->validPayload();
        $payload['status'] = 'confirmed';
        $payload['reference'] = 'HACK-1';
        $payload['amount'] = 12;
        $payload['price'] = '99';

        $this->from('/booking')
            ->post('/booking', $payload)
            ->assertSessionHasErrors(['status', 'reference', 'amount', 'price']);

        $this->assertDatabaseCount('custom_bookings', 0);
        $this->assertDatabaseCount('inquiries', 0);
    }

    public function test_failed_validation_does_not_leave_partial_booking_records(): void
    {
        Mail::fake();
        $this->seedPublishedLookups();

        $payload = $this->validPayload();
        $payload['travelers']['companions'] = [];

        $this->from('/booking')->post('/booking', $payload)->assertSessionHasErrors('travelers.adults');

        $this->assertDatabaseCount('custom_bookings', 0);
        $this->assertDatabaseCount('custom_booking_travelers', 0);
        $this->assertDatabaseCount('custom_booking_documents', 0);
        $this->assertDatabaseCount('custom_booking_destinations', 0);
        $this->assertDatabaseCount('custom_booking_interests', 0);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function validPayload(): array
    {
        $expiry = now()->addYear()->toDateString();

        return [
            'trip' => [
                'startDate' => now()->addMonth()->toDateString(),
                'flexibility' => 'exact',
                'season' => null,
                'durationDays' => 10,
                'destinations' => ['Herat'],
                'otherDestination' => '',
                'recommendDestinations' => false,
                'interests' => ['culture', 'nature'],
                'routePreference' => 'know',
            ],
            'travelers' => [
                'adults' => 2,
                'children' => 0,
                'primary' => [
                    'firstName' => 'Sara',
                    'lastName' => 'Ahmad',
                    'email' => 'Sara@Example.com',
                    'phone' => '+49 177 668 7088',
                    'dateOfBirth' => '1990-04-12',
                    'nationality' => 'German',
                    'countryOfResidence' => 'Germany',
                ],
                'companions' => [
                    [
                        'firstName' => 'Omar',
                        'lastName' => 'Ahmad',
                        'dateOfBirth' => '1988-08-02',
                        'nationality' => 'German',
                    ],
                ],
                'groupType' => 'couple',
            ],
            'services' => [
                'complete' => true,
                'guide' => false,
                'transportation' => false,
                'accommodation' => false,
                'airport' => false,
                'domestic' => false,
                'arrivalDetailsLater' => false,
                'departureDetailsLater' => false,
            ],
            'documents' => [
                'passports' => [
                    ['issuingCountry' => 'Germany', 'expiryDate' => $expiry],
                    ['issuingCountry' => 'Germany', 'expiryDate' => $expiry],
                ],
                'visaStatus' => 'guidance',
                'insuranceStatus' => 'will_arrange',
            ],
            'requirements' => [
                'emergencyName' => 'Alex Reed',
                'emergencyRelationship' => 'Spouse',
                'emergencyPhone' => '+49 177 0000001',
                'dietary' => 'none',
                'dietaryDetails' => '',
                'medical' => 'no',
                'medicalDetails' => '',
                'contactMethod' => 'email',
                'specialRequests' => '',
            ],
            'agreements' => [
                'accuracy' => true,
                'terms' => true,
                'privacy' => true,
                'marketing' => false,
            ],
        ];
    }

    private function seedPublishedLookups(): void
    {
        Destination::query()->create($this->destinationAttributes([
            'slug' => 'herat',
            'name' => 'Herat',
            'status' => DestinationStatus::Published,
        ]));

        TourFilterOption::query()->create([
            'type' => TourFilterOptionType::Season,
            'name' => 'Autumn',
            'status' => TourFilterOptionStatus::Published,
            'sort_order' => 1,
        ]);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function destinationAttributes(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'sample-destination',
            'status' => DestinationStatus::Published,
            'name' => 'Sample Destination',
            'tagline' => 'Sample tagline.',
            'region' => 'Central Highlands',
            'badge' => 'Signature',
            'description' => '<p>Sample description.</p>',
            'highlights' => ['Highlight one'],
            'best_season' => 'May – October',
            'travel_style' => 'Cultural & nature',
            'practical_notes' => ['Note one'],
            'tour_match_keywords' => ['Sample'],
            'is_featured' => false,
            'cover_media' => null,
        ], $overrides);
    }
}
