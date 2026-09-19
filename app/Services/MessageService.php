<?php

namespace App\Services;

use App\Models\Message;
use App\Models\User;

class MessageService
{
    public function getConversationMessages(string $conversationId, int $perPage = 50): mixed
    {
        // TODO: Ambil daftar pesan dalam percakapan dengan relasi sender, attachments, reactions, mentions, replyTo
        return [];
    }

    public function sendMessage(User $sender, string $conversationId, array $data): ?Message
    {
        // TODO: Buat pesan baru, simpan mentions, trigger real-time broadcast event ke WebSockets
        return null;
    }

    public function editMessage(User $user, string $messageId, string $newContent): ?Message
    {
        // TODO: Edit pesan yang ada dan perbarui timestamp edited_at
        return null;
    }

    public function deleteMessage(User $user, string $messageId): bool
    {
        // TODO: Soft delete pesan (set deleted_at)
        return false;
    }

    public function toggleReaction(User $user, string $messageId, string $emoji): array
    {
        // TODO: Toggle reaksi emoji pada pesan (tambah jika belum ada, hapus jika sudah ada)
        return [];
    }
}
