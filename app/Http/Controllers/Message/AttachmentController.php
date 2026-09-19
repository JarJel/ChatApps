<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttachmentController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        // TODO: Handle media / file upload to storage disk
        return response()->json([], 201);
    }

    public function destroy(string $id): JsonResponse
    {
        // TODO: Delete file from storage and database
        return response()->json(['message' => 'Attachment deleted successfully']);
    }
}
