<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAdminEmailRequest;
use App\Http\Requests\Admin\UpdateAdminPasswordRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        abort_unless($user !== null, 403);

        return Inertia::render('admin/Account', [
            'account' => [
                'name' => (string) $user->name,
                'email' => (string) $user->email,
            ],
        ]);
    }

    public function updateEmail(UpdateAdminEmailRequest $request): RedirectResponse
    {
        $user = auth()->user();

        abort_unless($user !== null, 403);

        $user->update([
            'email' => $request->validated('email'),
        ]);

        $request->session()->regenerate();

        return redirect()
            ->route('admin.account.index')
            ->with('success', 'Your email address has been updated.');
    }

    public function updatePassword(UpdateAdminPasswordRequest $request): RedirectResponse
    {
        $user = auth()->user();

        abort_unless($user !== null, 403);

        $user->update([
            'password' => $request->validated('password'),
        ]);

        $request->session()->regenerate();

        return redirect()
            ->route('admin.account.index')
            ->with('success', 'Your password has been updated.');
    }
}
