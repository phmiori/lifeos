<?php
declare(strict_types=1);

namespace App\Services;

class FileUploadService
{
    private array $allowedMimeTypes = [
        'audio' => ['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/flac', 'audio/wav', 'audio/x-wav'],
        'video' => ['video/mp4', 'video/webm', 'video/ogg'],
        'image' => ['image/jpeg', 'image/png', 'image/webp'],
    ];

    private array $allowedExtensions = [
        'audio' => ['mp3', 'ogg', 'flac', 'wav'],
        'video' => ['mp4', 'webm', 'ogg'],
        'image' => ['jpg', 'jpeg', 'png', 'webp'],
    ];

    private int $maxFileSizes = [
        'audio' => 50 * 1024 * 1024,    // 50 MB
        'video' => 5000 * 1024 * 1024,  // 5 GB
        'image' => 10 * 1024 * 1024,    // 10 MB
    ];

    public function validate(array $uploadedFile, string $type): void
    {
        if ($uploadedFile['error'] !== UPLOAD_ERR_OK) {
            throw new \Exception('Erro no upload do arquivo (código: ' . $uploadedFile['error'] . ')', 422);
        }

        $tmpPath   = $uploadedFile['tmp_name'];
        $extension = strtolower(pathinfo($uploadedFile['name'], PATHINFO_EXTENSION));

        if (!in_array($extension, $this->allowedExtensions[$type])) {
            throw new \Exception("Extensão não permitida: .$extension", 422);
        }

        $finfo    = new \finfo(FILEINFO_MIME_TYPE);
        $realMime = $finfo->file($tmpPath);

        // Fallback para getID3 em alguns casos ou aceitação flexível se for video
        if (!in_array($realMime, $this->allowedMimeTypes[$type])) {
            // Se for audio/x-hx-aac-adts, etc.
            if ($type === 'audio' && str_starts_with($realMime, 'audio/')) {
                 // Ok
            } else if ($type === 'video' && str_starts_with($realMime, 'video/')) {
                 // Ok
            } else {
                throw new \Exception("Tipo de arquivo não permitido: $realMime", 422);
            }
        }

        if ($uploadedFile['size'] > $this->maxFileSizes[$type]) {
            $maxMB = $this->maxFileSizes[$type] / 1024 / 1024;
            throw new \Exception("Arquivo muito grande. Máximo: {$maxMB}MB", 422);
        }
    }

    public function move(array $uploadedFile, string $type): string
    {
        $storagePath = '/var/www/storage';
        $subDir      = $storagePath . '/' . $type;

        if (!is_dir($subDir)) {
            mkdir($subDir, 0755, true);
        }

        $extension = pathinfo($uploadedFile['name'], PATHINFO_EXTENSION);
        $fileName  = bin2hex(random_bytes(16)) . '.' . strtolower($extension);
        $destPath  = $subDir . '/' . $fileName;

        if (!move_uploaded_file($uploadedFile['tmp_name'], $destPath)) {
            throw new \Exception('Falha ao mover arquivo enviado.');
        }

        return $type . '/' . $fileName;
    }
}
