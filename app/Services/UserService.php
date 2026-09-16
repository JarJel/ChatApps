<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Exception;

Class UserService {
    public function registerUser(array $data): User {
        try {
            $data["password"] = Hash::make($data["password"]);

            return User::create($data);
        } catch (Exception $e) {
            throw $e;
        }
    } 
}

?>