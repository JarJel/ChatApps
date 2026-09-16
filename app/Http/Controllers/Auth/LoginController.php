<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use Exception;

class LoginController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService) {
        $this->authService = $authService;
    }

    public function login (Request $request) {
        $validator = Validator::make($request->all(), [
            'email'         => 'required|string|email|max:255',
            'password'      => 'required|string|min:8',
        ]);

        if($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $result = $this->authService->login($validator->validated());

            return response()->json([
                'message'   => 'Login berhasil, Selamat datang!',
                'user'      => $result['user'],
                'token'     => $result['token'],
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
