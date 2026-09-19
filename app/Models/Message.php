<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Message extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'type',
        'content',
        'metadata',
        'reply_to_id',
        'edited_at',
        'deleted_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'edited_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class, 'conversation_id');
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function replyTo(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'reply_to_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Message::class, 'reply_to_id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class, 'message_id');
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(MessageReaction::class, 'message_id');
    }

    public function reactingUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'message_reactions')
            ->withPivot(['emoji'])
            ->withTimestamps();
    }

    public function mentions(): HasMany
    {
        return $this->hasMany(UserMention::class, 'message_id');
    }

    public function mentionedUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_mentions', 'message_id', 'mentioned_user_id')
            ->withTimestamps();
    }
}
