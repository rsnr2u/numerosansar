<?php
// Standalone script to update DB schema
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$db = 'numerology_db';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$queries = [
    "ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS credits INT DEFAULT 0 AFTER price_yearly",
    "ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS type ENUM('trial', 'paid') DEFAULT 'paid' AFTER credits",
    "ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') DEFAULT 'active' AFTER type",
    "ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS visibility ENUM('show', 'hide') DEFAULT 'show' AFTER status",
    "ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS badge VARCHAR(50) DEFAULT NULL AFTER visibility",
    "ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS discount_price DECIMAL(10,2) DEFAULT NULL AFTER badge"
];

foreach ($queries as $q) {
    if ($conn->query($q) === TRUE) {
        echo "Query successful: $q\n";
    } else {
        echo "Error: " . $conn->error . "\n";
    }
}

$conn->close();
?>