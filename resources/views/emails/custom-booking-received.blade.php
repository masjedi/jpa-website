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
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;">
                    <tr>
                        <td style="background-color:#163B5C;padding:28px 32px;text-align:center;">
                            <img src="{{ $confirmation->embeddedLogoSrc($message ?? null) }}" alt="{{ $confirmation->brandName }}" width="220" style="max-width:220px;height:auto;display:inline-block;">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:36px 32px;color:#1a2430;">
                            <h1 style="margin:0 0 12px;font-size:24px;color:#163B5C;">Dear {{ $confirmation->firstName() }},</h1>
                            <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#3d4a57;">
                                Thank you for requesting a custom Afghanistan tour with {{ $confirmation->brandName }}.
                                Your request <strong>{{ $confirmation->reference }}</strong> has been received.
                                This is not an instant booking or a confirmed reservation.
                            </p>
                            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#1a2430;">
                                <strong>Preferred date:</strong> {{ $confirmation->preferredDate ?: 'To be decided' }}<br>
                                <strong>Tour type:</strong> {{ ucfirst($confirmation->tourType) }}<br>
                                <strong>Tourists:</strong> {{ $confirmation->numberOfTourists }}<br>
                                <strong>Destinations:</strong> {{ $confirmation->destinationsSummary }}
                            </p>
                            <p style="margin:24px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;">
                                {{ $confirmation->brandName }} · {{ $confirmation->contactEmail }} · {{ $confirmation->whatsappDisplay }}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
