<?php

namespace App\Http\Middleware;

use App\Support\Locale;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->hasSession()) {
            $locale = $request->session()->get('locale');

            if (is_string($locale) && Locale::isSupported($locale)) {
                app()->setLocale($locale);
            }
        }

        return $next($request);
    }
}
