<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'numerology_db';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$tables = ['client_name_checks', 'client_business_checks', 'client_mobile_checks', 'client_vehicle_checks'];
foreach ($tables as $table) {
    echo "--- $table ---\n";
    $result = $conn->query("SHOW COLUMNS FROM $table");
    $cols = [];
    while ($row = $result->fetch_assoc()) {
        $cols[] = $row['Field'];
    }
    echo implode(", ", $cols) . "\n\n";
}

$conn->close();
