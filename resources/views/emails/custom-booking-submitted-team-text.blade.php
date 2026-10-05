New custom tour request {{ $confirmation->reference }}

Traveler: {{ $confirmation->fullName }}
Email: {{ $confirmation->email }}
Preferred date: {{ $confirmation->preferredDate ?: 'To be decided' }}
Tour type: {{ ucfirst($confirmation->tourType) }}
Tourists: {{ $confirmation->numberOfTourists }}
Destinations: {{ $confirmation->destinationsSummary }}

This is not a confirmed reservation.
