<?php

namespace App\Support\Booking;

final class CustomBookingOptions
{
    public const NAME_REGEX = '/^[\p{L}\p{M}][\p{L}\p{M}\s.\'-]*$/u';

    public const PHONE_REGEX = '/^\+[1-9][\d\s().\-]{6,20}$/';

    public const TIME_REGEX = '/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/';

    public const FLIGHT_REGEX = '/^[A-Za-z]{1,3}\s?\d{1,4}[A-Za-z]?$/';

    public const OTHER_DESTINATION = 'Other';

    public const RECOMMEND_SEASON = 'recommend';

    public const MIN_DURATION_DAYS = 1;

    public const MAX_DURATION_DAYS = 45;

    public const MAX_ADULTS = 12;

    public const MAX_CHILDREN = 8;

    public const MAX_TRAVELERS = 16;

    public const MAX_GUIDES = 8;

    /**
     * @return list<string>
     */
    public static function flexibilities(): array
    {
        return ['known', 'unsure'];
    }

    /**
     * @return list<string>
     */
    public static function routePreferences(): array
    {
        return ['know', 'recommend', 'mix'];
    }

    /**
     * @return list<string>
     */
    public static function interests(): array
    {
        return ['culture', 'architecture', 'nature', 'adventure', 'photography', 'communities', 'food'];
    }

    /**
     * @return list<string>
     */
    public static function groupTypes(): array
    {
        return ['private', 'group'];
    }

    /**
     * @return list<string>
     */
    public static function guideLanguages(): array
    {
        return ['english', 'dari', 'pashto', 'german', 'other'];
    }

    /**
     * @return list<string>
     */
    public static function guideGenders(): array
    {
        return ['male', 'female'];
    }

    /**
     * @return list<string>
     */
    public static function vehicles(): array
    {
        return ['suv_group', 'land_cruiser', 'corolla'];
    }

    /**
     * @return list<string>
     */
    public static function transportCoverages(): array
    {
        return ['entire', 'selected', 'airport_only'];
    }

    /**
     * @return list<string>
     */
    public static function accommodationLevels(): array
    {
        return ['standard', 'comfortable', 'premium', 'recommend'];
    }

    /**
     * @return list<string>
     */
    public static function roomPreferences(): array
    {
        return ['single', 'double', 'twin', 'family'];
    }

    /**
     * @return list<string>
     */
    public static function flightAssistance(): array
    {
        return ['yes', 'no', 'not_yet'];
    }

    /**
     * @return list<string>
     */
    public static function domesticPreferences(): array
    {
        return ['road', 'flight', 'recommend'];
    }

    /**
     * @return list<string>
     */
    public static function visaStatuses(): array
    {
        return ['obtained', 'applying', 'guidance', 'not_started'];
    }

    /**
     * @return list<string>
     */
    public static function insuranceStatuses(): array
    {
        return ['arranged', 'will_arrange', 'guidance'];
    }

    /**
     * @return list<string>
     */
    public static function dietaryOptions(): array
    {
        return ['none', 'vegetarian', 'vegan', 'halal', 'gluten_free', 'allergy', 'other'];
    }

    /**
     * @return list<string>
     */
    public static function medicalOptions(): array
    {
        return ['no', 'yes'];
    }

    /**
     * @return list<string>
     */
    public static function firstVisitAnswers(): array
    {
        return ['yes', 'no'];
    }

    /**
     * @return list<string>
     */
    public static function contactMethods(): array
    {
        return ['email', 'whatsapp', 'phone'];
    }

    public static function label(string $group, string $value): string
    {
        return match ($group) {
            'flexibility' => match ($value) {
                'known', 'exact', 'plus_minus_3', 'plus_minus_week', 'within_month' => 'No',
                'unsure' => 'Yes',
                default => $value,
            },
            'route' => match ($value) {
                'know' => 'I know the destinations I want',
                'recommend' => 'Recommend the best route',
                'mix' => 'Mix selected destinations with recommendations',
                default => $value,
            },
            'group' => match ($value) {
                'private' => 'Private',
                'group' => 'Group',
                default => $value,
            },
            'interest' => match ($value) {
                'culture' => 'Culture & History',
                'architecture' => 'Architecture',
                'nature' => 'Nature & Landscapes',
                'adventure' => 'Adventure',
                'photography' => 'Photography',
                'communities' => 'Local Communities',
                'food' => 'Food & Traditions',
                default => $value,
            },
            'guide_gender' => match ($value) {
                'male' => 'Male',
                'female' => 'Female',
                default => $value,
            },
            'vehicle' => match ($value) {
                'suv_group' => 'SUV / 4x4 large Group Vehicle',
                'land_cruiser' => 'Land Cruiser',
                'corolla' => 'Corolla type car',
                default => $value,
            },
            'language' => match ($value) {
                'english' => 'English',
                'dari' => 'Dari',
                'pashto' => 'Pashto',
                'german' => 'German',
                'other' => 'Other',
                default => $value,
            },
            'dietary' => match ($value) {
                'none' => 'None',
                'vegetarian' => 'Vegetarian',
                'vegan' => 'Vegan',
                'halal' => 'Halal',
                'gluten_free' => 'Gluten-free',
                'allergy' => 'Food allergy',
                'other' => 'Other',
                default => $value,
            },
            'medical' => match ($value) {
                'yes' => 'Yes',
                'no' => 'No',
                default => $value,
            },
            'contact' => match ($value) {
                'email' => 'Email',
                'whatsapp' => 'WhatsApp',
                'phone' => 'Phone',
                default => $value,
            },
            'visa' => match ($value) {
                'obtained' => 'Already obtained',
                'applying' => 'Applying independently',
                'guidance' => 'Need guidance',
                'not_started' => 'Not started yet',
                default => $value,
            },
            'insurance' => match ($value) {
                'arranged' => 'Already arranged',
                'will_arrange' => 'Will arrange before travel',
                'guidance' => 'Need general guidance',
                default => $value,
            },
            'coverage' => match ($value) {
                'entire' => 'Entire trip',
                'selected' => 'Selected destinations/days',
                'airport_only' => 'Airport transfers only',
                default => $value,
            },
            'accommodation' => match ($value) {
                'standard' => 'Standard',
                'comfortable' => 'Comfortable',
                'premium' => 'Premium / best available',
                'recommend' => 'Recommend based on destination',
                default => $value,
            },
            'room' => match ($value) {
                'single' => 'Single',
                'double' => 'Double',
                'twin' => 'Twin',
                'family' => 'Family / multiple rooms',
                default => $value,
            },
            'domestic' => match ($value) {
                'road' => 'Road transportation',
                'flight' => 'Domestic flight where available',
                'recommend' => 'Recommend the best option',
                default => $value,
            },
            default => $value,
        };
    }
}
