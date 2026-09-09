<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New custom tour request</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f1ea;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f1ea;padding:32px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;">
                    <tr>
                        <td style="background-color:#163B5C;padding:24px 32px;color:#ffffff;">
                            <p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#D7A23A;">Custom tour request</p>
                            <h1 style="margin:8px 0 0;font-size:22px;">{{ $confirmation->reference }}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px 32px;color:#1a2430;font-size:14px;line-height:1.65;">
                            <p style="margin:0 0 16px;">A new custom tour request has been submitted and is waiting for review.</p>
                            <p style="margin:0;"><strong>Traveler:</strong> {{ $confirmation->fullName }}</p>
                            <p style="margin:8px 0 0;"><strong>Email:</strong> {{ $confirmation->email }}</p>
                            <p style="margin:8px 0 0;"><strong>Preferred date:</strong> {{ $confirmation->preferredDate ?: 'To be decided' }}</p>
                            <p style="margin:8px 0 0;"><strong>Tour type:</strong> {{ ucfirst($confirmation->tourType) }}</p>
                            <p style="margin:8px 0 0;"><strong>Tourists:</strong> {{ $confirmation->numberOfTourists }}</p>
                            <p style="margin:8px 0 0;"><strong>Destinations:</strong> {{ $confirmation->destinationsSummary }}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
