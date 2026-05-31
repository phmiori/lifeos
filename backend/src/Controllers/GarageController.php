<?php
declare(strict_types=1);

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class GarageController
{
    public function __construct(private \PDO $pdo) {}

    public function index(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('auth_user');
        
        $stmt = $this->pdo->prepare('
            SELECT id, brand, model, year_model, plate, status, purchase_price, image_urls 
            FROM cars 
            WHERE owner_id = :owner_id 
            ORDER BY created_at DESC
        ');
        $stmt->execute([':owner_id' => $user['id']]);
        
        return $this->json($response, ['cars' => $stmt->fetchAll()]);
    }

    public function show(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('auth_user');
        
        $stmt = $this->pdo->prepare('SELECT * FROM cars WHERE id = :id AND owner_id = :owner_id');
        $stmt->execute([':id' => $args['id'], ':owner_id' => $user['id']]);
        $car = $stmt->fetch();
        
        if (!$car) return $this->jsonError($response, 'Carro não encontrado', 404);
        
        return $this->json($response, $car);
    }

    public function store(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('auth_user');
        $body = json_decode((string)$request->getBody(), true);
        
        $stmt = $this->pdo->prepare('
            INSERT INTO cars (owner_id, brand, model, year_manufacture, year_model, color, plate, vin, purchase_price, purchase_date, purchase_km)
            VALUES (:owner, :brand, :model, :year_manuf, :year_model, :color, :plate, :vin, :price, :date, :km)
            RETURNING id
        ');
        
        $stmt->execute([
            ':owner' => $user['id'],
            ':brand' => $body['brand'] ?? '',
            ':model' => $body['model'] ?? '',
            ':year_manuf' => $body['year_manufacture'] ?? date('Y'),
            ':year_model' => $body['year_model'] ?? date('Y'),
            ':color' => $body['color'] ?? null,
            ':plate' => $body['plate'] ?? null,
            ':vin' => $body['vin'] ?? null,
            ':price' => $body['purchase_price'] ?? 0,
            ':date' => $body['purchase_date'] ?? date('Y-m-d'),
            ':km' => $body['purchase_km'] ?? null,
        ]);
        
        return $this->json($response, $stmt->fetch(), 201);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        // Simplificado para MVP
        return $this->json($response, ['message' => 'Not implemented yet']);
    }

    public function destroy(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('auth_user');
        $stmt = $this->pdo->prepare('DELETE FROM cars WHERE id = :id AND owner_id = :owner_id');
        $stmt->execute([':id' => $args['id'], ':owner_id' => $user['id']]);
        return $this->json($response, ['success' => true]);
    }

    public function summary(Request $request, Response $response, array $args): Response
    {
        $user = $request->getAttribute('auth_user');
        $stmt = $this->pdo->prepare('SELECT * FROM car_financial_summary WHERE car_id = :id AND owner_id = :owner_id');
        $stmt->execute([':id' => $args['id'], ':owner_id' => $user['id']]);
        $summary = $stmt->fetch();
        
        if (!$summary) return $this->jsonError($response, 'Não encontrado', 404);
        return $this->json($response, $summary);
    }

    public function listMaintenances(Request $request, Response $response, array $args): Response
    {
        $stmt = $this->pdo->prepare('SELECT * FROM maintenances WHERE car_id = :id ORDER BY date DESC');
        $stmt->execute([':id' => $args['id']]);
        return $this->json($response, ['maintenances' => $stmt->fetchAll()]);
    }

    public function addMaintenance(Request $request, Response $response, array $args): Response
    {
        $body = json_decode((string)$request->getBody(), true);
        
        $stmt = $this->pdo->prepare('
            INSERT INTO maintenances (car_id, date, description, category, cost, km_at_service, shop_name)
            VALUES (:car_id, :date, :desc, :cat, :cost, :km, :shop)
            RETURNING id
        ');
        
        $stmt->execute([
            ':car_id' => $args['id'],
            ':date' => $body['date'] ?? date('Y-m-d'),
            ':desc' => $body['description'] ?? '',
            ':cat' => $body['category'] ?? null,
            ':cost' => $body['cost'] ?? 0,
            ':km' => $body['km_at_service'] ?? null,
            ':shop' => $body['shop_name'] ?? null,
        ]);
        
        return $this->json($response, $stmt->fetch(), 201);
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
