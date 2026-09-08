<?php

namespace App\Support\Chat;

class ChatOptions
{
    /**
     * @return list<array{value: string, label: string}>
     */
    public static function statusLabels(): array
    {
        return [
            ['value' => 'open', 'label' => 'Open'],
            ['value' => 'closed', 'label' => 'Closed'],
        ];
    }
}
