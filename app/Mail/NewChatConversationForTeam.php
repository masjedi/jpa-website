<?php

namespace App\Mail;

use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\SiteSetting;
use App\Support\Brand;
use App\Support\Chat\ChatConversationLabel;
use App\Support\SiteSettings\SiteSettingsDefaults;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewChatConversationForTeam extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public ChatConversation $conversation,
        public ChatMessage $message,
    ) {
        $this->afterCommit();
    }

    public function envelope(): Envelope
    {
        $label = ChatConversationLabel::forConversation($this->conversation);

        return new Envelope(
            from: new Address((string) config('mail.from.address'), Brand::appName()),
            to: [
                new Address($this->teamEmail(), Brand::appName()),
            ],
            subject: "New website chat from {$label}",
        );
    }

    public function content(): Content
    {
        $label = ChatConversationLabel::forConversation($this->conversation);
        $preview = trim((string) $this->message->message);
        $adminUrl = url('/admin/chat/'.$this->conversation->id);

        return new Content(
            text: 'emails.new-chat-conversation-team-text',
            with: [
                'label' => $label,
                'preview' => $preview,
                'adminUrl' => $adminUrl,
                'brandName' => Brand::appName(),
            ],
        );
    }

    private function teamEmail(): string
    {
        try {
            return (string) SiteSetting::current()->contact_email;
        } catch (\Throwable) {
            return SiteSettingsDefaults::CONTACT_EMAIL;
        }
    }
}
