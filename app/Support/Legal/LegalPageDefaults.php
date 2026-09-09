<?php

namespace App\Support\Legal;

use App\Enums\LegalPageKey;
use App\Support\Translatable;

class LegalPageDefaults
{
    /**
     * @return array<string, mixed>
     */
    public static function attributesFor(LegalPageKey $key): array
    {
        return match ($key) {
            LegalPageKey::Privacy => self::privacyAttributes(),
            LegalPageKey::Terms => self::termsAttributes(),
        };
    }

    /**
     * @return array<string, mixed>
     */
    public static function privacyAttributes(): array
    {
        return [
            'key' => LegalPageKey::Privacy,
            'eyebrow' => Translatable::normalize('Your information'),
            'title' => Translatable::normalize('Privacy Policy'),
            'intro' => Translatable::normalize(
                'This notice explains what we collect when you browse the site or send an inquiry. It is written for the current public website and will be updated as booking systems go live.',
            ),
            'sections' => Translatable::normalizeJsonListStorage([
                [
                    'title' => 'Who we are',
                    'body' => 'Journey to Peace Afghanistan Tours (JPA) is a guided-travel team based in Kabul. Inquiries are reviewed by people on our team — not by an automated booking engine.',
                ],
                [
                    'title' => 'What we collect',
                    'body' => 'If you send a contact or trip inquiry, we ask for details such as your name, email address, nationality, travel dates and trip notes. Newsletter fields collect an email address only. We do not collect payment card data on this website.',
                ],
                [
                    'title' => 'How we use it',
                    'body' => 'We use inquiry details to reply with information, a quotation or travel advice. We do not sell personal data. We do not use it to confirm seats or process payments from this site.',
                ],
                [
                    'title' => 'Cookies and appearance',
                    'body' => 'The site stores your theme preference in the browser so the layout does not flash on return visits. We do not currently run advertising or analytics cookies.',
                ],
                [
                    'title' => 'Contact',
                    'body' => 'Questions about this notice can be sent through the',
                    'link_href' => '/contact',
                    'link_label' => 'contact page',
                ],
            ]),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function termsAttributes(): array
    {
        return [
            'key' => LegalPageKey::Terms,
            'eyebrow' => Translatable::normalize('Using this website'),
            'title' => Translatable::normalize('Terms and Conditions'),
            'intro' => Translatable::normalize(
                'These terms apply to the public website and to trip inquiries sent through it. They do not create a confirmed booking or a guaranteed itinerary.',
            ),
            'sections' => Translatable::normalizeJsonListStorage([
                [
                    'title' => 'Inquiries are not reservations',
                    'body' => 'Submitting a form, choosing a tour or requesting a quotation does not reserve a seat, lock a departure or confirm a trip. Our team reviews each request and replies with next steps. A journey is only confirmed after we agree details with you in writing.',
                ],
                [
                    'title' => 'Travel information',
                    'body' => 'Guides, itineraries and destination notes on this site are general information. Conditions in Afghanistan can change. We do not make safety guarantees. You remain responsible for visas, insurance and independent travel advice from your government.',
                ],
                [
                    'title' => 'Content',
                    'body' => 'Photographs and stories illustrate the kind of journeys we plan. Visuals come from our managed media library. Do not treat sample itinerary details as a live inventory of departures.',
                ],
                [
                    'title' => 'Contact',
                    'body' => 'If anything in these terms is unclear, write to us via the',
                    'link_href' => '/contact',
                    'link_label' => 'contact page',
                ],
            ]),
        ];
    }
}
