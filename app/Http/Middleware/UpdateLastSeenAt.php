<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UpdateLastSeenAt
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (\Illuminate\Support\Facades\Auth::check()) {
            $user = \Illuminate\Support\Facades\Auth::user();
            // Update last_seen_at if it's null or older than 1 minute
            if (!$user->last_seen_at || $user->last_seen_at->diffInMinutes(now()) >= 1) {
                // Avoid firing model events to prevent updating `updated_at` repeatedly
                \Illuminate\Support\Facades\DB::table('users')
                    ->where('id', $user->id)
                    ->update(['last_seen_at' => now()]);
            }
        }
        return $next($request);
    }
}
