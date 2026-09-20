<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Rate Limiter khusus login (Maksimal 5 percobaan per menit per kombinasi email & IP)
        RateLimiter::for('login', function (Request $request) {
            $email = (string) $request->input('email');

            return Limit::perMinute(5)->by($email.$request->ip())->response(function (Request $request, array $headers) {
                return response()->json([
                    'error' => 'Terlalu banyak percobaan login. Silakan tunggu 1 menit sebelum mencoba kembali.',
                ], 429, $headers);
            });
        });
    }
}
