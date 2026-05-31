<?php
declare(strict_types=1);

use App\Config\Database;
use App\Controllers\AuthController;
use App\Controllers\MusicController;
use App\Controllers\PlaylistController;
use App\Controllers\MovieController;
use App\Controllers\GarageController;
use App\Controllers\AdminController;
use App\Middleware\AuthMiddleware;
use App\Middleware\AdminMiddleware;
use App\Services\StreamService;
use App\Services\FileUploadService;
use App\Services\AudioMetaService;
use Psr\Container\ContainerInterface;

return [
    // PDO instance
    \PDO::class => fn() => Database::getInstance(),

    // Services
    StreamService::class     => fn() => new StreamService(),
    FileUploadService::class => fn() => new FileUploadService(),
    AudioMetaService::class  => fn() => new AudioMetaService(),

    // Middleware
    AuthMiddleware::class  => fn() => new AuthMiddleware(),
    AdminMiddleware::class => fn() => new AdminMiddleware(),

    // Controllers
    AuthController::class     => fn(ContainerInterface $c) => new AuthController($c->get(\PDO::class)),
    MusicController::class    => fn(ContainerInterface $c) => new MusicController(
        $c->get(\PDO::class),
        $c->get(FileUploadService::class),
        $c->get(AudioMetaService::class),
        $c->get(StreamService::class)
    ),
    PlaylistController::class => fn(ContainerInterface $c) => new PlaylistController($c->get(\PDO::class)),
    MovieController::class    => fn(ContainerInterface $c) => new MovieController(
        $c->get(\PDO::class),
        $c->get(FileUploadService::class),
        $c->get(StreamService::class)
    ),
    GarageController::class   => fn(ContainerInterface $c) => new GarageController($c->get(\PDO::class)),
    AdminController::class    => fn(ContainerInterface $c) => new AdminController($c->get(\PDO::class)),
];
