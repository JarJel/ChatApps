<?php

namespace App\Services;

use App\Models\User;

class UserService
{
    public function findById(string $id): ?User
    {
        // TODO: Cari user berdasarkan ID
        return User::find($id);
    }

    public function findByUsername(string $username): ?User
    {
        // TODO: Cari user berdasarkan username
        return User::where('username', $username)->first();
    }

    public function updateProfile(User $user, array $data): User
    {
        // TODO: Update profil user (name, display_name, bio, phone, avatar_url)
        $filteredDAta = array_filter([
            'name'              => $data['name'] ?? null,
            'display_name'      => $data['display_name'] ?? null,
            'bio'               => $data['bio'] ?? null,
            'avatar_url'        => $data['avatar_url'] ?? null,
            'phone'             => $data['phone'] ?? null,
        ]);

        $user->update($filteredDAta);

        return $user->fresh();
    }

    public function updateStatus(User $user, string $status, ?string $customStatus = null): User
    {
        // TODO: Update status online/offline dan custom status
        $user->update([
            'status'            => $status,
            'custom_status'     => $customStatus,
        ]);
        return $user->fresh();
    }

    public function search(string $query, int $limit = 20): mixed
    {
        // TODO: Search user berdasarkan username, nama, atau email
        return User::search($query)->paginate($limit);
    }
}
