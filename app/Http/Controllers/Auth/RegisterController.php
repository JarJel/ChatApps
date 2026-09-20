<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

class RegisterController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    #[OA\Post(
        path: '/api/register',
        summary: 'Registrasi Akun Baru',
        tags: ['Authentication']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['name', 'email', 'phone', 'password', 'password_confirmation'],
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Budi Santoso'),
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'budi@test.com'),
                new OA\Property(property: 'phone', type: 'string', example: '081234567890'),
                new OA\Property(property: 'password', type: 'string', format: 'password', example: 'password123'),
                new OA\Property(property: 'password_confirmation', type: 'string', format: 'password', example: 'password123'),
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Pendaftaran berhasil',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Pendaftaran berhasil'),
                new OA\Property(property: 'user', type: 'object'),
                new OA\Property(property: 'token', type: 'string', example: '1|01a0b9d9...'),
            ]
        )
    )]
    #[OA\Response(
        response: 422,
        description: 'Validasi gagal'
    )]
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email:rfc,dns|max:255|unique:users',
            'phone' => 'required|string|max:20|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $result = $this->authService->register($validator->validated());

            return response()->json([
                'message' => 'Pendaftaran berhasil',
                'user' => $result['user'],
                'token' => $result['token'],
            ], 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
