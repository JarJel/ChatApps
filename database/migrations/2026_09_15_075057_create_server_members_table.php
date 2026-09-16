<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('server_members', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('server_id')->nullable()->constrained('server')->cascadeOnDelete();
            $table->uuid('user_id');
            $table->string('nickname');
            $table->enum('role', ['owner', 'moderator', 'member'])->default('member');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('server_members');
    }
};
