<?php

namespace Database\Factories;

use App\Enums\EmergencyType;
use App\Models\EmergencyContact;
use App\Models\Province;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmergencyContact>
 */
class EmergencyContactFactory extends Factory
{
    protected $model = EmergencyContact::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'province_id' => Province::factory(),
            'full_name' => fake()->name(),
            'position' => 'Provincial liaison',
            'organization' => 'Tourism Directorate',
            'emergency_type' => EmergencyType::TourismInformation,
            'primary_phone' => '+93 70 '.fake()->numerify('### ####'),
            'secondary_phone' => null,
            'whatsapp' => null,
            'availability_notes' => null,
            'last_verified_at' => now()->subWeeks(2)->toDateString(),
            'verified_by' => null,
            'is_customer_shareable' => false,
            'is_active' => true,
            'internal_notes' => null,
            'created_by' => User::factory(),
            'updated_by' => null,
        ];
    }

    public function configure(): static
    {
        return $this->afterMaking(function (EmergencyContact $contact): void {
            $contact->verified_by ??= $contact->created_by;
        });
    }

    public function shareable(): static
    {
        return $this->state(fn (): array => [
            'is_active' => true,
            'is_customer_shareable' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (): array => [
            'is_active' => false,
        ]);
    }

    public function stale(): static
    {
        return $this->state(fn (): array => [
            'last_verified_at' => now()->subMonths(8)->toDateString(),
        ]);
    }
}
