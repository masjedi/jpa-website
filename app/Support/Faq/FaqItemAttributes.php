<?php

namespace App\Support\Faq;

use App\Enums\FaqItemStatus;
use App\Models\FaqItem;

class FaqItemAttributes
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public static function fromValidated(array $validated): array
    {
        return [
            'status' => FaqItemStatus::fromFrontend((string) $validated['status']),
            'question' => (string) $validated['question'],
            'answer' => (string) $validated['answer'],
        ];
    }
}
