<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom tour request received</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f1ea;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f1ea;padding:32px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(22,59,92,0.12);">
                    <tr>
                        <td style="background-color:#163B5C;padding:28px 32px;text-align:center;">
                            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#163B5C;font-size:1px;line-height:1px;">
                                We have received your custom tour request {{ $confirmation->reference }}. Our travel team will reply within 24–48 hours with an itinerary and quotation.
                            </div>
                            <img src="{{ $confirmation->embeddedLogoSrc($message ?? null) }}" alt="{{ $confirmation->brandName }}" width="220" style="max-width:220px;height:auto;display:inline-block;">
                            <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#D7A23A;">
                                Custom tour request
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:4px;background:linear-gradient(90deg,#0E7373 0%,#D7A23A 100%);font-size:0;line-height:0;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="padding:36px 32px 16px;color:#1a2430;">
                            <h1 style="margin:0 0 12px;font-size:26px;line-height:1.3;color:#163B5C;">
                                Dear {{ $confirmation->firstName }} {{ $confirmation->lastName }},
                            </h1>
                            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;color:#3d4a57;">
                                Thank you for requesting a custom Afghanistan tour with {{ $confirmation->brandName }}.
                                Your request has been received and is now with our travel team. We will review your
                                preferred route and services and reply to this address,
                                <strong style="color:#163B5C;">{{ $confirmation->email }}</strong>,
                                with a detailed itinerary and quotation. This is not an instant booking or a confirmed reservation.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:8px 32px 24px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f7f4ee;border:1px solid #e6dfd2;border-radius:12px;">
                                <tr>
                                    <td style="padding:20px 24px;font-family:Arial,Helvetica,sans-serif;">
                                        <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#0E7373;">Request summary</p>
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;color:#1a2430;">
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;color:#6b7280;width:42%;">Reference</td>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;font-weight:700;color:#163B5C;">{{ $confirmation->reference }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;color:#6b7280;">Confirmation sent to</td>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;">{{ $confirmation->email }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;color:#6b7280;">Status</td>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;">Under Review</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;color:#6b7280;">Preferred date</td>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;">
                                                    {{ $confirmation->preferredDate ? \Illuminate\Support\Carbon::parse($confirmation->preferredDate)->format('j F Y') : 'To be decided' }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;color:#6b7280;">Duration</td>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;">{{ $confirmation->durationDays }} days</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;color:#6b7280;">Travelers</td>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;">{{ $confirmation->travelerCount }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;color:#6b7280;">Flexibility</td>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;">{{ $confirmation->flexibility }}</td>
                                            </tr>
                                            @if ($confirmation->season !== '')
                                                <tr>
                                                    <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;color:#6b7280;">Season</td>
                                                    <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;">{{ $confirmation->season }}</td>
                                                </tr>
                                            @endif
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;color:#6b7280;vertical-align:top;">Destinations</td>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;">{{ $confirmation->destinationsSummary }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;color:#6b7280;vertical-align:top;">Interests</td>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;">{{ $confirmation->interestsSummary }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;color:#6b7280;vertical-align:top;">Route</td>
                                                <td style="padding:8px 0;border-bottom:1px solid #e6dfd2;">{{ $confirmation->routePreference }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;color:#6b7280;vertical-align:top;">Services</td>
                                                <td style="padding:8px 0;">{{ $confirmation->servicesSummary }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:8px 32px 28px;font-family:Arial,Helvetica,sans-serif;">
                            <h2 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#163B5C;">What happens next</h2>
                            <ol style="margin:0;padding-left:20px;color:#3d4a57;font-size:14px;line-height:1.7;">
                                <li>Our team reviews your destinations, dates, and requested services.</li>
                                <li>We prepare a proposed itinerary and a detailed quotation.</li>
                                <li>We contact you within 24–48 hours using the details you provided.</li>
                            </ol>
                            <p style="margin:18px 0 0;font-size:14px;line-height:1.65;color:#3d4a57;">
                                Price will be confirmed in that quotation. No payment is due until you accept a proposal in writing.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 32px 32px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="background-color:#0E7373;border-radius:999px;">
                                        <a href="{{ $confirmation->homeUrl }}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                                            Visit Journey to Peace
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#163B5C;padding:24px 32px;font-family:Arial,Helvetica,sans-serif;color:#d7dee7;font-size:13px;line-height:1.6;">
                            <p style="margin:0 0 8px;color:#D7A23A;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;">{{ $confirmation->brandName }}</p>
                            <p style="margin:0;">{{ $confirmation->officeLocation }}</p>
                            <p style="margin:4px 0 0;">
                                <a href="mailto:{{ $confirmation->contactEmail }}" style="color:#ffffff;text-decoration:none;">{{ $confirmation->contactEmail }}</a>
                                &nbsp;·&nbsp;
                                {{ $confirmation->whatsappDisplay }}
                            </p>
                            <p style="margin:16px 0 0;font-size:12px;color:#9bb0c3;">
                                Please keep this email for your records. If you did not send this request, contact us and we will discard it.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
