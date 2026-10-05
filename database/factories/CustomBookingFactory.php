<?php

namespace Database\Factories;

use App\Enums\CustomBookingRequestKind;
use App\Enums\CustomBookingStatus;
use App\Models\CustomBooking;
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
            'request_kind' => CustomBookingRequestKind::CustomTour,
            'package_title' => null,
            'package_price' => null,
            'full_name' => 'Sara Ahmad',
            'email' => 'sara@example.com',
            'phone' => '+49 177 668 7088',
            'passport_number' => 'C01X2Y3Z4',
            'country' => 'Germany',
            'tour_type' => 'group',
            'number_of_tourists' => 2,
            'tourist_genders' => ['female'],
            'guide_preference' => 'no_preference',
            'preferred_date' => now()->addMonth()->toDateString(),
            'preferred_date_end' => now()->addMonth()->addDays(4)->toDateString(),
            'alternative_date' => now()->addMonths(2)->toDateString(),
            'preferred_destinations' => 'Bamiyan, Band-e Amir',
            'other_requests' => null,
        ];
    }
}
