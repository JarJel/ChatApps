<?php

namespace App\Services;

use App\Models\Friendship;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Collection;

class FriendshipService
{
    /**
     * Ambil semua teman aktif (status: accepted)
     */
    public function getFriends(User $user): Collection
    {
        return Friendship::where(function ($query) use ($user) {
            $query->where('requester_id', $user->id)
                ->orWhere('addressee_id', $user->id);
        })
            ->where('status', 'accepted')
            ->with(['requester', 'addressee'])
            ->get();
    }

    /**
     * Ambil permintaan pertemanan yang masuk (status: pending)
     */
    public function getPendingRequests(User $user): Collection
    {
        return Friendship::where('addressee_id', $user->id)
            ->where('status', 'pending')
            ->with('requester')
            ->get();
    }

    /**
     * Kirim permintaan pertemanan baru
     */
    public function sendRequest(User $sender, string $addresseeId): Friendship
    {
        if ($sender->id === $addresseeId) {
            throw new Exception('Tidak dapat mengirim permintaan pertemanan ke diri sendiri.');
        }

        // Cek apakah sudah ada hubungan pertemanan sebelumnya
        $existing = Friendship::where(function ($query) use ($sender, $addresseeId) {
            $query->where('requester_id', $sender->id)->where('addressee_id', $addresseeId);
        })->orWhere(function ($query) use ($sender, $addresseeId) {
            $query->where('requester_id', $addresseeId)->where('addressee_id', $sender->id);
        })->first();

        if ($existing) {
            if ($existing->status === 'blocked') {
                throw new Exception('Tidak dapat mengirim permintaan ke pengguna ini.');
            }
            if ($existing->status === 'accepted') {
                throw new Exception('Kalian sudah berteman.');
            }
            if ($existing->status === 'pending') {
                throw new Exception('Permintaan pertemanan sudah dikirim sebelumnya.');
            }
        }

        return Friendship::create([
            'requester_id' => $sender->id,
            'addressee_id' => $addresseeId,
            'status' => 'pending',
        ]);
    }

    /**
     * Terima permintaan pertemanan
     */
    public function acceptRequest(User $user, string $friendshipId): Friendship
    {
        $friendship = Friendship::where('id', $friendshipId)
            ->where('addressee_id', $user->id)
            ->where('status', 'pending')
            ->firstOrFail();

        $friendship->update(['status' => 'accepted']);

        return $friendship->fresh(['requester', 'addressee']);
    }

    /**
     * Tolak/batalkan permintaan atau hapus pertemanan (Unfriend)
     */
    public function rejectRequest(User $user, string $friendshipId): bool
    {
        $friendship = Friendship::where('id', $friendshipId)
            ->where(function ($query) use ($user) {
                $query->where('addressee_id', $user->id)
                    ->orWhere('requester_id', $user->id);
            })
            ->firstOrFail();

        return (bool) $friendship->delete();
    }

    /**
     * Blokir pengguna
     */
    public function blockUser(User $user, string $targetUserId): Friendship
    {
        $friendship = Friendship::where(function ($query) use ($user, $targetUserId) {
            $query->where('requester_id', $user->id)->where('addressee_id', $targetUserId);
        })->orWhere(function ($query) use ($user, $targetUserId) {
            $query->where('requester_id', $targetUserId)->where('addressee_id', $user->id);
        })->first();

        if ($friendship) {
            $friendship->update([
                'status' => 'blocked',
                'blocked_by' => $user->id,
            ]);

            return $friendship->fresh();
        }

        return Friendship::create([
            'requester_id' => $user->id,
            'addressee_id' => $targetUserId,
            'status' => 'blocked',
            'blocked_by' => $user->id,
        ]);
    }

    /**
     * Buka blokir pengguna
     */
    public function unblockUser(User $user, string $targetUserId): bool
    {
        $friendship = Friendship::where('blocked_by', $user->id)
            ->where(function ($query) use ($user, $targetUserId) {
                $query->where('requester_id', $user->id)->where('addressee_id', $targetUserId);
            })->orWhere(function ($query) use ($user, $targetUserId) {
                $query->where('requester_id', $targetUserId)->where('addressee_id', $user->id);
            })->firstOrFail();

        return (bool) $friendship->delete();
    }
}
