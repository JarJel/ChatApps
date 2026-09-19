<?php

namespace App\Services;

use App\Models\Friendship;
use App\Models\User;

class FriendshipService
{
    public function getFriends(User $user): mixed
    {
        // TODO: Ambil daftar teman yang statusnya 'accepted'
        return [];
    }

    public function getPendingRequests(User $user): mixed
    {
        // TODO: Ambil daftar permintaan pertemanan yang masuk (status 'pending')
        return [];
    }

    public function sendRequest(User $sender, string $addresseeId): ?Friendship
    {
        // TODO: Validasi dan kirim permintaan pertemanan baru
        return null;
    }

    public function acceptRequest(User $user, string $friendshipId): ?Friendship
    {
        // TODO: Terima permintaan pertemanan (ubah status jadi 'accepted')
        return null;
    }

    public function rejectRequest(User $user, string $friendshipId): bool
    {
        // TODO: Tolak/batalkan permintaan pertemanan atau hapus pertemanan
        return false;
    }

    public function blockUser(User $user, string $targetUserId): ?Friendship
    {
        // TODO: Blokir user (ubah status jadi 'blocked' & set blocked_by)
        return null;
    }

    public function unblockUser(User $user, string $targetUserId): bool
    {
        // TODO: Buka blokir user
        return false;
    }
}
