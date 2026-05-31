<?php
declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class CorsMiddleware implements MiddlewareInterface
{
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        $allowedOrigins = [
            $_ENV['FRONTEND_URL'] ?? 'http://localhost:3000',
        ];

        $origin = $request->getHeaderLine('Origin');

        if ($request->getMethod() === 'OPTIONS') {
            $response = new \Slim\Psr7\Response();
            return $this->addCorsHeaders($response, $origin, $allowedOrigins)
                        ->withStatus(204);
        }

        $response = $handler->handle($request);
        return $this->addCorsHeaders($response, $origin, $allowedOrigins);
    }

    private function addCorsHeaders(
        ResponseInterface $response,
        string $origin,
        array $allowedOrigins
    ): ResponseInterface {
        if (in_array($origin, $allowedOrigins)) {
            $response = $response
                ->withHeader('Access-Control-Allow-Origin', $origin)
                ->withHeader('Access-Control-Allow-Credentials', 'true')
                ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Internal-Token, X-Internal-Secret')
                ->withHeader('Access-Control-Max-Age', '86400');
        }
        return $response;
    }
}
