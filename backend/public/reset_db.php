<?php
$mysqli = new mysqli("localhost", "root", "", "numerology_db");
if ($mysqli->connect_errno)
    die("Connect failed: " . $mysqli->connect_error);

$tables = [
    'numerology_letters',
    'numerology_planets',
    'compound_numbers',
    'saved_names',
    'users',
    'letter_mappings',
    'numerology_systems',
    'migrations'
];

foreach ($tables as $table) {
    if ($mysqli->query("DROP TABLE IF EXISTS `$table`")) {
        echo "Dropped $table<br>";
    } else {
        echo "Error dropping $table: " . $mysqli->error . "<br>";
    }
}
echo "Database reset complete.";
?>