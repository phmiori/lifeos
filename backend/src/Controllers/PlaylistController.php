<?php
declare(strict_types=1);

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class PlaylistController
{
    public function __construct(private \PDO $pdo) {}

    public function index(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('auth_user');
        $stmt = $this->pdo->prepare('
            SELECT * FROM playlists 
            WHERE user_id = :user_id OR is_public = true
            ORDER BY created_at DESC
        ');
        $stmt->execute([':user_id' => $user['id']]);
        return $this->json($response, ['playlists' => $stmt->fetchAll()]);
    }

    public function show(Request $request, Response $response, array $args): Response
    {
        $stmt = $this->pdo->prepare('SELECT * FROM playlists WHERE id = :id');
        $stmt->execute([':id' => $args['id']]);
        $playlist = $stmt->fetch();
        
        if (!$playlist) return $this->jsonError($response, 'Playlist não encontrada', 404);

        $stmt = $this->pdo->prepare('
            SELECT s.*, a.name as artist, ps.position
            FROM playlist_songs ps
            JOIN songs s ON s.id = ps.song_id
            LEFT JOIN artists a ON a.id = s.artist_id
            WHERE ps.playlist_id = :id
            ORDER BY ps.position ASC
        ');
        $stmt->execute([':id' => $args['id']]);
        $playlist['songs'] = $stmt->fetchAll();

        return $this->json($response, $playlist);
    }

    public function store(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('auth_user');
        $body = json_decode((string)$request->getBody(), true);
        
        $stmt = $this->pdo->prepare('
            INSERT INTO playlists (user_id, name, description, is_public)
            VALUES (:user, :name, :desc, :public)
            RETURNING id
        ');
        $stmt->execute([
            ':user' => $user['id'],
            ':name' => $body['name'] ?? 'Nova Playlist',
            ':desc' => $body['description'] ?? '',
            ':public' => $body['is_public'] ?? false ? 'true' : 'false'
        ]);
        
        return $this->json($response, ['id' => $stmt->fetchColumn()], 201);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        return $this->json($response, ['message' => 'Not implemented yet']);
    }

    public function destroy(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('auth_user');
        $stmt = $this->pdo->prepare('DELETE FROM playlists WHERE id = :id AND user_id = :user');
        $stmt->execute([':id' => $args['id'], ':user' => $user['id']]);
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
