<?php

namespace App\Support\About;

use App\Support\Translatable;

final class AboutPageDefaults
{
    /**
     * @return array<string, array<string, string>|string>
     */
    public static function attributes(): array
    {
        return [
            'intro_eyebrow' => Translatable::normalize('JPA'),
            'intro_title' => Translatable::normalize('Our Journey'),
            'intro_description' => Translatable::normalize('Journey to Peace Afghanistan Tours began with Afghan guides showing travellers the country through local eyes. Today we plan, lead and stand behind every itinerary — from first inquiry to the final farewell.'),
            'mission_section_eyebrow' => Translatable::normalize('JPA'),
            'mission_section_title' => Translatable::normalize('Our Mission & Vision'),
            'mission_title' => Translatable::normalize('Our Mission'),
            'mission_description' => Translatable::normalize('To guide thoughtful travellers through Afghanistan with Afghan-led expertise — offering honest planning, cultural respect and safety at the centre of every tour, trek and custom itinerary.'),
            'vision_title' => Translatable::normalize('Our Vision'),
            'vision_description' => Translatable::normalize('A future where responsible tourism strengthens Afghan communities, preserves heritage and rebuilds trust between visitors and the guides who welcome them across the country we call home.'),
            'cta_eyebrow' => Translatable::normalize('Start planning'),
            'cta_title' => Translatable::normalize('Ready to explore Afghanistan with us?'),
            'cta_description' => Translatable::normalize('Tell us your dates, interests and travel style. Our team will respond with an honest, human-reviewed itinerary — no instant checkout, no empty promises.'),
            'cta_primary_label' => Translatable::normalize('Book Now'),
            'cta_primary_href' => '/contact',
            'cta_secondary_label' => Translatable::normalize('Browse tours'),
            'cta_secondary_href' => '/tours',
        ];
    }
}
