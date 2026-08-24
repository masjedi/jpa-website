<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminNotification;
use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;

class AdminFeedController extends Controller
{
    public function markNotificationsRead(): RedirectResponse
    {
        AdminNotification::query()
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back();
    }

    public function markMessagesRead(): RedirectResponse
    {
        Inquiry::query()
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back();
    }
}
