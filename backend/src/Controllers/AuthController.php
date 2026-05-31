<?php
declare(strict_types=1);

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AuthController
{
    public function __construct(private \PDO $pdo) {}

    public function sync(Request $request, Response $response): Response
    {
        $body = json_decode((string) $request->getBody(), true);
        
        $googleId = $body['google_id'] ?? null;
        $email    = $body['email'] ?? null;
        $name     = $body['name'] ?? null;
        $avatar   = $body['avatar_url'] ?? null;

        if (!$googleId || !$email || !$name) {
            return $this->jsonError($response, 'Dados incompletos', 422);
        }

        $isAdmin = strtolower($email) === strtolower($_ENV['ADMIN_EMAIL'] ?? '');

        // Buscar usuário existente
        $stmt = $this->pdo->prepare('
            SELECT u.id, u.email, u.name, r.name as role 
            FROM users u
            JOIN roles r ON r.id = u.role_id
            WHERE u.google_id = :google_id OR u.email = :email
        ');
        $stmt->execute([':google_id' => $googleId, ':email' => $email]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($user) {
            // Atualiza dados
            $this->pdo->prepare('
                UPDATE users SET last_login_at = NOW(), name = :name, avatar_url = :avatar, google_id = :google_id
                WHERE id = :id
            ')->execute([
                ':name' => $name,
                ':avatar' => $avatar,
                ':google_id' => $googleId,
                ':id' => $user['id']
            ]);
            
            return $this->json($response, [
                'id' => $user['id'],
                'role' => $user['role']
            ]);
        }

        // Criar novo
        $roleId = $isAdmin ? 1 : 2;
        $stmt = $this->pdo->prepare('
            INSERT INTO users (google_id, email, name, avatar_url, role_id, last_login_at)
            VALUES (:google_id, :email, :name, :avatar, :role_id, NOW())
            RETURNING id, (SELECT name FROM roles WHERE id = :role_id2) as role
        ');
        $stmt->execute([
            ':google_id' => $googleId,
            ':email'     => $email,
            ':name'      => $name,
            ':avatar'    => $avatar,
            ':role_id'   => $roleId,
            ':role_id2'  => $roleId,
        ]);
        
        $newUser = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $this->json($response, $newUser);
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
