<?php
declare(strict_types=1);

use Slim\App;
use App\Controllers\AuthController;

return function (App $app) {
    $app->group('/api/auth', function ($group) {
        $group->post('/sync', [AuthController::class, 'sync']);
    });
};
