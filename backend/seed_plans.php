<?php
// Standalone script to seed initial packages
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$db = 'numerology_db';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Truncate first for clean seed
$conn->query("SET FOREIGN_KEY_CHECKS = 0");
$conn->query("TRUNCATE TABLE subscription_plans");
$conn->query("SET FOREIGN_KEY_CHECKS = 1");

if (true) {
    $packages = [
        ['Free Trial', 3, 0, 'trial', 'active', 'show', 'New User Offer', 'Try the software with 3 credits'],
        ['Starter Pack', 10, 2700, 'paid', 'active', 'show', NULL, 'Best for beginners'],
        ['Professional Pack', 30, 7500, 'paid', 'active', 'show', 'Most Popular', 'Professional use case'],
        ['Master Pack', 100, 22000, 'paid', 'active', 'show', 'Best Value', 'Enterprise level analysis']
    ];

    $stmt = $conn->prepare("INSERT INTO subscription_plans (name, credits, price_monthly, price_yearly, type, status, visibility, badge, description, modules) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    foreach ($packages as $p) {
        $price_yearly = $p[2] * 12; // Placeholder
        $modules = json_encode([]);
        $stmt->bind_param("siddssssss", $p[0], $p[1], $p[2], $price_yearly, $p[3], $p[4], $p[5], $p[6], $p[7], $modules);
        $stmt->execute();
    }
    echo "Seeding successful.\n";
} else {
    echo "Table not empty, skipping seeding.\n";
}

$conn->close();
?>