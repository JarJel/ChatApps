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
            $table->uuid('id')->primary();
            $table->foreignUuid('server_id')->constrained('servers')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('nickname')->nullable();
            $table->enum('role', ['owner', 'moderator', 'member'])->default('member');
            $table->timestamp('joined_at')->useCurrent();
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
