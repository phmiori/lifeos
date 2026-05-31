<?php
declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class AuthMiddleware implements MiddlewareInterface
{
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        // Verifica se o request veio das API routes do Next.js via proxy
        $internalToken = $request->getHeaderLine('X-Internal-Token');
        $internalSecret = $request->getHeaderLine('X-Internal-Secret');

        if ($internalSecret !== $_ENV['INTERNAL_SECRET']) {
            return $this->unauthorized('Acesso negado: Segredo interno inválido.');
        }

        if (empty($internalToken)) {
            return $this->unauthorized('Token interno não fornecido.');
        }

        try {
            $payload = json_decode(base64_decode($internalToken), true);
            
            if (!is_array($payload) || !isset($payload['user_id'])) {
                throw new \Exception('Payload de token inválido');
            }

            // Injeta o usuário decodificado no request
            $request = $request->withAttribute('auth_user', [
                'id'    => $payload['user_id'],
                'email' => $payload['email'] ?? '',
                'role'  => $payload['role'] ?? 'user',
            ]);

            return $handler->handle($request);
        } catch (\Exception $e) {
            return $this->unauthorized($e->getMessage());
        }
    }

    private function unauthorized(string $message): ResponseInterface
    {
        $response = new \Slim\Psr7\Response();
        $response->getBody()->write(json_encode([
            'success' => false,
            'error'   => ['code' => 'UNAUTHORIZED', 'message' => $message],
        ]));
        return $response
            ->withStatus(401)
            ->withHeader('Content-Type', 'application/json');
    }
}
