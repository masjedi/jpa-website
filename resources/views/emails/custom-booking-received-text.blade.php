Dear {{ $confirmation->firstName() }},

Thank you for requesting a custom Afghanistan tour with {{ $confirmation->brandName }}.
Your request has been received and is now with our travel team. We will review the details and reply to {{ $confirmation->email }} with next steps. This is not an instant booking or a confirmed reservation.

Reference: {{ $confirmation->reference }}
Name: {{ $confirmation->fullName }}
Preferred date: {{ $confirmation->preferredDate ?: 'To be decided' }}
Tour type: {{ ucfirst($confirmation->tourType) }}
Tourists: {{ $confirmation->numberOfTourists }}
Destinations: {{ $confirmation->destinationsSummary }}

What happens next
1. Our team reviews your request.
2. We prepare a proposed itinerary and quotation.
3. We contact you within 24–48 hours using the details you provided.

{{ $confirmation->brandName }}
{{ $confirmation->officeLocation }}
{{ $confirmation->contactEmail }} · {{ $confirmation->whatsappDisplay }}
{{ $confirmation->homeUrl }}
