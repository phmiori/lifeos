<?php
declare(strict_types=1);

use Slim\App;
use App\Controllers\MusicController;
use App\Controllers\PlaylistController;
use App\Middleware\AuthMiddleware;
use App\Middleware\AdminMiddleware;

return function (App $app) {
    $app->group('/api/music', function ($group) {
        // Rotas públicas (streaming não requer auth JWT via header no <audio>, tratamos na URL ou cookies, mas como usamos proxy next, o proxy repassa. Vamos deixar liberado o stream ou usar JWT na query)
        // Para simplificar no MVP e permitir a tag <audio src="...">:
        $group->get('/songs/{id}/stream', [MusicController::class, 'stream']);

        // Rotas protegidas (precisa estar logado no NextAuth)
        $group->group('', function ($protected) {
            $protected->get('/songs', [MusicController::class, 'index']);
            $protected->get('/songs/{id}', [MusicController::class, 'show']);
            $protected->post('/songs/{id}/play', [MusicController::class, 'recordPlay']);
            
            $protected->get('/playlists', [PlaylistController::class, 'index']);
            $protected->post('/playlists', [PlaylistController::class, 'store']);
            $protected->get('/playlists/{id}', [PlaylistController::class, 'show']);
            $protected->put('/playlists/{id}', [PlaylistController::class, 'update']);
            $protected->delete('/playlists/{id}', [PlaylistController::class, 'destroy']);
            
            // Rotas admin
            $protected->group('', function ($admin) {
                $admin->post('/songs', [MusicController::class, 'store']);
                $admin->put('/songs/{id}', [MusicController::class, 'update']);
                $admin->delete('/songs/{id}', [MusicController::class, 'destroy']);
            })->add(AdminMiddleware::class);
            
        })->add(AuthMiddleware::class);
    });
};
