<?php

namespace App\Http\Controllers\Conversation;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // TODO: List all direct messages & group chats for the authenticated user
        return response()->json([]);
    }

    public function store(Request $request): JsonResponse
    {
        // TODO: Create DM, Group, or Server Channel
        return response()->json([], 201);
    }

    public function show(string $id): JsonResponse
    {
        // TODO: Get conversation details
        return response()->json([]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        // TODO: Update conversation (group name, icon)
        return response()->json([]);
    }

    public function destroy(string $id): JsonResponse
    {
        // TODO: Delete conversation / channel
        return response()->json(['message' => 'Conversation deleted successfully']);
    }
}
