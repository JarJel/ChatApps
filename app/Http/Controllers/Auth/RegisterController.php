<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService) {
        $this->authService = $authService;
    }

    public function register(Request $request) {

        $validator = Validator::make($request->all(), [
            'name'          => 'required|string|max:255',
            'email'         => 'required|string|lowercase|email:rfc,dns|max:255|unique:users',
            'phone'         => 'required|string|max:20|unique:users',
            'password'      => 'required|string|min:8|confirmed',
        ]);

        if($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $result = $this->authService->register($validator->validated());

            return response()->json([
                'message'   => 'Pendaftaran berhasil',
                'user'      => $result['user'],
                'token'     => $result['token'],
            ], 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
