<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageReactionController extends Controller
{
    public function store(Request $request, string $messageId): JsonResponse
    {
        // TODO: Toggle or add reaction (emoji) to message
        return response()->json([], 201);
    }

    public function destroy(Request $request, string $messageId): JsonResponse
    {
        // TODO: Remove reaction from message
        return response()->json(['message' => 'Reaction removed successfully']);
    }
}
