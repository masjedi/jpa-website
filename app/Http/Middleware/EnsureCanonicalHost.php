<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCanonicalHost
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $canonicalHost = parse_url((string) config('app.url'), PHP_URL_HOST);
        $canonicalScheme = parse_url((string) config('app.url'), PHP_URL_SCHEME) ?: 'https';

        if (! is_string($canonicalHost) || $canonicalHost === '') {
            return $next($request);
        }

        if (in_array($canonicalHost, ['localhost', '127.0.0.1'], true)) {
            return $next($request);
        }

        $currentHost = $request->getHost();
        $wwwHost = 'www.'.$canonicalHost;
        $needsHostChange = strcasecmp($currentHost, $wwwHost) === 0;
        $needsHttps = $canonicalScheme === 'https' && ! $request->secure();

        if (! $needsHostChange && ! $needsHttps) {
            return $next($request);
        }

        $target = $canonicalScheme.'://'.$canonicalHost.$request->getRequestUri();

        return redirect()->away($target, 301);
    }
}
