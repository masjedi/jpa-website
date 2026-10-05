<?php

namespace Database\Seeders;

use App\Enums\FaqItemStatus;
use App\Models\FaqItem;
use App\Support\Translatable;
use Illuminate\Database\Seeder;

class FaqItemSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->catalog() as $index => $item) {
            $question = Translatable::resolve($item['question']);

            $exists = FaqItem::query()
                ->get()
                ->contains(fn (FaqItem $faq): bool => Translatable::resolve($faq->question) === $question);

            if ($exists) {
                continue;
            }

            FaqItem::query()->create([
                ...$item,
                'sort_order' => $index + 1,
            ]);
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function catalog(): array
    {
        return [
            [
                'status' => FaqItemStatus::Published,
                'question' => Translatable::normalize('Is it safe to travel to Afghanistan?'),
                'answer' => Translatable::normalize(
                    'Safety conditions can change, so we never promise risk-free travel. Every itinerary is planned with current advice, vetted guides and drivers, and realistic pacing. We review routes before departure and adjust plans when conditions require it.'
                ),
            ],
            [
                'status' => FaqItemStatus::Published,
                'question' => Translatable::normalize('How do visas and permits work?'),
                'answer' => Translatable::normalize(
                    'Most international visitors need an Afghanistan visa before arrival. We guide you through the documents required for your nationality and can provide supporting letters for your application when appropriate. Regional permits for certain areas are arranged as part of your confirmed itinerary.'
                ),
            ],
            [
                'status' => FaqItemStatus::Published,
                'question' => Translatable::normalize('Is booking on this website an instant reservation?'),
                'answer' => Translatable::normalize(
                    'No. A booking request is an inquiry, not an automatic reservation. After you send a request, our team reviews dates, permits, logistics and pricing, then replies with a written quotation before anything is confirmed.'
                ),
            ],
            [
                'status' => FaqItemStatus::Published,
                'question' => Translatable::normalize('What is included in a typical tour?'),
                'answer' => Translatable::normalize(
                    'Inclusions vary by itinerary, but most tours include a private vehicle, an English-speaking Afghan guide, selected entry fees and daily breakfast unless noted otherwise. Hotels, domestic flights and special permits are confirmed clearly in your quotation.'
                ),
            ],
            [
                'status' => FaqItemStatus::Published,
                'question' => Translatable::normalize('When is the best time to visit?'),
                'answer' => Translatable::normalize(
                    'Spring and autumn are generally the most comfortable seasons for cultural travel and highland routes. Summer works well for Bamiyan and Band-e Amir, while winter can suit shorter city stays. We recommend dates based on your destinations and how much time you want outdoors.'
                ),
            ],
        ];
    }
}
