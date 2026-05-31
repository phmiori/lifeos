<?php
declare(strict_types=1);

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AdminController
{
    public function __construct(private \PDO $pdo) {}

    public function listUsers(Request $request, Response $response): Response
    {
        $stmt = $this->pdo->prepare('
            SELECT u.id, u.name, u.email, u.avatar_url, u.is_active, r.name as role
            FROM users u
            JOIN roles r ON r.id = u.role_id
            ORDER BY u.created_at DESC
        ');
        $stmt->execute();
        return $this->json($response, ['users' => $stmt->fetchAll()]);
    }

    public function stats(Request $request, Response $response): Response
    {
        $stats = [
            'users' => $this->pdo->query('SELECT COUNT(*) FROM users')->fetchColumn(),
            'songs' => $this->pdo->query('SELECT COUNT(*) FROM songs')->fetchColumn(),
            'movies' => $this->pdo->query('SELECT COUNT(*) FROM movies')->fetchColumn(),
            'cars' => $this->pdo->query('SELECT COUNT(*) FROM cars')->fetchColumn(),
        ];
        return $this->json($response, $stats);
    }

    private function json(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode(['success' => true, 'data' => $data]));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }
}
