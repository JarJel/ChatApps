<?php

namespace App\Http\Controllers\Conversation;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationMemberController extends Controller
{
    public function index(string $conversationId): JsonResponse
    {
        // TODO: List members in conversation
        return response()->json([]);
    }

    public function store(Request $request, string $conversationId): JsonResponse
    {
        // TODO: Add member to group conversation
        return response()->json([], 201);
    }

    public function leave(Request $request, string $conversationId): JsonResponse
    {
        // TODO: Leave conversation
        return response()->json(['message' => 'Left conversation successfully']);
    }

    public function markAsRead(Request $request, string $conversationId): JsonResponse
    {
        // TODO: Update last_read_at timestamp
        return response()->json(['message' => 'Conversation marked as read']);
    }
}
