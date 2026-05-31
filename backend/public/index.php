<?php
declare(strict_types=1);

use DI\ContainerBuilder;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

// ── Variáveis de ambiente ────────────────────────────────────────────────────
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

// ── Container de dependências (PHP-DI) ──────────────────────────────────────
$containerBuilder = new ContainerBuilder();
$containerBuilder->addDefinitions(__DIR__ . '/../src/Config/container.php');

try {
    $container = $containerBuilder->build();
} catch (Exception $e) {
    error_log('Container build error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => ['message' => 'Server error']]);
    exit;
}

AppFactory::setContainer($container);
$app = AppFactory::create();

// ── Middlewares globais ──────────────────────────────────────────────────────
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->add(new App\Middleware\CorsMiddleware());

// ── Error handler ───────────────────────────────────────────────────────────
$errorMiddleware = $app->addErrorMiddleware(
    displayErrorDetails: ($_ENV['APP_ENV'] ?? 'production') === 'development',
    logErrors: true,
    logErrorDetails: true
);

$errorMiddleware->setDefaultErrorHandler(function (
    \Psr\Http\Message\ServerRequestInterface $request,
    Throwable $exception,
    bool $displayErrorDetails
) use ($app) {
    $payload = [
        'success' => false,
        'error'   => [
            'code'    => 'SERVER_ERROR',
            'message' => $displayErrorDetails
                ? $exception->getMessage()
                : 'Erro interno do servidor',
        ],
    ];

    $response = $app->getResponseFactory()->createResponse();
    $response->getBody()->write(json_encode($payload));

    $statusCode = $exception instanceof \Slim\Exception\HttpException
        ? $exception->getCode()
        : 500;

    return $response
        ->withStatus($statusCode > 0 ? $statusCode : 500)
        ->withHeader('Content-Type', 'application/json');
});

// ── Registrar rotas ─────────────────────────────────────────────────────────
(require __DIR__ . '/../src/Routes/auth.php')($app);
(require __DIR__ . '/../src/Routes/music.php')($app);
(require __DIR__ . '/../src/Routes/movies.php')($app);
(require __DIR__ . '/../src/Routes/garage.php')($app);
(require __DIR__ . '/../src/Routes/admin.php')($app);

// Health check
$app->get('/api/health', function ($request, $response) {
    $response->getBody()->write(json_encode([
        'success' => true,
        'data'    => ['status' => 'ok', 'timestamp' => date('c')],
    ]));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->run();
