<?php

use Illuminate\Support\Facades\Route;

// Halaman Utama React SPA
Route::get('/', function () {
    return view('welcome');
});

// SPA Fallback Route agar halaman React tidak 404 saat direfresh
Route::fallback(function () {
    return view('welcome');
});
