<?php

namespace App\Http\Requests;

use App\Enums\NewsletterSubscriptionSource;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreNewsletterSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'max:255'],
            'source' => [
                'sometimes',
                'string',
                Rule::enum(NewsletterSubscriptionSource::class),
            ],
        ];
    }

    public function normalizedEmail(): string
    {
        return mb_strtolower(trim((string) $this->input('email')));
    }

    public function source(): NewsletterSubscriptionSource
    {
        $value = $this->input('source');

        if ($value instanceof NewsletterSubscriptionSource) {
            return $value;
        }

        if (is_string($value) && $value !== '') {
            return NewsletterSubscriptionSource::from($value);
        }

        return NewsletterSubscriptionSource::Footer;
    }
}
