<?php

namespace App\Support\About;

final class AboutPageDefaults
{
    /**
     * @return array<string, string>
     */
    public static function attributes(): array
    {
        return [
            'intro_eyebrow' => 'JPA',
            'intro_title' => 'Our Journey',
            'intro_description' => 'Journey to Peace Afghanistan Tours began with Afghan guides showing travellers the country through local eyes. Today we plan, lead and stand behind every itinerary — from first inquiry to the final farewell.',
            'mission_section_eyebrow' => 'JPA',
            'mission_section_title' => 'Our Mission & Vision',
            'mission_title' => 'Our Mission',
            'mission_description' => 'To guide thoughtful travellers through Afghanistan with Afghan-led expertise — offering honest planning, cultural respect and safety at the centre of every tour, trek and custom itinerary.',
            'vision_title' => 'Our Vision',
            'vision_description' => 'A future where responsible tourism strengthens Afghan communities, preserves heritage and rebuilds trust between visitors and the guides who welcome them across the country we call home.',
            'cta_eyebrow' => 'Start planning',
            'cta_title' => 'Ready to explore Afghanistan with us?',
            'cta_description' => 'Tell us your dates, interests and travel style. Our team will respond with an honest, human-reviewed itinerary — no instant checkout, no empty promises.',
            'cta_primary_label' => 'Book Now',
            'cta_primary_href' => '/contact',
            'cta_secondary_label' => 'Browse tours',
            'cta_secondary_href' => '/tours',
        ];
    }
}
