<?php

namespace App\Http\Controllers\Server;

use App\Http\Controllers\Controller;
use App\Models\Server;
use App\Services\ServerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

class ServerController extends Controller
{
    public function __construct(
        protected ServerService $serverService
    ) {}

    #[OA\Get(
        path: '/api/servers',
        summary: 'Daftar Server yang Diikuti & Dimiliki User',
        security: [['bearerAuth' => []]],
        tags: ['Servers']
    )]
    #[OA\Response(
        response: 200,
        description: 'Daftar server berhasil diambil',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'servers', type: 'array', items: new OA\Items(type: 'object')),
            ]
        )
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthenticated'
    )]
    public function index(Request $request): JsonResponse
    {
        // TODO: List user's joined and owned servers
        $servers = $this->serverService->getUserServers($request->user());

        return response()->json([
            'servers' => $servers,
        ]);
    }

    #[OA\Post(
        path: '/api/servers',
        summary: 'Buat Server Baru',
        security: [['bearerAuth' => []]],
        tags: ['Servers']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['name'],
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Komunitas Developer Laravel'),
                new OA\Property(property: 'description', type: 'string', example: 'Ruang diskusi backend developer dan gamer'),
                new OA\Property(property: 'icon_url', type: 'string', example: 'https://example.com/icon.png'),
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Server berhasil dibuat',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Server berhasil dibuat.'),
                new OA\Property(property: 'server', type: 'object'),
            ]
        )
    )]
    #[OA\Response(
        response: 422,
        description: 'Validasi data gagal'
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthenticated'
    )]
    public function store(Request $request): JsonResponse
    {
        // TODO: Create a new server
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:2|max:100',
            'description' => 'nullable|string|max:500',
            'icon_url' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $server = $this->serverService->createServer(
            $request->user(),
            $validator->validated(),
        );

        return response()->json([
            'message' => 'Server berhasil dibuat',
            'server' => $server,
        ], 201);
    }

    #[OA\Get(
        path: '/api/servers/{id}',
        summary: 'Detail Server beserta Daftar Channel dan Anggota',
        security: [['bearerAuth' => []]],
        tags: ['Servers']
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        description: 'Server ID (UUID)',
        schema: new OA\Schema(type: 'string', format: 'uuid')
    )]
    #[OA\Response(
        response: 200,
        description: 'Detail server berhasil diambil',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'server', type: 'object'),
            ]
        )
    )]
    #[OA\Response(
        response: 403,
        description: 'Bukan anggota server ini'
    )]
    #[OA\Response(
        response: 404,
        description: 'Server tidak ditemukan'
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthenticated'
    )]
    public function show(Request $request, string $id): JsonResponse
    {
        // TODO: Get server details with channels & members
        $server = Server::with([
            'channels',
            'members' => function ($query) {
                $query->withPivot(['role', 'nickname', 'joined_at']);
            },
        ])->find($id);

        if (! $server) {
            return response()->json([
                'message' => 'Server tidak ditemukan',
            ], 404);
        }

        $isMember = $server->members()->where('users.id', $request->user()->id)->exists();

        if (! $isMember) {
            return response()->json([
                'message' => 'Anda bukan anggota dari server ini',
            ], 403);
        }

        return response()->json([
            'server' => $server,
        ]);
    }

    #[OA\Put(
        path: '/api/servers/{id}',
        summary: 'Update Informasi Server (Owner & Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Servers']
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        description: 'Server ID (UUID)',
        schema: new OA\Schema(type: 'string', format: 'uuid')
    )]
    #[OA\RequestBody(
        required: false,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Komunitas Laravel & React'),
                new OA\Property(property: 'description', type: 'string', example: 'Server resmi komunitas pengembang'),
                new OA\Property(property: 'icon_url', type: 'string', example: 'https://example.com/new-icon.png'),
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Server berhasil diperbarui',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Server berhasil diperbarui.'),
                new OA\Property(property: 'server', type: 'object'),
            ]
        )
    )]
    #[OA\Response(
        response: 403,
        description: 'Tidak memiliki izin (Bukan Owner / Admin)'
    )]
    #[OA\Response(
        response: 404,
        description: 'Server tidak ditemukan'
    )]
    #[OA\Response(
        response: 422,
        description: 'Validasi data gagal'
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthenticated'
    )]
    public function update(Request $request, string $id): JsonResponse
    {
        // TODO: Update server info (name, icon, description)
        $server = Server::find($id);

        if (! $server) {
            return response()->json([
                'message' => 'Server tidak ditemukan',
            ], 404);
        }

        $membership = $server->memberships()->where('user_id', $request->user()->id)->first();

        if (! $membership || ! in_array($membership->role, ['owner', 'admin'], true)) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk mengubah pengaturan server ini',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|min:2|max:500',
            'description' => 'sometimes|nullable|string|max:500',
            'icon_url' => 'sometimes|nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $server->update($validator->validated());

        return response()->json([
            'message' => 'Server berhasil diperbarui',
            'server' => $server->fresh(['channels', 'owner']),
        ]);
    }

    #[OA\Delete(
        path: '/api/servers/{id}',
        summary: 'Hapus Server (Hanya Pemilik Server)',
        security: [['bearerAuth' => []]],
        tags: ['Servers']
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        description: 'Server ID (UUID)',
        schema: new OA\Schema(type: 'string', format: 'uuid')
    )]
    #[OA\Response(
        response: 200,
        description: 'Server berhasil dihapus',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Server berhasil dihapus.'),
            ]
        )
    )]
    #[OA\Response(
        response: 403,
        description: 'Tidak memiliki izin (Bukan pemilik server)'
    )]
    #[OA\Response(
        response: 404,
        description: 'Server tidak ditemukan'
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthenticated'
    )]
    public function destroy(Request $request, string $id): JsonResponse
    {
        // TODO: Delete server (owner only)
        $server = Server::find($id);

        if (! $server) {
            return response()->json([
                'message' => 'Server tidak ditemukan',
            ], 404);
        }

        if ($server->owner_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Hanya pemilik server yang dapat menghapus server ini',
            ], 403);
        }

        $server->delete();

        return response()->json(['message' => 'Server deleted successfully']);
    }
}
