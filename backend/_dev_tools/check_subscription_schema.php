<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'numerology_db';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$table = 'subscriptions';
echo "COLUMNS IN $table:\n";
$result = $conn->query("SHOW COLUMNS FROM $table");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        echo $row['Field'] . "\n";
    }
} else {
    echo "Table $table not found.\n";
}

$conn->close();
