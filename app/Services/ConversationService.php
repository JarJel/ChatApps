<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\ConversationMember;
use App\Models\User;

class ConversationService
{
    public function getUserConversations(User $user): mixed
    {
        // TODO: Ambil semua percakapan user (DM, Group, Channel) beserta anggota dan pesan terakhir
        return [];
    }

    public function createDirectMessage(User $creator, string $recipientId): ?Conversation
    {
        // TODO: Buat atau ambil percakapan DM yang sudah ada antara 2 user
        return null;
    }

    public function createGroup(User $creator, string $name, array $memberIds = []): ?Conversation
    {
        // TODO: Buat percakapan group baru dan tambahkan creator sebagai admin beserta member lainnya
        return null;
    }

    public function addMember(User $actor, string $conversationId, string $targetUserId): ?ConversationMember
    {
        // TODO: Tambahkan member ke grup percakapan
        return null;
    }

    public function markAsRead(User $user, string $conversationId): void
    {
        // TODO: Update timestamp last_read_at pada pivot conversation_members
    }
}
