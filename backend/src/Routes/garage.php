<?php
declare(strict_types=1);

use Slim\App;
use App\Controllers\GarageController;
use App\Middleware\AuthMiddleware;

return function (App $app) {
    $app->group('/api/garage', function ($group) {
        $group->get('/cars', [GarageController::class, 'index']);
        $group->post('/cars', [GarageController::class, 'store']);
        $group->get('/cars/{id}', [GarageController::class, 'show']);
        $group->put('/cars/{id}', [GarageController::class, 'update']);
        $group->delete('/cars/{id}', [GarageController::class, 'destroy']);
        
        $group->get('/cars/{id}/summary', [GarageController::class, 'summary']);
        
        $group->get('/cars/{id}/maintenances', [GarageController::class, 'listMaintenances']);
        $group->post('/cars/{id}/maintenances', [GarageController::class, 'addMaintenance']);
    })->add(AuthMiddleware::class);
};
