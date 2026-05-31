<?php
declare(strict_types=1);

use Slim\App;
use App\Controllers\AdminController;
use App\Middleware\AuthMiddleware;
use App\Middleware\AdminMiddleware;

return function (App $app) {
    $app->group('/api/admin', function ($group) {
        $group->get('/users', [AdminController::class, 'listUsers']);
        $group->get('/stats', [AdminController::class, 'stats']);
    })->add(AuthMiddleware::class)->add(AdminMiddleware::class);
};
