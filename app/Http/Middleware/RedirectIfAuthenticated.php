<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$guards)
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {

            if (Auth::guard($guard)->check()) {

                // If admin logged in
                if ($guard === 'admin') {
                    return redirect()->route('admin.blogs.manage');
                }

                // If normal user logged in
                if ($guard === 'web' || $guard === null) {
                    return redirect()->route('home'); // change if needed
                }
            }
        }

        return $next($request);
    }
}
