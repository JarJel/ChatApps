<?php

namespace App\Http\Controllers\Call;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CallParticipantController extends Controller
{
    public function join(Request $request, string $sessionId): JsonResponse
    {
        // TODO: Join active call room & register participant
        return response()->json([], 201);
    }

    public function leave(Request $request, string $sessionId): JsonResponse
    {
        // TODO: Leave call room & record left_at
        return response()->json(['message' => 'Left call session']);
    }

    public function updateMediaState(Request $request, string $sessionId): JsonResponse
    {
        // TODO: Update mic_muted or camera_on state
        return response()->json([]);
    }
}
