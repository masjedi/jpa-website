<?php

namespace App\Enums;

enum CustomBookingStatus: string
{
    case Submitted = 'submitted';
    case UnderReview = 'under_review';
    case QuotationSent = 'quotation_sent';
    case CustomerAccepted = 'customer_accepted';
    case DepositPending = 'deposit_pending';
    case Confirmed = 'confirmed';

    public function frontendLabel(): string
    {
        return match ($this) {
            self::Submitted => 'Submitted',
            self::UnderReview => 'Under Review',
            self::QuotationSent => 'Quotation Sent',
            self::CustomerAccepted => 'Customer Accepted',
            self::DepositPending => 'Deposit Pending',
            self::Confirmed => 'Confirmed',
        };
    }

    public function next(): ?self
    {
        return match ($this) {
            self::Submitted => self::UnderReview,
            self::UnderReview => self::QuotationSent,
            self::QuotationSent => self::CustomerAccepted,
            self::CustomerAccepted => self::DepositPending,
            self::DepositPending => self::Confirmed,
            self::Confirmed => null,
        };
    }

    public function canTransitionTo(self $status): bool
    {
        return $this->next() === $status;
    }
}
