<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

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

    public function findByIdOrUsername(string $identifier): ?User
    {
        return User::where('id', $identifier)
            ->orWhere('username', strtolower($identifier))
            ->first();
    }

    public function updateProfile(User $user, array $data): User
    {
        // TODO: Update profil user (name, display_name, bio, phone, avatar_url)
        $payload = [
            'name' => $data['name'] ?? null,
            'username' => isset($data['username']) ? strtolower($data['username']) : null,
            'display_name' => $data['display_name'] ?? null,
            'bio' => $data['bio'] ?? null,
            'avatar_url' => $data['avatar_url'] ?? null,
            'phone' => $data['phone'] ?? null,
        ];

        $filteredData = array_filter($payload, fn ($value) => $value !== null);
        if (! empty($filteredData)) {
            $user->update($filteredData);
        }

        return $user->fresh();
    }

    public function updateStatus(User $user, string $status, ?string $customStatus = null): User
    {
        // TODO: Update status online/offline dan custom status
        $user->update([
            'status' => $status,
            'custom_status' => $customStatus,
        ]);

        return $user->fresh();
    }

    public function search(string $query, int $limit = 20): LengthAwarePaginator
    {
        return User::where('username', 'LIKE', "%{$query}%")
            ->orWhere('name', 'LIKE', "%{$query}%")
            ->orWhere('display_name', 'LIKE', "%{$query}%")
            ->paginate($limit);
    }
}
