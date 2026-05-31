<?php
declare(strict_types=1);

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\FileUploadService;
use App\Services\StreamService;

class MovieController
{
    public function __construct(
        private \PDO $pdo,
        private FileUploadService $uploadService,
        private StreamService $streamService
    ) {}

    public function index(Request $request, Response $response): Response
    {
        $stmt = $this->pdo->prepare('
            SELECT id, title, description, year, duration_secs, thumbnail_path, rating, is_active
            FROM movies
            WHERE is_active = true
            ORDER BY created_at DESC
        ');
        $stmt->execute();
        return $this->json($response, ['movies' => $stmt->fetchAll()]);
    }

    public function show(Request $request, Response $response, array $args): Response
    {
        $stmt = $this->pdo->prepare('SELECT * FROM movies WHERE id = :id');
        $stmt->execute([':id' => $args['id']]);
        $movie = $stmt->fetch();
        if (!$movie) return $this->jsonError($response, 'Filme não encontrado', 404);
        return $this->json($response, $movie);
    }

    public function stream(Request $request, Response $response, array $args): Response
    {
        $stmt = $this->pdo->prepare('SELECT file_path FROM movies WHERE id = :id');
        $stmt->execute([':id' => $args['id']]);
        $filePath = $stmt->fetchColumn();
        
        if (!$filePath) {
            $response->getBody()->write('Not found');
            return $response->withStatus(404);
        }

        $fullPath = '/var/www/storage/' . $filePath;
        // Para video, o mime type fixo como video/mp4 (poderia salvar no banco)
        $this->streamService->stream($fullPath, 'video/mp4');
        return $response;
    }

    public function store(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('auth_user');
        $uploadedFiles = $request->getUploadedFiles();

        if (empty($uploadedFiles['file'])) {
            return $this->jsonError($response, 'Nenhum arquivo enviado', 400);
        }

        $file = $uploadedFiles['file'];
        $tempPath = $file->getStream()->getMetadata('uri');
        if (!$tempPath) {
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
            $this->uploadService->validate($fileArray, 'video');
            $relativePath = $this->uploadService->move($fileArray, 'video');
            
            $title = $_POST['title'] ?? pathinfo($file->getClientFilename(), PATHINFO_FILENAME);
            
            // Thumbnail com FFmpeg
            $fullPath = '/var/www/storage/' . $relativePath;
            $thumbName = basename($relativePath, '.' . pathinfo($relativePath, PATHINFO_EXTENSION)) . '_thumb.jpg';
            $thumbRelative = 'thumbnails/' . $thumbName;
            $thumbFullPath = '/var/www/storage/' . $thumbRelative;
            
            $cmd = sprintf(
                'ffmpeg -i %s -ss 00:00:10 -vframes 1 -vf "scale=640:-1" %s 2>&1',
                escapeshellarg($fullPath),
                escapeshellarg($thumbFullPath)
            );
            exec($cmd);

            $stmt = $this->pdo->prepare('
                INSERT INTO movies (uploaded_by, title, description, year, file_path, file_size_bytes, thumbnail_path)
                VALUES (:user, :title, :desc, :year, :path, :size, :thumb)
                RETURNING id
            ');
            $stmt->execute([
                ':user' => $user['id'],
                ':title' => $title,
                ':desc' => $_POST['description'] ?? null,
                ':year' => $_POST['year'] ?? null,
                ':path' => $relativePath,
                ':size' => $fileArray['size'],
                ':thumb' => file_exists($thumbFullPath) ? $thumbRelative : null
            ]);

            return $this->json($response, ['id' => $stmt->fetchColumn()], 201);
            
        } catch (\Exception $e) {
            return $this->jsonError($response, $e->getMessage(), 422);
        }
    }
    
    public function saveProgress(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('auth_user');
        $body = json_decode((string)$request->getBody(), true);
        
        $stmt = $this->pdo->prepare('
            INSERT INTO watch_history (user_id, movie_id, progress_secs, completed)
            VALUES (:user, :movie, :prog, :comp)
            ON CONFLICT (user_id, movie_id) DO UPDATE SET
                progress_secs = EXCLUDED.progress_secs,
                completed     = EXCLUDED.completed,
                watched_at    = NOW()
        ');
        $stmt->execute([
            ':user' => $user['id'],
            ':movie' => $args['id'],
            ':prog' => $body['progress_secs'] ?? 0,
            ':comp' => $body['completed'] ?? false ? 'true' : 'false'
        ]);
        
        return $this->json($response, ['success' => true]);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        return $this->json($response, ['message' => 'Not implemented yet']);
    }

    public function destroy(Request $request, Response $response, array $args): Response
    {
        $stmt = $this->pdo->prepare('DELETE FROM movies WHERE id = :id');
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
