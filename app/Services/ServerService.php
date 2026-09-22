<?php

namespace App\Services;

use App\Models\ConversationMember;
use App\Models\Server;
use App\Models\ServerMember;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ServerService
{
    /**
     * Ambil semua server yang diikuti user beserta channels dan data owner.
     *
     * @return Collection<int, Server>
     */
    public function getUserServers(User $user): mixed
    {
        // TODO: Ambil semua server yang diikuti atau dimiliki user beserta channels-nya
        return $user->servers()
            ->with(['channels', 'owner'])
            ->withPivot(['role', 'nickname', 'joined_at'])
            ->get();
    }

    public function createServer(User $owner, array $data): ?Server
    {
        // TODO: Buat server baru, daftarkan user sebagai owner, dan buat default text channel 'general'
        return DB::transaction(function () use ($owner, $data) {
            // buat server record
            $server = Server::create([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'icon_url' => $data['icon_url'] ?? null,
                'owner_id' => $owner->id,
            ]);

            // Daftarkan pembuat sebagai owner
            $server->memberships()->create([
                'user_id' => $owner->id,
                'role' => 'owner',
                'joined_at' => now(),
            ]);

            // buat default text channel 'general'
            $defaultChannel = $server->channels()->create([
                'type' => 'channel',
                'name' => 'general',
                'created_by' => $owner->id,
            ]);

            $defaultChannel->memberships()->create([
                'user_id' => $owner->id,
                'role' => 'owner',
                'joined_at' => now(),
            ]);

            return $server->load(['channels', 'members', 'owner']);
        });
    }

    /**
     * Tambahkan user ke server dan otomatis masukkan ke semua channel di server tersebut.
     *
     * @throws Exception
     */
    public function joinServer(User $user, string $serverId): ?ServerMember
    {
        // TODO: Tambahkan user ke server_members dengan role 'member'
        $server = Server::findOrFail($serverId);

        $existing = ServerMember::where('server_id', $serverId)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            throw new Exception('Anda sudah menjadi anggota di server ini');
        }

        return DB::transaction(function () use ($server, $user, $serverId) {
            $member = ServerMember::create([
                'server_id' => $serverId,
                'user_id' => $user->id,
                'role' => 'member',
                'joined_at' => now(),
            ]);

            $channelIds = $server->channels()->pluck('id');

            if ($channelIds->isNotEmpty()) {
                $now = now();

                $channelMemberships = $channelIds->map(fn ($channelId) => [
                    'id' => (string) Str::uuid(),
                    'conversation_id' => $channelId,
                    'user_id' => $user->id,
                    'role' => 'member',
                    'joined_at' => $now,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])->all();

                ConversationMember::insertOrIgnore($channelMemberships);
            }

            return $member->load(['user', 'server']);
        });
    }

    /**
     * Keluarkan user dari server dan bersihkan keanggotaan dari semua channel server tersebut.
     *
     * @throws Exception
     */
    public function leaveServer(User $user, string $serverId): bool
    {
        // TODO: Keluarkan user dari server (validasi owner tidak boleh leave tanpa transfer)
        $server = Server::findOrFail($serverId);

        if ($server->owner_id === $user->id) {
            throw new Exception('Pemilik server tidak dapat keluar dari server, Silahkan transfer kepemilikan atau hapus server');
        }

        $membership = ServerMember::where('server_id', $serverId)
            ->where('user_id', $user->id)
            ->first();

        if (! $membership) {
            throw new Exception('Anda bukan anggota dari server ini');
        }

        return DB::transaction(function () use ($server, $user, $membership) {
            $membership->delete();

            $channelIds = $server->channels()->pluck('id');

            if ($channelIds->isNotEmpty()) {
                ConversationMember::whereIn('conversation_id', $channelIds)
                    ->where('user_id', $user->id)
                    ->delete();
            }

            return true;
        });

    }

    /**
     * Ubah role member di server (Hanya Owner dan Admin yang berhak).
     *
     * @throws Exception
     */
    public function updateMemberRole(User $actor, string $serverId, string $targetUserId, string $role): ?ServerMember
    {
        // TODO: Ubah role member di server (hanya owner/moderator)
        $server = Server::findOrFail($serverId);

        $allowedRoles = ['admin', 'moderator', 'member'];
        if (! in_array($role, $allowedRoles, true)) {
            throw new Exception('Role yang dipilih tidak valid');
        }

        $actorMembership = ServerMember::where('server_id', $serverId)
            ->where('user_id', $actor->id)
            ->first();

        if (! $actorMembership || ! in_array($actorMembership->role, ['owner', 'admin'], true)) {
            throw new Exception('Anda tidak memiliki izin untuk mengubah role anggota');
        }

        $targetMembership = ServerMember::where('server_id', $serverId)
            ->where('user_id', $targetUserId)
            ->first();

        if (! $targetMembership) {
            throw new Exception('Anggota tidak ditemukan di server ini');
        }

        if ($targetMembership->role === 'owner' || $server->owner_id === $targetUserId) {
            throw new Exception('Role pemilik server tidak dapat diubah');
        }

        if ($actorMembership->role === 'admin' && ($targetMembership->role === 'admin' || $role === 'admin')) {
            throw new Exception('Hanya pemilik server yang dapat mengelola role Admin');
        }

        $targetMembership->update([
            'role' => $role,
        ]);

        return $targetMembership->fresh()->load(['user', 'server']);
    }

    public function kickMember(User $actor, string $serverId, string $targetUserId): bool
    {
        // TODO: Kick member dari server
        $server = Server::findOrFaild($serverId);

        if ($actor->id === $targetUserId) {
            throw new Exception('Anda tidak dapat mengeluarkan diri sendiri. Silakan gunakan fungsi keluar dari server');
        }

        $actorMembership = ServerMember::where('server_id', $serverId)
            ->where('user_id', $actor->id)
            ->first();

        if (! $actorMembership || ! in_array($actorMembership->role, ['owner', 'admin', 'moderator'], true)) {
            throw new Exception('Anda tidak memiliki izin untuk mengeluarkan anggota dari server');
        }

        $targetMembership = ServerMember::where('server_id', $serverId)
            ->where('user_id', $targetUserId)
            ->first();

        if (! $targetMembership) {
            throw new Exception('Anggota tidak ditemukan di server ini');
        }

        if ($targetMembership->role === 'owner' || $server->owner_id === $targetUserId) {
            throw new Exception('Pemilik server tidak dapat dikeluarkan dari server');
        }

        if ($actorMembership->role === 'moderator' && in_array($targetMembership->role, ['admin', 'moderator'], true)) {
            throw new Exception('Hnya pemilik server yang dapat mengeluarkan Admin');
        }

        if ($actorMembership->role === 'admin' && $targetMembership->role === 'admin') {
            throw new Exception('Hanya pemilik server yang dapat mengeluarkan Admin.');
        }

        return DB::transaction(function () use ($server, $targetUserId, $targetMembership) {
            $targetMembership->delete();

            $channelIds = $server->channels()->pluck('id');

            if ($channelIds->isNotEmpty()) {
                ConversationMember::whereIn('conversation_id', $channelIds)
                    ->where('user_id', $targetUserId)
                    ->delete();
            }

            return true;
        });
    }
}
