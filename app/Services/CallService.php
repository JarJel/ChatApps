<?php

namespace App\Services;

use App\Models\CallParticipant;
use App\Models\CallSession;
use App\Models\User;

class CallService
{
    public function startCall(User $initiator, string $conversationId, string $callType = 'voice'): ?CallSession
    {
        // TODO: Inisialisasi call session baru, generate room SFU token, daftarkan initiator sebagai participant
        return null;
    }

    public function joinCall(User $user, string $sessionId): ?CallParticipant
    {
        // TODO: Daftarkan user sebagai participant aktif pada sesi panggilan
        return null;
    }

    public function leaveCall(User $user, string $sessionId): bool
    {
        // TODO: Update left_at pada participant dan akhiri sesi call jika seluruh peserta sudah keluar
        return false;
    }

    public function updateMediaState(User $user, string $sessionId, array $state): ?CallParticipant
    {
        // TODO: Update status mic_muted atau camera_on dari participant
        return null;
    }
}
