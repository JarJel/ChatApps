<?php

namespace App\Services;

use App\Models\Invitation;
use App\Models\User;

class InvitationService
{
    public function createServerInvite(User $creator, string $serverId, ?int $maxUses = null, ?int $expiresInDays = null): ?Invitation
    {
        // TODO: Buat token link undangan baru untuk server tertentu
        return null;
    }

    public function createConversationInvite(User $creator, string $conversationId, ?int $maxUses = null, ?int $expiresInDays = null): ?Invitation
    {
        // TODO: Buat token link undangan baru untuk grup percakapan tertentu
        return null;
    }

    public function validateToken(string $token): ?Invitation
    {
        // TODO: Validasi keberadaan token, masa aktif (expires_at), dan kuota pemakaian (max_uses)
        return null;
    }

    public function acceptInvite(User $user, string $token): array
    {
        // TODO: Konsumsi link undangan, increment use_count, dan daftarkan user ke server/conversation terkait
        return [];
    }

    public function revokeInvite(User $user, string $invitationId): bool
    {
        // TODO: Batalkan/cabut link undangan (set revoked_at)
        return false;
    }
}
