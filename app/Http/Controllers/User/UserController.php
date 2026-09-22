<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use OpenApi\Attributes as OA;

class UserController extends Controller
{
    public function __construct(protected UserService $userService) {}

    #[OA\Get(
        path: '/api/users/me',
        summary: 'Ambil Profil User yang Sedang Login',
        security: [['bearerAuth' => []]],
        tags: ['Users']
    )]
    #[OA\Response(
        response: 200,
        description: 'Informasi profil user yang sedang login',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'user', type: 'object'),
            ]
        )
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthenticated / Token tidak valid'
    )]
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    #[OA\Get(
        path: '/api/users/{id}',
        summary: 'Detail Profil User Berdasarkan ID atau Username',
        security: [['bearerAuth' => []]],
        tags: ['Users']
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        description: 'User UUID atau @username',
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Response(
        response: 200,
        description: 'Profil user ditemukan',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'user', type: 'object'),
            ]
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'User tidak ditemukan'
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthenticated'
    )]
    public function show(string $id): JsonResponse
    {
        // TODO: Get user profile by ID / username
        $user = $this->userService->findByIdOrUsername($id);

        if (! $user) {
            return response()->json([
                'message' => 'User tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'user' => $user,
        ]);
    }

    #[OA\Put(
        path: '/api/users/profile',
        summary: 'Update Profil & Status Pengguna',
        security: [['bearerAuth' => []]],
        tags: ['Users']
    )]
    #[OA\RequestBody(
        required: false,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Fajar Muhammad'),
                new OA\Property(property: 'username', type: 'string', example: 'fajar_dev'),
                new OA\Property(property: 'display_name', type: 'string', example: 'Fajar'),
                new OA\Property(property: 'bio', type: 'string', example: 'Software Engineer & Gamer'),
                new OA\Property(property: 'phone', type: 'string', example: '+628123456789'),
                new OA\Property(property: 'avatar_url', type: 'string', example: 'https://example.com/avatar.png'),
                new OA\Property(property: 'status', type: 'string', enum: ['online', 'offline', 'away', 'busy', 'dnd'], example: 'online'),
                new OA\Property(property: 'custom_status', type: 'string', example: 'Coding Laravel 🚀'),
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Profil berhasil diperbarui',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Profil berhasil diperbarui.'),
                new OA\Property(property: 'user', type: 'object'),
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
    public function update(Request $request): JsonResponse
    {
        // TODO: Update user profile, status, avatar
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|nullable|string|max:255',
            'username' => ['sometimes', 'nullable', 'string', 'alpha_dash', 'max:50', Rule::unique('users')->ignore($user->id)],
            'display_name' => 'sometimes|nullable|string|max:255',
            'bio' => 'sometimes|nullable|string|max:1000',
            'phone' => 'sometimes|nullable|string|max:30',
            'avatar_url' => 'sometimes|nullable|string|max:500',
            'status' => 'sometimes|nullable|string|in:online,offline,away,busy,dnd',
            'custom_status' => 'sometimes|nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $this->userService->updateProfile($user, $validator->validated());

        if ($request->has('status') || $request->has('custom_status')) {
            $user = $this->userService->updateStatus(
                $user,
                $request->input('status', $user->status ?? 'online'),
                $request->input('custom_status', $user->custom_status),
            );
        }

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'user' => $user,
        ]);
    }

    #[OA\Get(
        path: '/api/users/search',
        summary: 'Cari Pengguna Berdasarkan Nama atau Username',
        security: [['bearerAuth' => []]],
        tags: ['Users']
    )]
    #[OA\Parameter(
        name: 'q',
        in: 'query',
        required: true,
        description: 'Kata kunci pencarian (nama, display_name, atau username)',
        schema: new OA\Schema(type: 'string', example: 'fajar')
    )]
    #[OA\Parameter(
        name: 'limit',
        in: 'query',
        required: false,
        description: 'Jumlah data per halaman (default: 20)',
        schema: new OA\Schema(type: 'integer', default: 20)
    )]
    #[OA\Response(
        response: 200,
        description: 'Daftar user ditemukan',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'users', type: 'object'),
            ]
        )
    )]
    #[OA\Response(
        response: 422,
        description: 'Parameter pencarian tidak valid / kosong'
    )]
    #[OA\Response(
        response: 401,
        description: 'Unauthenticated'
    )]
    public function search(Request $request): JsonResponse
    {
        // TODO: Search users by username or email
        $validator = Validator::make($request->all(), [
            'q' => 'required|string|min:1',
            'limit' => 'sometimes|nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $query = (string) $request->query('q');
        $limit = (int) $request->query('limit', 20);

        $users = $this->userService->search($query, $limit);

        return response()->json([
            'users' => $users,
        ]);
    }
}
