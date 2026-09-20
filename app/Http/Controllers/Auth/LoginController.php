<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

class LoginController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    #[OA\Post(
        path: '/api/login',
        summary: 'Login Pengguna',
        tags: ['Authentication']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['email', 'password'],
            properties: [
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'budi@test.com'),
                new OA\Property(property: 'password', type: 'string', format: 'password', example: 'password123'),
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Login berhasil',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Login berhasil, Selamat datang!'),
                new OA\Property(property: 'user', type: 'object'),
                new OA\Property(property: 'token', type: 'string', example: '1|01a0b9d9...'),
            ]
        )
    )]
    #[OA\Response(
        response: 422,
        description: 'Email atau password salah / validasi gagal'
    )]
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $result = $this->authService->login($validator->validated());

            return response()->json([
                'message' => 'Login berhasil, Selamat datang!',
                'user' => $result['user'],
                'token' => $result['token'],
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
