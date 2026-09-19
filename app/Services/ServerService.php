<?php

namespace App\Services;

use App\Models\Server;
use App\Models\ServerMember;
use App\Models\User;

class ServerService
{
    public function getUserServers(User $user): mixed
    {
        // TODO: Ambil semua server yang diikuti atau dimiliki user beserta channels-nya
        return [];
    }

    public function createServer(User $owner, array $data): ?Server
    {
        // TODO: Buat server baru, daftarkan user sebagai owner, dan buat default text channel 'general'
        return null;
    }

    public function joinServer(User $user, string $serverId): ?ServerMember
    {
        // TODO: Tambahkan user ke server_members dengan role 'member'
        return null;
    }

    public function leaveServer(User $user, string $serverId): bool
    {
        // TODO: Keluarkan user dari server (validasi owner tidak boleh leave tanpa transfer)
        return false;
    }

    public function updateMemberRole(User $actor, string $serverId, string $targetUserId, string $role): ?ServerMember
    {
        // TODO: Ubah role member di server (hanya owner/moderator)
        return null;
    }

    public function kickMember(User $actor, string $serverId, string $targetUserId): bool
    {
        // TODO: Kick member dari server
        return false;
    }
}
