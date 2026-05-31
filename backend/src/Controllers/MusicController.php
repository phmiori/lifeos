<?php
declare(strict_types=1);

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\FileUploadService;
use App\Services\AudioMetaService;
use App\Services\StreamService;

class MusicController
{
    public function __construct(
        private \PDO $pdo,
        private FileUploadService $uploadService,
        private AudioMetaService $metaService,
        private StreamService $streamService
    ) {}

    public function index(Request $request, Response $response): Response
    {
        // Simplificado: retorna todas as músicas ativas (sem paginação no MVP para facilitar)
        $stmt = $this->pdo->prepare('
            SELECT s.*, a.name as artist, al.title as album, al.cover_url
            FROM songs s
            LEFT JOIN artists a ON a.id = s.artist_id
            LEFT JOIN albums al ON al.id = s.album_id
            WHERE s.is_active = true
            ORDER BY s.created_at DESC
        ');
        $stmt->execute();
        $songs = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        // Formatar para o frontend (que espera 'artist' como string, não 'artist_id')
        return $this->json($response, ['songs' => $songs]);
    }

    public function show(Request $request, Response $response, array $args): Response
    {
        $stmt = $this->pdo->prepare('SELECT * FROM songs WHERE id = :id');
        $stmt->execute([':id' => $args['id']]);
        $song = $stmt->fetch();
        if (!$song) return $this->jsonError($response, 'Música não encontrada', 404);
        return $this->json($response, $song);
    }

    public function stream(Request $request, Response $response, array $args): Response
    {
        $stmt = $this->pdo->prepare('SELECT file_path, mime_type FROM songs WHERE id = :id');
        $stmt->execute([':id' => $args['id']]);
        $song = $stmt->fetch();
        
        if (!$song) {
            $response->getBody()->write('Not found');
            return $response->withStatus(404);
        }

        $fullPath = '/var/www/storage/' . $song['file_path'];
        $this->streamService->stream($fullPath, $song['mime_type']);
        return $response; // StreamService dá exit, isso é apenas para cumprir assinatura
    }

    public function store(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('auth_user');
        $uploadedFiles = $request->getUploadedFiles();

        if (empty($uploadedFiles['file'])) {
            return $this->jsonError($response, 'Nenhum arquivo enviado', 400);
        }

        /** @var \Psr\Http\Message\UploadedFileInterface $file */
        $file = $uploadedFiles['file'];
        
        // Adaptar PSR-7 UploadedFile para a estrutura do FileUploadService ($_FILES array)
        // Isso é um hack rápido para o MVP usando Slim
        $tempPath = $file->getStream()->getMetadata('uri');
        if (!$tempPath) {
             // Create a temp file if not accessible
             $tempPath = tempnam(sys_get_temp_dir(), 'upl');
             $file->moveTo($tempPath);
        }

        $fileArray = [
            'name' => $file->getClientFilename(),
            'type' => $file->getClientMediaType(),
            'tmp_name' => $tempPath,
            'error' => $file->getError(),
            'size' => $file->getSize()
        ];

        try {
            $this->uploadService->validate($fileArray, 'audio');
            $relativePath = $this->uploadService->move($fileArray, 'audio');
            
            $fullPath = '/var/www/storage/' . $relativePath;
            $meta = $this->metaService->extractMetadata($fullPath);

            $title = $_POST['title'] ?? $meta['title'] ?? pathinfo($file->getClientFilename(), PATHINFO_FILENAME);
            $artistName = $_POST['artist_name'] ?? $meta['artist'] ?? 'Desconhecido';
            
            // Buscar ou criar artista
            $stmt = $this->pdo->prepare('SELECT id FROM artists WHERE name = :name');
            $stmt->execute([':name' => $artistName]);
            $artistId = $stmt->fetchColumn();
            
            if (!$artistId) {
                $stmt = $this->pdo->prepare('INSERT INTO artists (name) VALUES (:name) RETURNING id');
                $stmt->execute([':name' => $artistName]);
                $artistId = $stmt->fetchColumn();
            }

            // Inserir música
            $stmt = $this->pdo->prepare('
                INSERT INTO songs (uploaded_by, artist_id, title, duration_secs, file_path, file_size_bytes, mime_type, bitrate_kbps, genre, year)
                VALUES (:user, :artist, :title, :duration, :path, :size, :mime, :bitrate, :genre, :year)
                RETURNING id
            ');
            $stmt->execute([
                ':user' => $user['id'],
                ':artist' => $artistId,
                ':title' => $title,
                ':duration' => $meta['duration'] ?? 0,
                ':path' => $relativePath,
                ':size' => $fileArray['size'],
                ':mime' => $fileArray['type'],
                ':bitrate' => $meta['bitrate'] ?? null,
                ':genre' => $meta['genre'] ?? null,
                ':year' => $meta['year'] ?? null,
            ]);

            return $this->json($response, ['id' => $stmt->fetchColumn()], 201);
            
        } catch (\Exception $e) {
            return $this->jsonError($response, $e->getMessage(), 422);
        }
    }
    
    public function recordPlay(Request $request, Response $response, array $args): Response
    {
        $stmt = $this->pdo->prepare('UPDATE songs SET play_count = play_count + 1 WHERE id = :id');
        $stmt->execute([':id' => $args['id']]);
        return $this->json($response, ['success' => true]);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        return $this->json($response, ['message' => 'Not implemented yet']);
    }

    public function destroy(Request $request, Response $response, array $args): Response
    {
        $stmt = $this->pdo->prepare('DELETE FROM songs WHERE id = :id');
        $stmt->execute([':id' => $args['id']]);
        return $this->json($response, ['success' => true]);
    }

    private function json(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode(['success' => true, 'data' => $data]));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }

    private function jsonError(Response $response, string $msg, int $status): Response
    {
        $response->getBody()->write(json_encode(['success' => false, 'error' => ['message' => $msg]]));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }
}
