<?php

namespace App\Http\Controllers\Invitation;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvitationController extends Controller
{
    public function createServerInvite(Request $request, string $serverId): JsonResponse
    {
        // TODO: Generate invitation link for a server
        return response()->json([], 201);
    }

    public function createConversationInvite(Request $request, string $conversationId): JsonResponse
    {
        // TODO: Generate invitation link for a group conversation
        return response()->json([], 201);
    }

    public function show(string $token): JsonResponse
    {
        // TODO: Inspect and validate invitation token info
        return response()->json([]);
    }

    public function accept(Request $request, string $token): JsonResponse
    {
        // TODO: Accept invitation and join server or conversation
        return response()->json(['message' => 'Invitation accepted successfully']);
    }

    public function revoke(string $id): JsonResponse
    {
        // TODO: Revoke / deactivate invitation link
        return response()->json(['message' => 'Invitation revoked successfully']);
    }
}
