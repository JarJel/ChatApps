<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Halaman Utama React SPA
Route::get('/', function () {
    return view('welcome');
});

// SPA Fallback Route agar halaman React tidak 404 saat direfresh
Route::fallback(function (Request $request) {
    if ($request->is('api/*')) {
        return response()->json([
            'error' => 'API endpoint not found.',
        ], 404);
    }

    return view('welcome');
});
