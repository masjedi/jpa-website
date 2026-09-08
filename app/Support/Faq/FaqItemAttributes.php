<?php

namespace App\Support\Faq;

use App\Enums\FaqItemStatus;
use App\Support\Translatable;

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
            'question' => Translatable::sanitize($validated['question']),
            'answer' => Translatable::sanitize($validated['answer']),
        ];
    }
}
