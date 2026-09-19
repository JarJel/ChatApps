<?php

namespace App\Http\Controllers\Call;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CallSessionController extends Controller
{
    public function store(Request $request, string $conversationId): JsonResponse
    {
        // TODO: Start voice/video call session (generate SFU room)
        return response()->json([], 201);
    }

    public function show(string $sessionId): JsonResponse
    {
        // TODO: Get active call session state and participants
        return response()->json([]);
    }

    public function end(string $sessionId): JsonResponse
    {
        // TODO: End call session
        return response()->json(['message' => 'Call session ended']);
    }
}
