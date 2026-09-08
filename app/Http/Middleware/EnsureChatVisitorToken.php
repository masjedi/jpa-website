<?php

namespace App\Http\Middleware;

use App\Support\Chat\ChatVisitorToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureChatVisitorToken
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = ChatVisitorToken::fromRequest($request);
        $existing = (string) $request->cookie(ChatVisitorToken::COOKIE_NAME, '');

        if ($existing !== $token) {
            ChatVisitorToken::queueCookie($token);
        }

        $request->attributes->set('chat_visitor_token', $token);

        return $next($request);
    }
}
