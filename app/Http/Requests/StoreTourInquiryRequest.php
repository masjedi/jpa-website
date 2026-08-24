<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTourInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'tourTitle' => ['required', 'string', 'max:200'],
            'preferredDate' => ['nullable', 'string', 'max:120'],
            'travelerCount' => ['nullable', 'string', 'max:40'],
            'fullName' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'nationality' => ['nullable', 'string', 'max:120'],
            'whatsappOrPhone' => ['nullable', 'string', 'max:60'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
