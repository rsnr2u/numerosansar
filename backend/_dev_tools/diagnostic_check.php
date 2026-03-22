<?php
namespace App;
// diagnostic_check.php
require 'vendor/autoload.php';


use Config\Database;

// Basic PDO check since I know the .env
$hostname = '127.0.0.1';
$database = 'numerology_db';
$username = 'root';
$password = '';

try {
    $pdo = new \PDO("mysql:host=$hostname;dbname=$database", $username, $password);
    $stmt = $pdo->prepare("SELECT id, username, role, account_status FROM users WHERE username = 'admin'");
    $stmt->execute();
    $user = $stmt->fetch(\PDO::FETCH_ASSOC);

    if ($user) {
        echo "ADMIN_FOUND: " . json_encode($user) . "\n";
    } else {
        echo "ADMIN_NOT_FOUND\n";

        // List all users to see what's there
        $stmt = $pdo->query("SELECT id, username, role FROM users LIMIT 10");
        $users = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        echo "USERS_LIST: " . json_encode($users) . "\n";
    }
} catch (\PDOException $e) {
    echo "DB_ERROR: " . $e->getMessage() . "\n";
}
