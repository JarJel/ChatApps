<?php

namespace App\Services;

use App\Models\Attachment;
use Illuminate\Http\UploadedFile;

class AttachmentService
{
    public function uploadFile(UploadedFile $file, string $messageId, string $disk = 'public'): ?Attachment
    {
        // TODO: Simpan file ke storage disk, ekstrak metadata (mime, size, name), dan simpan record ke tabel attachments
        return null;
    }

    public function deleteAttachment(string $attachmentId): bool
    {
        // TODO: Hapus file fisik dari storage disk dan hapus record dari database
        return false;
    }
}
