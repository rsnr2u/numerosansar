<?php
require 'app/Config/Database.php';
$db = \Config\Database::connect();
$query = $db->query("SELECT * FROM subscription_plans");
print_r($query->getResultArray());
