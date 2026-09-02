Dear {{ $confirmation->firstName }} {{ $confirmation->lastName }},

Thank you for requesting a custom Afghanistan tour with {{ $confirmation->brandName }}.
Your request has been received and is now with our travel team. We will review your preferred route and services and reply to {{ $confirmation->email }} with a detailed itinerary and quotation. This is not an instant booking or a confirmed reservation.

Reference: {{ $confirmation->reference }}
Confirmation sent to: {{ $confirmation->email }}
Status: Under Review
Preferred date: {{ $confirmation->preferredDate ? \Illuminate\Support\Carbon::parse($confirmation->preferredDate)->format('j F Y') : 'To be decided' }}
Duration: {{ $confirmation->durationDays }} days
Travelers: {{ $confirmation->travelerCount }}
Flexibility: {{ $confirmation->flexibility }}
@if ($confirmation->season !== '')
Season: {{ $confirmation->season }}
@endif
Destinations: {{ $confirmation->destinationsSummary }}
Interests: {{ $confirmation->interestsSummary }}
Route: {{ $confirmation->routePreference }}
Services: {{ $confirmation->servicesSummary }}

What happens next
1. Our team reviews your destinations, dates, and requested services.
2. We prepare a proposed itinerary and a detailed quotation.
3. We contact you within 24–48 hours using the details you provided.

Price will be confirmed in that quotation. No payment is due until you accept a proposal in writing.

{{ $confirmation->brandName }}
{{ $confirmation->officeLocation }}
{{ $confirmation->contactEmail }} · {{ $confirmation->whatsappDisplay }}
{{ $confirmation->homeUrl }}
