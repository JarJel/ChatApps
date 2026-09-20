<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\FriendshipService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

class FriendshipController extends Controller
{
    public function __construct(
        protected FriendshipService $friendshipService
    ) {}

    #[OA\Get(
        path: '/api/friendships',
        summary: 'Daftar Teman Aktif & Pending Requests',
        security: [['bearerAuth' => []]],
        tags: ['Friendships']
    )]
    #[OA\Response(
        response: 200,
        description: 'Berhasil mengambil data pertemanan',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'friends', type: 'array', items: new OA\Items(type: 'object')),
                new OA\Property(property: 'pending_requests', type: 'array', items: new OA\Items(type: 'object')),
            ]
        )
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthenticated'
    )]
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $friends = $this->friendshipService->getFriends($user);
        $pendingRequest = $this->friendshipService->getPendingRequests($user);

        return response()->json([
            'friends' => $friends,
            'pending_requests' => $pendingRequest,
        ]);
    }

    #[OA\Post(
        path: '/api/friendships/request',
        summary: 'Kirim Permintaan Pertemanan',
        security: [['bearerAuth' => []]],
        tags: ['Friendships']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['addressee_id'],
            properties: [
                new OA\Property(property: 'addressee_id', type: 'string', format: 'uuid', example: '01a0b9d9-5ebe-7003-b1c1-29481d3d8f64'),
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Permintaan pertemanan berhasil dikirim',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Permintaan pertemanan berhasil dikirim'),
                new OA\Property(property: 'friendship', type: 'object'),
            ]
        )
    )]
    #[OA\Response(
        response: 422,
        description: 'Validasi gagal / sudah berteman'
    )]
    public function sendRequest(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'addressee_id' => 'required|uuid|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $friendship = $this->friendshipService->sendRequest(
                $request->user(),
                $request->input('addressee_id'),
            );

            return response()->json([
                'message' => 'Permintaan pertemanan berhasil dikirim',
                'friendship' => $friendship,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    #[OA\Put(
        path: '/api/friendships/{id}/accept',
        summary: 'Terima Permintaan Pertemanan',
        security: [['bearerAuth' => []]],
        tags: ['Friendships']
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'ID dari Friendship (status pending)',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'string', format: 'uuid')
    )]
    #[OA\Response(
        response: 200,
        description: 'Permintaan pertemanan diterima',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Permintaan pertemanan diterima'),
                new OA\Property(property: 'friendship', type: 'object'),
            ]
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'Permintaan pertemanan tidak ditemukan'
    )]
    public function acceptRequest(Request $request, string $id): JsonResponse
    {
        try {
            $friendship = $this->friendshipService->acceptRequest(
                $request->user(),
                $id
            );

            return response()->json([
                'message' => 'Permintaan pertemanan diterima',
                'friendship' => $friendship,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Permintaan pertemanan tidak ditemukan',
            ], 404);
        }
    }

    #[OA\Delete(
        path: '/api/friendships/{id}',
        summary: 'Tolak Permintaan / Hapus Teman (Unfriend)',
        security: [['bearerAuth' => []]],
        tags: ['Friendships']
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'ID dari Friendship',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'string', format: 'uuid')
    )]
    #[OA\Response(
        response: 200,
        description: 'Permintaan pertemanan ditolak atau dibatalkan',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Permintaan pertemanan ditolak atau dibatalkan'),
            ]
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'Data pertemanan tidak ditemukan'
    )]
    public function rejectRequest(Request $request, string $id): JsonResponse
    {
        try {
            $this->friendshipService->rejectRequest(
                $request->user(),
                $id
            );

            return response()->json([
                'message' => 'Permintaan pertemanan ditolak atau dibatalkan',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Data pertemanan tidak ditemukan',
            ], 404);
        }
    }

    #[OA\Post(
        path: '/api/users/{id}/block',
        summary: 'Blokir Pengguna Lain',
        security: [['bearerAuth' => []]],
        tags: ['Friendships']
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'User ID target yang ingin diblokir',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'string', format: 'uuid')
    )]
    #[OA\Response(
        response: 200,
        description: 'Pengguna berhasil diblokir',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Pengguna berhasil diblokir'),
                new OA\Property(property: 'friendship', type: 'object'),
            ]
        )
    )]
    #[OA\Response(
        response: 422,
        description: 'Tidak dapat memblokir akun sendiri'
    )]
    public function block(Request $request, string $id): JsonResponse
    {
        if ($request->user()->id === $id) {
            return response()->json([
                'error' => 'Tidak dapat memblokir akun Anda sendiri',
            ], 422);
        }

        try {
            $friendship = $this->friendshipService->blockUser(
                $request->user(),
                $id
            );

            return response()->json([
                'message' => 'Pengguna berhasil diblokir',
                'friendship' => $friendship,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    #[OA\Post(
        path: '/api/users/{id}/unblock',
        summary: 'Buka Blokir Pengguna',
        security: [['bearerAuth' => []]],
        tags: ['Friendships']
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'User ID target yang ingin dibuka blokirnya',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'string', format: 'uuid')
    )]
    #[OA\Response(
        response: 200,
        description: 'Blokir pengguna berhasil dibuka',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Blokir pengguna berhasil dibuka'),
            ]
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'Data blokir pengguna tidak ditemukan'
    )]
    public function unblock(Request $request, string $id): JsonResponse
    {
        try {
            $this->friendshipService->unblockUser(
                $request->user(),
                $id
            );

            return response()->json([
                'message' => 'Blokir pengguna berhasil dibuka',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Data blokir pengguna tidak ditemukan',
            ], 404);
        }
    }
}
