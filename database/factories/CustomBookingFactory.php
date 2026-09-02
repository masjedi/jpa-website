<?php

namespace Database\Factories;

use App\Enums\CustomBookingStatus;
use App\Models\CustomBooking;
use App\Models\CustomBookingTraveler;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CustomBooking>
 */
class CustomBookingFactory extends Factory
{
    protected $model = CustomBooking::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reference' => 'JTP-'.now()->year.'-'.str_pad((string) fake()->unique()->numberBetween(1, 99999), 5, '0', STR_PAD_LEFT),
            'status' => CustomBookingStatus::Submitted,
            'adults' => 2,
            'children' => 0,
            'traveler_count' => 2,
            'group_type' => 'couple',
            'start_date' => now()->addMonth()->toDateString(),
            'flexibility' => 'exact',
            'season' => 'Autumn',
            'duration_days' => 10,
            'other_destination' => null,
            'recommend_destinations' => false,
            'route_preference' => 'know',
            'visa_status' => 'guidance',
            'insurance_status' => 'will_arrange',
            'emergency_name' => 'Alex Reed',
            'emergency_relationship' => 'Spouse',
            'emergency_phone' => '+49 177 0000000',
            'dietary' => 'none',
            'dietary_details' => null,
            'medical' => 'no',
            'medical_details' => null,
            'contact_method' => 'email',
            'special_requests' => null,
            'accuracy' => true,
            'terms' => true,
            'privacy' => true,
            'marketing' => false,
            'wants_complete' => true,
            'wants_guide' => false,
            'wants_transportation' => false,
            'wants_accommodation' => false,
            'wants_airport' => false,
            'wants_domestic' => false,
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (CustomBooking $booking): void {
            if ($booking->travelers()->exists()) {
                return;
            }

            CustomBookingTraveler::query()->create([
                'custom_booking_id' => $booking->id,
                'sort_order' => 0,
                'is_primary' => true,
                'first_name' => 'Sara',
                'last_name' => 'Ahmad',
                'date_of_birth' => '1990-04-12',
                'nationality' => 'German',
                'email' => 'sara@example.com',
                'phone' => '+49 177 668 7088',
                'country_of_residence' => 'Germany',
            ]);
        });
    }
}
