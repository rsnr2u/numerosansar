<?php
header('Content-Type: application/json');
$mysqli = new mysqli("localhost", "root", "", "numerology_db");

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$sql = "SELECT * FROM numerology_letters";
$result = $mysqli->query($sql);

$rows = array();
while ($r = $result->fetch_assoc()) {
    $rows[] = $r;
}
echo json_encode($rows);
$mysqli->close();
?>