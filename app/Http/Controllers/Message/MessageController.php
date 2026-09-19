<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, string $conversationId): JsonResponse
    {
        // TODO: Paginate messages in conversation (with sender, attachments, reactions, mentions, reply_to)
        return response()->json([]);
    }

    public function store(Request $request, string $conversationId): JsonResponse
    {
        // TODO: Send a new message (text, attachments, reply, mentions) and trigger real-time broadcast
        return response()->json([], 201);
    }

    public function show(string $conversationId, string $id): JsonResponse
    {
        // TODO: Get single message details
        return response()->json([]);
    }

    public function update(Request $request, string $conversationId, string $id): JsonResponse
    {
        // TODO: Edit message content
        return response()->json([]);
    }

    public function destroy(string $conversationId, string $id): JsonResponse
    {
        // TODO: Soft delete / mark message as deleted
        return response()->json(['message' => 'Message deleted successfully']);
    }
}
