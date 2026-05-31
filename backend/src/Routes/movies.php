<?php
declare(strict_types=1);

use Slim\App;
use App\Controllers\MovieController;
use App\Middleware\AuthMiddleware;
use App\Middleware\AdminMiddleware;

return function (App $app) {
    $app->group('/api/movies', function ($group) {
        $group->get('/{id}/stream', [MovieController::class, 'stream']);

        $group->group('', function ($protected) {
            $protected->get('', [MovieController::class, 'index']);
            $protected->get('/{id}', [MovieController::class, 'show']);
            $protected->post('/{id}/progress', [MovieController::class, 'saveProgress']);
            
            // Rotas admin
            $protected->group('', function ($admin) {
                $admin->post('', [MovieController::class, 'store']);
                $admin->put('/{id}', [MovieController::class, 'update']);
                $admin->delete('/{id}', [MovieController::class, 'destroy']);
            })->add(AdminMiddleware::class);
            
        })->add(AuthMiddleware::class);
    });
};
