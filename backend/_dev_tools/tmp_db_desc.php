<?php
require 'app/Config/Database.php';
$db = \Config\Database::connect();
$query = $db->query("DESCRIBE subscription_plans");
print_r($query->getResultArray());
