<?php
require 'vendor/autoload.php';

$app = Config\Services::codeigniter(new Config\App());
$app->initialize();

$db = \Config\Database::connect();
$query = $db->query('SELECT * FROM client_business_checks LIMIT 5');
print_r($query->getResultArray());
