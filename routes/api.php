<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\User\FriendshipController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Auth Routes
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login'])->middleware('throttle:login');

// Protected Routes (Harus Login)
Route::middleware('auth:sanctum')->group(function () {
    // Current User Profile
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Friendship Endpoints
    Route::prefix('friendships')->group(function () {
        Route::get('/', [FriendshipController::class, 'index']);
        Route::post('/request', [FriendshipController::class, 'sendRequest']);
        Route::put('/{id}/accept', [FriendshipController::class, 'acceptRequest']);
        Route::delete('/{id}', [FriendshipController::class, 'rejectRequest']);
    });

    // Block & Unblock User Endpoints
    Route::prefix('users')->group(function () {
        Route::post('/{id}/block', [FriendshipController::class, 'block']);
        Route::post('/{id}/unblock', [FriendshipController::class, 'unblock']);
    });
});
