<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasUuids, Notifiable, Searchable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'phone',
        'google_id',
        'display_name',
        'avatar_url',
        'bio',
        'status',
        'custom_status',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function toSearchableArray(): array {
        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'username'          => $this->username,
            'display_name'      => $this->display_name,
            'email'             => $this->email,
        ];
    }

    // FRIENDSHIPS (1:N)
    public function friendshipsInitiated(): HasMany
    {
        return $this->hasMany(Friendship::class, 'requester_id');
    }

    public function friendshipsReceived(): HasMany
    {
        return $this->hasMany(Friendship::class, 'addressee_id');
    }

    public function blockedFriendships(): HasMany
    {
        return $this->hasMany(Friendship::class, 'blocked_by');
    }

    // SERVERS (1:N & N:N via server_members)
    public function ownedServers(): HasMany
    {
        return $this->hasMany(Server::class, 'owner_id');
    }

    public function serverMemberships(): HasMany
    {
        return $this->hasMany(ServerMember::class, 'user_id');
    }

    public function servers(): BelongsToMany
    {
        return $this->belongsToMany(Server::class, 'server_members')
            ->withPivot(['role', 'nickname', 'joined_at'])
            ->withTimestamps();
    }

    // CONVERSATIONS (1:N & N:N via conversation_members)
    public function createdConversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'created_by');
    }

    public function conversationMemberships(): HasMany
    {
        return $this->hasMany(ConversationMember::class, 'user_id');
    }

    public function conversations(): BelongsToMany
    {
        return $this->belongsToMany(Conversation::class, 'conversation_members')
            ->withPivot(['role', 'last_read_at', 'joined_at'])
            ->withTimestamps();
    }

    // MESSAGES (1:N & N:N via message_reactions & user_mentions)
    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function messageReactions(): HasMany
    {
        return $this->hasMany(MessageReaction::class, 'user_id');
    }

    public function reactedMessages(): BelongsToMany
    {
        return $this->belongsToMany(Message::class, 'message_reactions')
            ->withPivot(['emoji'])
            ->withTimestamps();
    }

    public function mentions(): HasMany
    {
        return $this->hasMany(UserMention::class, 'mentioned_user_id');
    }

    public function mentionedInMessages(): BelongsToMany
    {
        return $this->belongsToMany(Message::class, 'user_mentions', 'mentioned_user_id', 'message_id')
            ->withTimestamps();
    }

    // INVITATIONS (1:N)
    public function createdInvitations(): HasMany
    {
        return $this->hasMany(Invitation::class, 'created_by');
    }

    public function receivedInvitations(): HasMany
    {
        return $this->hasMany(Invitation::class, 'invited_user_id');
    }

    // CALL SESSIONS (1:N & N:N via call_participants)
    public function startedCallSessions(): HasMany
    {
        return $this->hasMany(CallSession::class, 'started_by');
    }

    public function callParticipations(): HasMany
    {
        return $this->hasMany(CallParticipant::class, 'user_id');
    }

    public function callSessions(): BelongsToMany
    {
        return $this->belongsToMany(CallSession::class, 'call_participants')
            ->withPivot(['joined_at', 'left_at', 'mic_muted', 'camera_on'])
            ->withTimestamps();
    }
}
