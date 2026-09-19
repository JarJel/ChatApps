<?php

namespace App\Http\Controllers\Server;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // TODO: List user's joined and owned servers
        return response()->json([]);
    }

    public function store(Request $request): JsonResponse
    {
        // TODO: Create a new server
        return response()->json([], 201);
    }

    public function show(string $id): JsonResponse1
    {
        // TODO: Get server details with channels & members
        return response()->json([]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        // TODO: Update server info (name, icon, description)
        return response()->json([]);
    }

    public function destroy(string $id): JsonResponse
    {
        // TODO: Delete server (owner only)
        return response()->json(['message' => 'Server deleted successfully']);
    }
}
