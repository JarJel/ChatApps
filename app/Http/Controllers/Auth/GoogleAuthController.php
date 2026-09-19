<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GoogleAuthController extends Controller
{
    public function redirect(): JsonResponse
    {
        // TODO: Redirect to Google OAuth provider
        return response()->json(['url' => '']);
    }

    public function callback(Request $request): JsonResponse
    {
        // TODO: Handle Google OAuth callback
        return response()->json(['message' => 'Google callback handled']);
    }
}
