<?php

namespace App\Http\Controllers\Server;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServerMemberController extends Controller
{
    public function index(string $serverId): JsonResponse
    {
        // TODO: List members in a server
        return response()->json([]);
    }

    public function join(Request $request, string $serverId): JsonResponse
    {
        // TODO: Join server
        return response()->json([], 201);
    }

    public function leave(Request $request, string $serverId): JsonResponse
    {
        // TODO: Leave server
        return response()->json(['message' => 'Left server successfully']);
    }

    public function update(Request $request, string $serverId, string $userId): JsonResponse
    {
        // TODO: Update member role or nickname
        return response()->json([]);
    }

    public function kick(string $serverId, string $userId): JsonResponse
    {
        // TODO: Kick member from server
        return response()->json(['message' => 'Member kicked successfully']);
    }
}
