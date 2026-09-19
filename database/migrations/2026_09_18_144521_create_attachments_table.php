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
        Schema::create('attachments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('message_id')->constrained('messages')->cascadeOnDelete();
            $table->enum('type', ['image', 'file', 'voice']);
            $table->string('disk');
            $table->string('path');
            $table->string('file_name');
            $table->string('mime_type');
            $table->bigInteger('file_size');
            $table->unsignedBigInteger('duration_seconds')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};
