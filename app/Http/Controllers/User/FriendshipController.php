<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FriendshipController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // TODO: List friends and pending requests
        return response()->json([]);
    }

    public function sendRequest(Request $request): JsonResponse
    {
        // TODO: Send friend request
        return response()->json([]);
    }

    public function acceptRequest(string $id): JsonResponse
    {
        // TODO: Accept friend request
        return response()->json([]);
    }

    public function rejectRequest(string $id): JsonResponse
    {
        // TODO: Reject or cancel friend request
        return response()->json([]);
    }

    public function block(Request $request, string $id): JsonResponse
    {
        // TODO: Block user
        return response()->json([]);
    }

    public function unblock(string $id): JsonResponse
    {
        // TODO: Unblock user
        return response()->json([]);
    }
}
