<?php
declare(strict_types=1);

namespace App\Config;

class Database
{
    private static ?\PDO $instance = null;

    public static function getInstance(): \PDO
    {
        if (self::$instance === null) {
            $dsn = sprintf(
                'pgsql:host=%s;port=%s;dbname=%s',
                $_ENV['DB_HOST'] ?? 'db',
                $_ENV['DB_PORT'] ?? '5432',
                $_ENV['DB_NAME'] ?? 'lifeos'
            );

            self::$instance = new \PDO(
                $dsn,
                $_ENV['DB_USER'] ?? 'lifeos_user',
                $_ENV['DB_PASS'] ?? 'changeme',
                [
                    \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
                    \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
                    \PDO::ATTR_EMULATE_PREPARES   => false,
                    \PDO::ATTR_STRINGIFY_FETCHES  => false,
                ]
            );
        }

        return self::$instance;
    }

    /** Atalho para prepared statements */
    public static function query(string $sql, array $params = []): \PDOStatement
    {
        $stmt = self::getInstance()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }
}
