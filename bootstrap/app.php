<?php

use App\Http\Middleware\EnsureCanonicalHost;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SecureAdminChrome;
use App\Http\Middleware\SetLocale;
use App\Support\Chat\ChatVisitorToken;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: [
            ChatVisitorToken::COOKIE_NAME,
        ]);

        $middleware->trustProxies(at: '*');

        $middleware->web(append: [
            EnsureCanonicalHost::class,
            SetLocale::class,
            HandleInertiaRequests::class,
            SecureAdminChrome::class,
        ]);

        $middleware->redirectGuestsTo(fn (Request $request): string => route('admin.login'));
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
