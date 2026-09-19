<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        // TODO: Get user profile by ID / username
        return response()->json([]);
    }

    public function update(Request $request): JsonResponse
    {
        // TODO: Update user profile, status, avatar
        return response()->json([]);
    }

    public function search(Request $request): JsonResponse
    {
        // TODO: Search users by username or email
        return response()->json([]);
    }
}
