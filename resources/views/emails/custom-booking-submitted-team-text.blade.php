New custom tour request {{ $confirmation->reference }}

Traveler: {{ $confirmation->firstName }} {{ $confirmation->lastName }}
Email: {{ $confirmation->email }}
Preferred date: {{ $confirmation->preferredDate ? \Illuminate\Support\Carbon::parse($confirmation->preferredDate)->format('j F Y') : 'To be decided' }}
Duration: {{ $confirmation->durationDays }} days
Travelers: {{ $confirmation->travelerCount }}
Destinations: {{ $confirmation->destinationsSummary }}
Services: {{ $confirmation->servicesSummary }}

This is not a confirmed reservation. Passport, medical, and emergency details are not included in this email.
