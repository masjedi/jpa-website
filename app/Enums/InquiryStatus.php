<?php

namespace App\Enums;

enum InquiryStatus: string
{
    case New = 'new';
    case InReview = 'in_review';
    case AwaitingReply = 'awaiting_reply';
    case Closed = 'closed';

    public function frontendLabel(): string
    {
        return match ($this) {
            self::New => 'New',
            self::InReview => 'In review',
            self::AwaitingReply => 'Awaiting reply',
            self::Closed => 'Closed',
        };
    }
}
